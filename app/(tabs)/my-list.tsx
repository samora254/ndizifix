import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Stack } from 'expo-router';
import { videos } from '@/mocks/videos';
import { Clock, Heart, User } from 'lucide-react-native';
import { useAppState } from '@/contexts/AppStateContext';

export default function MyListScreen() {
  const router = useRouter();
  const { likedVideoIds, continueWatchingVideos } = useAppState();

  const continueWatchingVideosList = useMemo(() => {
    return continueWatchingVideos
      .map((progress) => videos.find((v) => v.id === progress.videoId))
      .filter((v) => v !== undefined)
      .slice(0, 6);
  }, [continueWatchingVideos]);

  const likedVideosList = useMemo(() => {
    return likedVideoIds
      .map((id) => videos.find((v) => v.id === id))
      .filter((v) => v !== undefined)
      .slice(0, 12);
  }, [likedVideoIds]);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My List</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/profile' as any)}
          activeOpacity={0.7}
        >
          <User size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#FF3B5C" />
            <Text style={styles.sectionTitle}>Continue Watching</Text>
          </View>
          {continueWatchingVideosList.length === 0 ? (
            <View style={styles.emptyState}>
              <Clock size={48} color="#666666" />
              <Text style={styles.emptyStateText}>No videos to continue watching</Text>
              <Text style={styles.emptyStateSubtext}>Start watching videos to see them here</Text>
            </View>
          ) : (
            <View style={styles.videoGrid}>
              {continueWatchingVideosList.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  style={styles.videoCard}
                  onPress={() => router.push(`/(tabs)/(home)/video/${video.id}` as any)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: video.thumbnail }}
                    style={styles.videoThumbnail}
                    resizeMode="cover"
                  />
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {video.title}
                  </Text>
                  <Text style={styles.videoViews}>{formatViews(video.views)} views</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={20} color="#FF3B5C" />
            <Text style={styles.sectionTitle}>Liked Videos</Text>
          </View>
          {likedVideosList.length === 0 ? (
            <View style={styles.emptyState}>
              <Heart size={48} color="#666666" />
              <Text style={styles.emptyStateText}>No liked videos yet</Text>
              <Text style={styles.emptyStateSubtext}>Like videos to see them here</Text>
            </View>
          ) : (
            <View style={styles.videoGrid}>
              {likedVideosList.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  style={styles.videoCard}
                  onPress={() => router.push(`/(tabs)/(home)/video/${video.id}` as any)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: video.thumbnail }}
                    style={styles.videoThumbnail}
                    resizeMode="cover"
                  />
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {video.title}
                  </Text>
                  <Text style={styles.videoViews}>{formatViews(video.views)} views</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  videoCard: {
    width: '47%',
  },
  videoThumbnail: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginTop: 8,
    lineHeight: 18,
  },
  videoViews: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
});
