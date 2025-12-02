import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Stack } from 'expo-router';
import { useAdmin } from '@/contexts/AdminContext';
import { useAppState } from '@/contexts/AppStateContext';
import { Search, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const ITEM_SPACING = 8;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - ITEM_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function MoviesScreen() {
  const router = useRouter();
  const { movies } = useAdmin();
  const { isLoggedIn } = useAppState();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredVideos = movies.filter((video) =>
    searchQuery === '' ? true : video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={styles.headerTitle}>Movies</Text>
        <View style={styles.headerRight}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/profile' as any)}
            activeOpacity={0.7}
          >
            <User size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {filteredVideos.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={styles.videoCard}
              onPress={() => {
                if (!isLoggedIn) {
                  console.log('[Auth] User not logged in, redirecting to sign-in');
                  router.push('/sign-in');
                } else {
                  router.push(`/movie/${video.id}` as any);
                }
              }}
              activeOpacity={0.9}
            >
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{ uri: video.thumbnail }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <View style={styles.overlay}>
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{video.duration}s</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {video.title}
              </Text>
              <Text style={styles.videoViews}>
                {formatViews(video.views)} views
              </Text>
            </TouchableOpacity>
          ))}
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
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: '#0A0A0A',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginRight: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    padding: 0,
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
  gridContainer: {
    padding: ITEM_SPACING,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ITEM_SPACING,
  },
  videoCard: {
    width: ITEM_WIDTH,
    marginBottom: 4,
  },
  thumbnailContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.6,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  videoTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginTop: 8,
    lineHeight: 18,
  },
  videoViews: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
