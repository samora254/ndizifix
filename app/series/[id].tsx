import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Video as ExpoVideo, ResizeMode, AVPlaybackStatus } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ChevronLeft, Play, ChevronDown, ChevronUp, Maximize2 } from 'lucide-react-native';
import { series, Episode } from '@/mocks/videos';
import { useAppState } from '@/contexts/AppStateContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SeriesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const videoRef = useRef<ExpoVideo>(null);

  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [currentSeasonNumber, setCurrentSeasonNumber] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isOrientationLocked = useRef(false);
  const hasAutoPlayed = useRef(false);
  const [showFloatingSelector, setShowFloatingSelector] = useState(false);

  const { updateWatchProgress, isLoggedIn, hasActiveSubscription } = useAppState();

  const currentSeries = series.find((s) => s.id === id);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('[Series] User not logged in, redirecting to sign in');
      router.replace('/sign-in');
      return;
    }

    if (!hasActiveSubscription) {
      console.log('[Series] No active subscription, redirecting to subscription');
      router.replace('/subscription');
      return;
    }

    const initOrientation = async () => {
      if (Platform.OS !== 'web') {
        try {
          await ScreenOrientation.unlockAsync();
          console.log('[Init] Orientation unlocked');
        } catch (err) {
          console.log('[Init] Error unlocking orientation:', err);
        }
      }
    };

    initOrientation();

    if (currentSeries && !currentEpisode) {
      const firstEpisode = currentSeries.seasons[0]?.episodes[0];
      if (firstEpisode) {
        setCurrentEpisode(firstEpisode);
        setCurrentSeasonNumber(1);
      }
    }

    return () => {
      const cleanup = async () => {
        const currentVideo = videoRef.current;
        if (currentVideo) {
          try {
            const status = await currentVideo.getStatusAsync();
            if (status.isLoaded) {
              await currentVideo.unloadAsync();
            }
          } catch (err) {
            console.log('[Cleanup] Error unloading video:', err);
          }
        }

        if (Platform.OS !== 'web' && isOrientationLocked.current) {
          try {
            await ScreenOrientation.unlockAsync();
            isOrientationLocked.current = false;
            console.log('[Cleanup] Orientation unlocked');
          } catch (err) {
            console.log('[Cleanup] Error unlocking orientation:', err);
          }
        }
      };

      cleanup();
    };
  }, [currentSeries, currentEpisode]);

  useEffect(() => {
    if (currentEpisode && videoRef.current && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      const autoPlay = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          await videoRef.current?.playAsync();
          setIsPlaying(true);
        } catch (error) {
          console.log('[AutoPlay] Error:', error);
        }
      };
      autoPlay();
    }
  }, [currentEpisode]);

  if (!currentSeries) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Series not found</Text>
      </View>
    );
  }

  const handleEpisodeSelect = async (episode: Episode, seasonNumber: number) => {
    console.log('[Episode] Switching to:', episode.title);
    
    hasAutoPlayed.current = false;
    setIsLoading(true);
    setIsPlaying(false);
    
    if (videoRef.current) {
      try {
        const status = await videoRef.current.getStatusAsync();
        if (status.isLoaded) {
          await videoRef.current.unloadAsync();
        }
      } catch (err) {
        console.log('[Episode] Error unloading previous video:', err);
      }
    }

    setCurrentEpisode(episode);
    setCurrentSeasonNumber(seasonNumber);
  };

  const togglePlayPause = async () => {
    if (!videoRef.current || isLoading) {
      return;
    }

    try {
      const status = await videoRef.current.getStatusAsync();
      if (!status.isLoaded) {
        return;
      }

      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.log('[PlayPause] Error:', error);
    }
  };

  const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    if (playbackStatus.isLoaded) {
      setIsLoading(false);

      if (currentEpisode && playbackStatus.durationMillis && playbackStatus.positionMillis) {
        const progress = playbackStatus.positionMillis / playbackStatus.durationMillis;

        if (playbackStatus.didJustFinish || progress >= 0.95) {
          console.log('[Watch] Episode completed');
          updateWatchProgress(currentEpisode.id, 1, true);
          setIsPlaying(false);
        } else if (progress > 0.05) {
          updateWatchProgress(currentEpisode.id, progress, false);
        }
      }
    }
  };



  const enterFullscreen = async () => {
    console.log('[Series Fullscreen] Entering fullscreen mode');
    console.log('[Series Fullscreen] Platform:', Platform.OS);
    console.log('[Series Fullscreen] Episode orientation:', currentEpisode?.orientation);

    setIsFullscreen(true);

    if (Platform.OS !== 'web') {
      try {
        console.log('[Series Fullscreen] Attempting to lock orientation to landscape');
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        isOrientationLocked.current = true;
        console.log('[Series Fullscreen] ✅ Orientation successfully locked to LANDSCAPE');
      } catch (error) {
        console.error('[Series Fullscreen] ❌ Error locking orientation:', error);
      }
    } else {
      console.log('[Series Fullscreen] Web platform detected, skipping orientation lock');
    }
  };

  const exitFullscreen = async () => {
    console.log('[Fullscreen] Exiting fullscreen mode');

    setIsFullscreen(false);

    if (Platform.OS !== 'web' && isOrientationLocked.current) {
      try {
        console.log('[Fullscreen] Unlocking orientation');
        await ScreenOrientation.unlockAsync();
        isOrientationLocked.current = false;
        console.log('[Fullscreen] ✅ Orientation unlocked');
      } catch (error) {
        console.error('[Fullscreen] Error unlocking orientation:', error);
      }
    }
  };

  const isLandscapeVideo = currentEpisode?.orientation === 'landscape';

  const videoContainerStyle = isFullscreen
    ? styles.fullscreenVideoWrapper
    : isLandscapeVideo
    ? styles.videoContainerLandscape
    : styles.videoContainer;

  const videoStyle = isFullscreen
    ? styles.fullscreenVideo
    : isLandscapeVideo
    ? styles.videoLandscape
    : styles.video;

  const videoResizeMode = isFullscreen || isLandscapeVideo
    ? ResizeMode.CONTAIN
    : ResizeMode.COVER;

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden={isFullscreen} />
      <Stack.Screen options={{ headerShown: false }} />

      {!isFullscreen && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentSeries.title}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
      )}

      <TouchableOpacity
        style={[videoContainerStyle, isFullscreen && StyleSheet.absoluteFillObject]}
        activeOpacity={1}
        onPress={togglePlayPause}
      >
        {currentEpisode && (
          <ExpoVideo
            key={currentEpisode.id}
            ref={videoRef}
            source={{ uri: currentEpisode.videoUrl }}
            style={videoStyle}
            resizeMode={videoResizeMode}
            shouldPlay={false}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          />
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF3B5C" />
          </View>
        )}

        {!isPlaying && !isLoading && (
          <View style={styles.pauseOverlay}>
            <View style={styles.pauseButton}>
              <Play size={48} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          </View>
        )}
      </TouchableOpacity>

      {isFullscreen && (
        <View style={styles.fullscreenOverlay} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.fullscreenExitButton}
            onPress={exitFullscreen}
            activeOpacity={0.7}
          >
            <View style={styles.fullscreenExitButtonInner}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.fullscreenInfo}>
            <Text style={styles.fullscreenTitle} numberOfLines={1}>
              {currentEpisode?.title}
            </Text>
            <Text style={styles.fullscreenSubtitle}>
              Season {currentSeasonNumber} • Episode {currentEpisode?.episodeNumber}
            </Text>
          </View>
        </View>
      )}

      {!isFullscreen && isLandscapeVideo && (
        <TouchableOpacity
          style={styles.fullscreenButton}
          onPress={enterFullscreen}
          activeOpacity={0.7}
        >
          <View style={styles.fullscreenButtonInner}>
            <Maximize2 size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      )}

      {!isFullscreen && (
        <View style={styles.floatingEpisodeSelectorContainer}>
          <TouchableOpacity
            style={styles.floatingEpisodeSelectorToggle}
            onPress={() => setShowFloatingSelector(!showFloatingSelector)}
            activeOpacity={0.8}
          >
            <View style={styles.floatingToggleContent}>
              <View>
                <Text style={styles.floatingToggleTitle} numberOfLines={1}>
                  Episode {currentEpisode?.episodeNumber}
                </Text>
                <Text style={styles.floatingToggleSubtitle}>
                  Season {currentSeasonNumber} • {currentSeries.seasons.reduce((acc, s) => acc + s.episodes.length, 0)} episodes
                </Text>
              </View>
              {showFloatingSelector ? (
                <ChevronDown size={20} color="#FFFFFF" />
              ) : (
                <ChevronUp size={20} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>

          {showFloatingSelector && (
            <View style={styles.floatingEpisodesList}>
              <ScrollView 
                style={styles.floatingScrollView}
                contentContainerStyle={styles.floatingScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {currentSeries.seasons.map((season) => (
                  <View key={season.seasonNumber} style={styles.floatingSeasonSection}>
                    <Text style={styles.floatingSeasonTitle}>Season {season.seasonNumber}</Text>
                    <View style={styles.floatingEpisodesGrid}>
                      {season.episodes.map((episode) => {
                        const isCurrentEpisode = currentEpisode?.id === episode.id;
                        return (
                          <TouchableOpacity
                            key={episode.id}
                            style={[
                              styles.floatingEpisodeButton,
                              isCurrentEpisode && styles.floatingEpisodeButtonActive,
                            ]}
                            onPress={() => {
                              handleEpisodeSelect(episode, season.seasonNumber);
                              setShowFloatingSelector(false);
                            }}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.floatingEpisodeNumber,
                                isCurrentEpisode && styles.floatingEpisodeNumberActive,
                              ]}
                            >
                              {episode.episodeNumber}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}



      {!isFullscreen && (
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {currentEpisode && (
            <View style={styles.episodeInfoSection}>
              <Text style={styles.episodeTitle}>{currentEpisode.title}</Text>
              <Text style={styles.episodeMeta}>
                Season {currentSeasonNumber} • Episode {currentEpisode.episodeNumber}
              </Text>
              <Text style={styles.episodeDescription}>
                {currentEpisode.description}
              </Text>
            </View>
          )}

          <View style={styles.seriesInfoSection}>
            <Text style={styles.seriesTitle}>{currentSeries.title}</Text>
            <Text style={styles.seriesDescription}>
              {currentSeries.description}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{currentSeries.category}</Text>
              </View>
              <Text style={styles.statsText}>
                {currentSeries.seasons.length} Season
                {currentSeries.seasons.length > 1 ? 's' : ''}
              </Text>
            </View>
          </View>


        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#0A0A0A',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerSpacer: {
    width: 44,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 16 / 9,
    backgroundColor: '#000000',
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 16 / 9,
  },
  videoContainerLandscape: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 9 / 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  videoLandscape: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 9 / 16,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  pauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 59, 92, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullscreenVideoWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  fullscreenExitButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1000,
  },
  fullscreenExitButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  fullscreenTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  fullscreenSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  episodeInfoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  episodeTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  episodeMeta: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  episodeDescription: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  seriesInfoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  seriesTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  seriesDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryBadge: {
    backgroundColor: '#FF3B5C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  statsText: {
    fontSize: 13,
    color: '#CCCCCC',
    fontWeight: '600' as const,
  },

  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  floatingEpisodeSelectorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  floatingEpisodeSelectorToggle: {
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 59, 92, 0.3)',
  },
  floatingToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingToggleTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  floatingToggleSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  floatingEpisodesList: {
    backgroundColor: 'rgba(10, 10, 10, 0.98)',
    maxHeight: 300,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  floatingScrollView: {
    maxHeight: 300,
  },
  floatingScrollContent: {
    padding: 16,
  },
  floatingSeasonSection: {
    marginBottom: 20,
  },
  floatingSeasonTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  floatingEpisodesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  floatingEpisodeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  floatingEpisodeButtonActive: {
    backgroundColor: '#FF3B5C',
    borderColor: '#FF3B5C',
  },
  floatingEpisodeNumber: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  floatingEpisodeNumberActive: {
    color: '#FFFFFF',
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 380,
    right: 20,
    zIndex: 20,
  },
  fullscreenButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 59, 92, 0.5)',
  },
});
