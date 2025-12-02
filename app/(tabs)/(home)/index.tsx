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
import Svg, { Line } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { categories } from '@/mocks/videos';
import { useAdmin } from '@/contexts/AdminContext';
import { useAppState } from '@/contexts/AppStateContext';
import { Search, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const ITEM_SPACING = 8;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - ITEM_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function HomeScreen() {
  const router = useRouter();
  const { movies } = useAdmin();
  const { isLoggedIn } = useAppState();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getMovieLabel = (releaseDate?: string) => {
    if (!releaseDate) return null;

    const now = new Date();
    const release = new Date(releaseDate);
    const diffTime = now.getTime() - release.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (release > now) {
      return { text: 'COMING SOON', color: '#8B0000' };
    } else if (diffDays <= 30) {
      return { text: 'NEW', color: '#8B0000' };
    }

    return null;
  };

  const filteredVideos = (movies || [])
    .filter((video) => 
      selectedCategory === 'All' ? true : video.category === selectedCategory
    )
    .filter((video) => 
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
      
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoNdizi}>NDIZI</Text>
            <Text style={styles.logoFlix}>FLIX</Text>
          </View>
          <Svg height="3" width="100" style={styles.logoLine}>
            <Line x1="0" y1="1.5" x2="100" y2="1.5" stroke="#FFA500" strokeWidth="3" strokeLinecap="round" />
          </Svg>
        </View>
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
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
                  router.push(`/(tabs)/(home)/video/${video.id}`);
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
                {getMovieLabel(video.releaseDate) && (
                  <View style={[styles.labelBadge, { backgroundColor: getMovieLabel(video.releaseDate)?.color }]}>
                    <Text style={styles.labelText}>{getMovieLabel(video.releaseDate)?.text}</Text>
                  </View>
                )}
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
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 12,
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoNdizi: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#22C55E',
    letterSpacing: 1,
  },
  logoFlix: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#EF4444',
    letterSpacing: 1,
  },
  logoLine: {
    marginTop: 2,
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
    marginLeft: 12,
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
  categoryContainer: {
    backgroundColor: '#0A0A0A',
    maxHeight: 60,
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#FF3B5C',
    borderColor: '#FF3B5C',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#9CA3AF',
  },
  categoryTextActive: {
    color: '#FFFFFF',
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
  labelBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  labelText: {
    fontSize: 9,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    letterSpacing: 0.5,
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
