import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
  Share,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  ScrollView,

} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Video as ExpoVideo, ResizeMode, AVPlaybackStatus } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Play,
  Maximize2,
  Send,
  ChevronLeft,
} from 'lucide-react-native';
import { Episode } from '@/mocks/videos';
import { useAppState } from '@/contexts/AppStateContext';
import { useAdmin } from '@/contexts/AdminContext';

const screenDimensions = Dimensions.get('window');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = screenDimensions;

export default function VideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const videoRef = useRef<ExpoVideo>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isOrientationLocked = useRef(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<{id: string; author: string; text: string; timestamp: string}[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const watchProgressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const { isLiked, toggleLike, updateWatchProgress, isLoggedIn, hasActiveSubscription } = useAppState();
  const { movies, series } = useAdmin();

  let video = movies.find((v) => v.id === id);
  let episode: Episode | undefined;

  if (!video) {
    for (const s of series) {
      for (const season of s.seasons) {
        const ep = season.episodes.find((e) => e.id === id);
        if (ep) {
          episode = ep;
          video = {
            id: ep.id,
            title: ep.title,
            thumbnail: ep.thumbnail,
            videoUrl: ep.videoUrl,
            duration: ep.duration,
            views: s.views,
            likes: s.likes,
            category: s.category,
            description: ep.description,
            uploadDate: s.uploadDate,
            orientation: ep.orientation,
          };
          break;
        }
      }
      if (episode) break;
    }
  }
  const videoIsLiked = id ? isLiked(id) : false;

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('[Video] User not logged in, redirecting to sign in');
      router.replace('/sign-in');
      return;
    }

    if (!hasActiveSubscription) {
      console.log('[Video] No active subscription, redirecting to subscription');
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

    if (id) {
      updateWatchProgress(id, 0, false);
    }

    return () => {
      const cleanup = async () => {
        if (watchProgressInterval.current) {
          clearInterval(watchProgressInterval.current);
        }

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
  }, [id, updateWatchProgress]);



  if (!video) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Video not found</Text>
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
      console.log('Error toggling play/pause:', error);
    }
  };

  const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    if (playbackStatus.isLoaded) {
      setIsLoading(false);
      
      if (id && playbackStatus.durationMillis && playbackStatus.positionMillis) {
        const progress = playbackStatus.positionMillis / playbackStatus.durationMillis;
        
        if (playbackStatus.didJustFinish || progress >= 0.95) {
          console.log('[Watch] Video completed at progress:', progress);
          console.log('[Watch] Removing from continue watching');
          
          if (watchProgressInterval.current) {
            clearInterval(watchProgressInterval.current);
            watchProgressInterval.current = null;
          }
          
          updateWatchProgress(id, 1, true);
          setIsPlaying(false);
        } else if (progress > 0.05) {
          updateWatchProgress(id, progress, false);
        }
      }
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const enterFullscreen = async () => {
    console.log('[Movies/Video Fullscreen] Entering fullscreen mode');
    console.log('[Movies/Video Fullscreen] Platform:', Platform.OS);
    console.log('[Movies/Video Fullscreen] Video orientation:', video?.orientation);

    setIsFullscreen(true);

    if (Platform.OS !== 'web') {
      try {
        console.log('[Movies/Video Fullscreen] Attempting to lock orientation to landscape');
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        isOrientationLocked.current = true;
        console.log('[Movies/Video Fullscreen] ✅ Orientation successfully locked to LANDSCAPE');
      } catch (error) {
        console.error('[Movies/Video Fullscreen] ❌ Error locking orientation:', error);
      }
    } else {
      console.log('[Movies/Video Fullscreen] Web platform detected, skipping orientation lock');
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

  const handleShare = async () => {
    try {
      const shareMessage = `🎬 ${video.title}\n\n${video.description}\n\n📊 ${formatNumber(video.views)} views • ${formatNumber(video.likes)} likes\n🏷️ ${video.category}\n\n🔗 Watch now!`;
      
      const result = await Share.share(
        {
          message: shareMessage,
          title: video.title,
          url: `https://app.example.com/video/${video.id}`,
        },
        {
          subject: video.title,
          dialogTitle: `Share "${video.title}"`,
        }
      );

      if (result.action === Share.sharedAction) {
        console.log('[Share] Video shared successfully');
        if (result.activityType) {
          console.log('[Share] Shared via:', result.activityType);
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('[Share] Share dismissed');
      }
    } catch (error) {
      console.error('[Share] Error sharing:', error);
      Alert.alert('Share Failed', 'Unable to share this video. Please try again.');
    }
  };

  const handleOpenComments = () => {
    setShowComments(true);
    if (comments.length === 0) {
      setComments([
        {
          id: '1',
          author: 'Sarah Johnson',
          text: 'This is amazing! Can\'t wait for the next episode 🔥',
          timestamp: '2 hours ago',
        },
        {
          id: '2',
          author: 'Mike Chen',
          text: 'Best series I\'ve watched in a long time!',
          timestamp: '5 hours ago',
        },
        {
          id: '3',
          author: 'Emma Davis',
          text: 'The plot twist was incredible! 😱',
          timestamp: '1 day ago',
        },
      ]);
    }
  };

  const handleAddComment = () => {
    if (commentInput.trim().length === 0) {
      return;
    }

    const newComment = {
      id: Date.now().toString(),
      author: 'You',
      text: commentInput.trim(),
      timestamp: 'Just now',
    };

    setComments([newComment, ...comments]);
    setCommentInput('');
  };

  const isLandscapeVideo = video?.orientation === 'landscape';

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

      <TouchableOpacity
        style={[videoContainerStyle, isFullscreen && StyleSheet.absoluteFillObject]}
        activeOpacity={1}
        onPress={togglePlayPause}
      >
        <ExpoVideo
          ref={videoRef}
          source={{ uri: video.videoUrl }}
          style={videoStyle}
          resizeMode={videoResizeMode}
          shouldPlay
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />

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

      {!isFullscreen && (
        <>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <View style={styles.closeButtonInner}>
              <X size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.rightActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => id && toggleLike(id)}
              activeOpacity={0.7}
            >
              <Heart
                size={32}
                color={videoIsLiked ? '#FF3B5C' : '#FFFFFF'}
                fill={videoIsLiked ? '#FF3B5C' : 'none'}
              />
              <Text style={styles.actionText}>
                {formatNumber(video.likes + (videoIsLiked ? 1 : 0))}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              activeOpacity={0.7}
              onPress={handleOpenComments}
            >
              <MessageCircle size={32} color="#FFFFFF" />
              <Text style={styles.actionText}>
                {formatNumber(Math.floor(video.views * 0.02) + comments.length)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              activeOpacity={0.7}
              onPress={handleShare}
            >
              <Share2 size={32} color="#FFFFFF" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

          {isLandscapeVideo && (
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

          <View style={styles.bottomInfo}>
            <Text style={styles.videoTitle}>{video.title}</Text>
            <Text style={styles.videoDescription}>{video.description}</Text>
            <View style={styles.statsRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{video.category}</Text>
              </View>
              <Text style={styles.viewsText}>
                {formatNumber(video.views)} views
              </Text>
            </View>
          </View>
        </>
      )}

      <Modal
        visible={showComments}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.commentsModal}>
          <View style={styles.commentsHeader}>
            <View style={styles.commentsHeaderContent}>
              <MessageCircle size={24} color="#FF3B5C" />
              <Text style={styles.commentsHeaderTitle}>
                Comments ({formatNumber(Math.floor(video.views * 0.02) + comments.length)})
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowComments(false)}
              activeOpacity={0.7}
              style={styles.commentsCloseButton}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.commentsList} contentContainerStyle={styles.commentsListContent}>
            {comments.length === 0 ? (
              <View style={styles.noCommentsContainer}>
                <MessageCircle size={48} color="#666666" />
                <Text style={styles.noCommentsText}>No comments yet</Text>
                <Text style={styles.noCommentsSubtext}>Be the first to comment!</Text>
              </View>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>
                      {comment.author.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
          >
            <View style={styles.commentInputContainer}>
              <View style={styles.commentInputAvatar}>
                <Text style={styles.commentInputAvatarText}>Y</Text>
              </View>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor="#666666"
                value={commentInput}
                onChangeText={setCommentInput}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.commentSendButton,
                  commentInput.trim().length === 0 && styles.commentSendButtonDisabled,
                ]}
                onPress={handleAddComment}
                disabled={commentInput.trim().length === 0}
                activeOpacity={0.7}
              >
                <Send
                  size={20}
                  color={commentInput.trim().length === 0 ? '#666666' : '#FFFFFF'}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

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
              {video.title}
            </Text>
            <Text style={styles.fullscreenSubtitle}>
              {video.category} • {formatNumber(video.views)} views
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  videoContainerLandscape: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 9 / 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
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
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  closeButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 140,
    gap: 24,
    zIndex: 10,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 80,
    padding: 20,
    paddingBottom: 32,
    zIndex: 10,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  videoDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 59, 92, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  viewsText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: (SCREEN_HEIGHT - (SCREEN_WIDTH * 9 / 16) - 100) / 2 + 20,
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
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
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
  commentsModal: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  commentsHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  commentsHeaderTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  commentsCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    paddingVertical: 16,
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  noCommentsText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginTop: 16,
  },
  noCommentsSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3B5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#666666',
  },
  commentText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    backgroundColor: '#0A0A0A',
    gap: 12,
  },
  commentInputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF3B5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentInputAvatarText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#FFFFFF',
    maxHeight: 100,
  },
  commentSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3B5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentSendButtonDisabled: {
    backgroundColor: '#1A1A1A',
  },
});
