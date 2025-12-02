import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Stack } from 'expo-router';
import { useAdmin } from '@/contexts/AdminContext';
import { useAppState } from '@/contexts/AppStateContext';
import { Search, User } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_PADDING * 2 - CARD_GAP) / 2;

export default function SeriesScreen() {
  const router = useRouter();
  const { series } = useAdmin();
  const { isLoggedIn } = useAppState();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSeries = series?.filter((s) =>
    searchQuery === '' ? true : s.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getTotalEpisodes = (seriesItem: typeof series[0]) => {
    return seriesItem.seasons.reduce((total, season) => total + season.episodes.length, 0);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Series</Text>
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

      <FlatList
        data={filteredSeries}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item: seriesItem }) => {
          const totalEpisodes = getTotalEpisodes(seriesItem);
          return (
            <TouchableOpacity
              style={styles.seriesCard}
              onPress={() => {
                if (!isLoggedIn) {
                  console.log('[Auth] User not logged in, redirecting to sign-in');
                  router.push('/sign-in');
                } else {
                  router.push(`/series/${seriesItem.id}` as any);
                }
              }}
              activeOpacity={0.85}
            >
              <Image
                source={{ uri: seriesItem.thumbnail }}
                style={styles.seriesPoster}
                resizeMode="cover"
              />
              <View style={styles.posterOverlay}>
                <View style={styles.episodeCountBadge}>
                  <Text style={styles.episodeCountText}>
                    {totalEpisodes} EP
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No series found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search
            </Text>
          </View>
        }
      />
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
  gridContainer: {
    paddingHorizontal: CARD_PADDING,
    paddingTop: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  seriesCard: {
    width: CARD_WIDTH,
    aspectRatio: 2 / 3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
  },
  seriesPoster: {
    width: '100%',
    height: '100%',
  },
  posterOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 8,
  },
  episodeCountBadge: {
    backgroundColor: 'rgba(255, 59, 92, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  episodeCountText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
});
