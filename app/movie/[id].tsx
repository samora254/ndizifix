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
import { ChevronLeft, Play, Maximize2 } from 'lucide-react-native';
import { useAppState } from '@/contexts/AppStateContext';
import { useAdmin } from '@/contexts/AdminContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const videoRef = useRef<ExpoVideo>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const isOrientationLocked = useRef(false);
  const hasAutoPlayed = useRef(false);

  const { updateWatchProgress, isLoggedIn, hasActiveSubscription } = useAppState();
  const { movies } = useAdmin();

  const currentMovie = movies?.find((v) => v.id === id);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('[Movie] User not logged in, redirecting to sign in');
      router.replace('/sign-in');
      return;
    }

    if (!hasActiveSubscription) {
      console.log('[Movie] No active subscription, redirecting to subscription');
      router.replace('/subscription');
      return;
    }

    const initOrientation = async () => {
      if (Platform.OS !== 'web') {
        try {
          await ScreenOrientation.unlockAsync();
          console.log('[Movie Init] Orientation unlocked');
        } catch (err) {
          console.log('[Movie Init] Error unlocking orientation:', err);
        }
      }
    };

    initOrientation();

    return () => {
      const currentVideo = videoRef.current;
      const cleanup = async () => {
        if (currentVideo) {
          try {
            const status = await currentVideo.getStatusAsync();
            if (status.isLoaded) {
              await currentVideo.unloadAsync();
            }
          } catch (err) {
            console.log('[Movie Cleanup] Error unloading video:', err);
          }
        }

        if (Platform.OS !== 'web' && isOrientationLocked.current) {
          try {
            await ScreenOrientation.unlockAsync();
            isOrientationLocked.current = false;
            console.log('[Movie Cleanup] Orientation unlocked');
          } catch (err) {
            console.log('[Movie Cleanup] Error unlocking orientation:', err);
          }
        }
      };

      cleanup();
    };
  }, [router, isLoggedIn, hasActiveSubscription]);

  useEffect(() => {
    if (currentMovie && videoRef.current && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      const autoPlay = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          await videoRef.current?.playAsync();
          setIsPlaying(true);
        } catch (error) {
          console.log('[Movie AutoPlay] Error:', error);
        }
      };
      autoPlay();
    }
  }, [currentMovie]);

  if (!currentMovie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

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
      console.log('[Movie PlayPause] Error:', error);
    }
  };

  const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    if (playbackStatus.isLoaded) {
      setIsLoading(false);
      setLoadError(null);

      if (currentMovie && playbackStatus.durationMillis && playbackStatus.positionMillis) {
        const progress = playbackStatus.positionMillis / playbackStatus.durationMillis;

        if (playbackStatus.didJustFinish || progress >= 0.95) {
          console.log('[Movie Watch] Movie completed');
          updateWatchProgress(currentMovie.id, 1, true);
          setIsPlaying(false);
        } else if (progress > 0.05) {
          updateWatchProgress(currentMovie.id, progress, false);
        }
      }
    } else if (playbackStatus.error) {
      console.error('[Movie PlaybackStatus] Error:', playbackStatus.error);
      setIsLoading(false);
      
      let errorMessage = 'Failed to load video.';
      
      if (currentMovie?.videoUrl.includes('youtube.com')) {
        errorMessage = '❌ YouTube videos cannot be played. Please use AWS S3 or direct video URLs instead.';
      } else if (currentMovie?.videoUrl.includes('drive.google.com')) {
        errorMessage = '⚠️ Google Drive video failed to load. Try using AWS S3 for better reliability, or make sure the file is publicly shared.';
      }
      
      setLoadError(errorMessage);
    }
  };

  const enterFullscreen = async () => {
    console.log('[Movie Fullscreen] Entering fullscreen mode');
    console.log('[Movie Fullscreen] Platform:', Platform.OS);
    console.log('[Movie Fullscreen] Movie orientation:', currentMovie?.orientation);

    setIsFullscreen(true);

    if (Platform.OS !== 'web') {
      try {
        console.log('[Movie Fullscreen] Attempting to lock orientation to landscape');
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        isOrientationLocked.current = true;
        console.log('[Movie Fullscreen] ✅ Orientation successfully locked to LANDSCAPE');
      } catch (error) {
        console.error('[Movie Fullscreen] ❌ Error locking orientation:', error);
      }
    } else {
      console.log('[Movie Fullscreen] Web platform detected, skipping orientation lock');
    }
  };

  const exitFullscreen = async () => {
    console.log('[Movie Fullscreen] Exiting fullscreen mode');

    setIsFullscreen(false);

    if (Platform.OS !== 'web' && isOrientationLocked.current) {
      try {
        console.log('[Movie Fullscreen] Unlocking orientation');
        await ScreenOrientation.unlockAsync();
        isOrientationLocked.current = false;
        console.log('[Movie Fullscreen] ✅ Orientation unlocked');
      } catch (error) {
        console.error('[Movie Fullscreen] Error unlocking orientation:', error);
      }
    }
  };

  const isLandscapeVideo = currentMovie?.orientation === 'landscape';

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
            {currentMovie.title}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
      )}

      <TouchableOpacity
        style={[videoContainerStyle, isFullscreen && StyleSheet.absoluteFillObject]}
        activeOpacity={1}
        onPress={togglePlayPause}
      >
        {currentMovie && (
          <ExpoVideo
            key={currentMovie.id}
            ref={videoRef}
            source={{ uri: currentMovie.videoUrl }}
            style={videoStyle}
            resizeMode={videoResizeMode}
            shouldPlay={false}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          />
        )}

        {isLoading && !loadError && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF3B5C" />
          </View>
        )}

        {loadError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>{loadError}</Text>
            <Text style={styles.errorSubtitle}>Video URL: {currentMovie?.videoUrl.substring(0, 50)}...</Text>
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
              {currentMovie?.title}
            </Text>
            <Text style={styles.fullscreenSubtitle}>
              {currentMovie?.category}
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
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.movieInfoSection}>
            <Text style={styles.movieTitle}>{currentMovie.title}</Text>
            <Text style={styles.movieMeta}>
              {currentMovie.duration}s • {currentMovie.category}
            </Text>
            <Text style={styles.movieDescription}>
              {currentMovie.description}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{currentMovie.category}</Text>
              </View>
              <Text style={styles.statsText}>
                {formatViews(currentMovie.views)} views
              </Text>
              <Text style={styles.statsText}>
                {formatLikes(currentMovie.likes)} likes
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function formatViews(views: number) {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

function formatLikes(likes: number) {
  if (likes >= 1000000) {
    return `${(likes / 1000000).toFixed(1)}M`;
  }
  if (likes >= 1000) {
    return `${(likes / 1000).toFixed(1)}K`;
  }
  return likes.toString();
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
  movieInfoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  movieMeta: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  movieDescription: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 22,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
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
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  errorSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
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
