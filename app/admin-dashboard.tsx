import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Plus, Edit2, Trash2, Film, Tv, X, Save, Ticket, Copy, CheckCircle } from 'lucide-react-native';
import { useAdmin } from '@/contexts/AdminContext';
import { Video } from '@/mocks/videos';

const { width } = Dimensions.get('window');
const ITEM_SPACING = 8;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - ITEM_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

type TabType = 'movies' | 'series' | 'discounts';

interface MovieFormData {
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  category: string;
  description: string;
  views: number;
  likes: number;
  uploadDate: string;
  orientation: 'portrait' | 'landscape';
  releaseDate: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { movies, series, discountCodes, addMovie, updateMovie, deleteMovie, deleteSeries, generateDiscountCode, deleteDiscountCode } = useAdmin();
  const [activeTab, setActiveTab] = useState<TabType>('movies');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Video | null>(null);
  
  const [formData, setFormData] = useState<MovieFormData>({
    title: '',
    thumbnail: '',
    videoUrl: '',
    duration: 60,
    category: 'Drama',
    description: '',
    views: 0,
    likes: 0,
    uploadDate: new Date().toISOString().split('T')[0],
    orientation: 'portrait',
    releaseDate: new Date().toISOString().split('T')[0],
  });

  const resetForm = () => {
    setFormData({
      title: '',
      thumbnail: '',
      videoUrl: '',
      duration: 60,
      category: 'Drama',
      description: '',
      views: 0,
      likes: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      orientation: 'portrait',
      releaseDate: new Date().toISOString().split('T')[0],
    });
    setEditingMovie(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const openEditModal = (movie: Video) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      thumbnail: movie.thumbnail,
      videoUrl: movie.videoUrl,
      duration: movie.duration,
      category: movie.category,
      description: movie.description,
      views: movie.views,
      likes: movie.likes,
      uploadDate: movie.uploadDate,
      orientation: movie.orientation,
      releaseDate: movie.releaseDate || new Date().toISOString().split('T')[0],
    });
    setIsModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.videoUrl) {
      Alert.alert('Error', 'Please fill in at least the title and video URL');
      return;
    }

    if (editingMovie) {
      updateMovie(editingMovie.id, formData);
      Alert.alert('Success', 'Movie updated successfully');
    } else {
      addMovie(formData);
      Alert.alert('Success', 'Movie added successfully');
    }

    setIsModalVisible(false);
    resetForm();
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (activeTab === 'movies') {
              deleteMovie(id);
            } else {
              deleteSeries(id);
            }
            Alert.alert('Success', 'Deleted successfully');
          },
        },
      ]
    );
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handleGenerateDiscountCode = () => {
    const code = generateDiscountCode();
    Alert.alert('Discount Code Generated', `Code: ${code}\n\nDiscount: 20%`, [
      { text: 'OK' },
    ]);
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      Alert.alert('Copy Failed', 'Could not copy code to clipboard');
    }
  };

  const handleDeleteDiscountCode = (code: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete discount code "${code}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteDiscountCode(code);
            Alert.alert('Success', 'Discount code deleted');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddModal}
          activeOpacity={0.7}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add {activeTab === 'movies' ? 'Movie' : 'Series'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'movies' && styles.tabActive]}
          onPress={() => setActiveTab('movies')}
          activeOpacity={0.7}
        >
          <Film size={18} color={activeTab === 'movies' ? '#FFFFFF' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'movies' && styles.tabTextActive]}>
            Movies ({movies.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'series' && styles.tabActive]}
          onPress={() => setActiveTab('series')}
          activeOpacity={0.7}
        >
          <Tv size={18} color={activeTab === 'series' ? '#FFFFFF' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'series' && styles.tabTextActive]}>
            Series ({series.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discounts' && styles.tabActive]}
          onPress={() => setActiveTab('discounts')}
          activeOpacity={0.7}
        >
          <Ticket size={18} color={activeTab === 'discounts' ? '#FFFFFF' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'discounts' && styles.tabTextActive]}>
            Discounts ({discountCodes.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={activeTab === 'discounts' ? styles.listContainer : styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'discounts' ? (
          <View style={styles.discountContainer}>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateDiscountCode}
              activeOpacity={0.8}
            >
              <Ticket size={20} color="#FFFFFF" />
              <Text style={styles.generateButtonText}>Generate Discount Code</Text>
            </TouchableOpacity>

            <View style={styles.discountList}>
              {discountCodes.map((code) => (
                <View key={code.code} style={styles.discountCard}>
                  <View style={styles.discountHeader}>
                    <View style={styles.discountCodeContainer}>
                      <Text style={styles.discountCode}>{code.code}</Text>
                      <View style={[styles.badge, code.isUsed ? styles.badgeUsed : styles.badgeActive]}>
                        <Text style={styles.badgeText}>{code.isUsed ? 'Used' : 'Active'}</Text>
                      </View>
                    </View>
                    <Text style={styles.discountValue}>{code.discount}% OFF</Text>
                  </View>
                  
                  <View style={styles.discountInfo}>
                    <Text style={styles.discountInfoText}>
                      Created: {new Date(code.createdAt).toLocaleDateString()}
                    </Text>
                    {code.isUsed && code.usedAt && (
                      <Text style={styles.discountInfoText}>
                        Used: {new Date(code.usedAt).toLocaleDateString()}
                      </Text>
                    )}
                  </View>

                  <View style={styles.discountActions}>
                    <TouchableOpacity
                      style={[styles.discountActionButton, styles.copyButton]}
                      onPress={() => handleCopyCode(code.code)}
                      activeOpacity={0.7}
                    >
                      {copiedCode === code.code ? (
                        <>
                          <CheckCircle size={16} color="#10B981" />
                          <Text style={styles.discountActionText}>Copied!</Text>
                        </>
                      ) : (
                        <>
                          <Copy size={16} color="#3B82F6" />
                          <Text style={styles.discountActionText}>Copy</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.discountActionButton, styles.deleteDiscountButton]}
                      onPress={() => handleDeleteDiscountCode(code.code)}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={16} color="#EF4444" />
                      <Text style={styles.discountActionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {discountCodes.length === 0 && (
                <View style={styles.emptyState}>
                  <Ticket size={48} color="#4B5563" />
                  <Text style={styles.emptyStateText}>No discount codes yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Generate a code to get started
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.grid}>
            {activeTab === 'movies' ? (
            movies.map((movie) => (
              <View key={movie.id} style={styles.card}>
                <View style={styles.thumbnailContainer}>
                  <Image
                    source={{ uri: movie.thumbnail }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.overlay}>
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{movie.duration}s</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {movie.title}
                </Text>
                <Text style={styles.cardViews}>
                  {formatViews(movie.views)} views
                </Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => openEditModal(movie)}
                    activeOpacity={0.7}
                  >
                    <Edit2 size={16} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(movie.id, movie.title)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            series.map((s) => (
              <View key={s.id} style={styles.card}>
                <View style={styles.thumbnailContainer}>
                  <Image
                    source={{ uri: s.thumbnail }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.overlay}>
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>
                        {s.seasons.reduce((acc, season) => acc + season.episodes.length, 0)} eps
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {s.title}
                </Text>
                <Text style={styles.cardViews}>
                  {formatViews(s.views)} views
                </Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => {
                      Alert.alert('Coming Soon', 'Series editing will be available soon');
                    }}
                    activeOpacity={0.7}
                  >
                    <Edit2 size={16} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(s.id, s.title)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  resetForm();
                }}
                activeOpacity={0.7}
              >
                <X size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formGroup}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder="Enter movie title"
                  placeholderTextColor="#6B7280"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Video URL * (YouTube, Google Drive, AWS, or Direct)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.videoUrl}
                  onChangeText={(text) => setFormData({ ...formData, videoUrl: text })}
                  placeholder="https://..."
                  placeholderTextColor="#6B7280"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Poster/Thumbnail URL</Text>
                <TextInput
                  style={styles.input}
                  value={formData.thumbnail}
                  onChangeText={(text) => setFormData({ ...formData, thumbnail: text })}
                  placeholder="https://images.unsplash.com/..."
                  placeholderTextColor="#6B7280"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Enter description"
                  placeholderTextColor="#6B7280"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, styles.formGroupHalf]}>
                  <Text style={styles.label}>Duration (seconds)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.duration.toString()}
                    onChangeText={(text) =>
                      setFormData({ ...formData, duration: parseInt(text) || 0 })
                    }
                    placeholder="60"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.formGroup, styles.formGroupHalf]}>
                  <Text style={styles.label}>Category</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.category}
                    onChangeText={(text) => setFormData({ ...formData, category: text })}
                    placeholder="Drama"
                    placeholderTextColor="#6B7280"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Release Date</Text>
                <TextInput
                  style={styles.input}
                  value={formData.releaseDate}
                  onChangeText={(text) => setFormData({ ...formData, releaseDate: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#6B7280"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Orientation</Text>
                <View style={styles.orientationButtons}>
                  <TouchableOpacity
                    style={[
                      styles.orientationButton,
                      formData.orientation === 'portrait' && styles.orientationButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, orientation: 'portrait' })}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.orientationButtonText,
                        formData.orientation === 'portrait' && styles.orientationButtonTextActive,
                      ]}
                    >
                      Portrait
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.orientationButton,
                      formData.orientation === 'landscape' && styles.orientationButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, orientation: 'landscape' })}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.orientationButtonText,
                        formData.orientation === 'landscape' && styles.orientationButtonTextActive,
                      ]}
                    >
                      Landscape
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsModalVisible(false);
                  resetForm();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.7}
              >
                <Save size={18} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    padding: ITEM_SPACING,
  },
  listContainer: {
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ITEM_SPACING,
  },
  card: {
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
  cardTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginTop: 8,
    lineHeight: 18,
  },
  cardViews: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  editButton: {
    backgroundColor: '#3B82F615',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#EF444415',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  modalScroll: {
    flex: 1,
    maxHeight: undefined,
  },
  modalScrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#E5E7EB',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#FFFFFF',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  orientationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  orientationButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
  },
  orientationButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  orientationButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#9CA3AF',
  },
  orientationButtonTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#9CA3AF',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  discountContainer: {
    flex: 1,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
    marginBottom: 24,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  discountList: {
    gap: 12,
  },
  discountCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  discountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  discountCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  discountCode: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeActive: {
    backgroundColor: '#10B98120',
  },
  badgeUsed: {
    backgroundColor: '#6B728020',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  discountValue: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#10B981',
  },
  discountInfo: {
    marginBottom: 12,
    gap: 4,
  },
  discountInfoText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  discountActions: {
    flexDirection: 'row',
    gap: 8,
  },
  discountActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  copyButton: {
    backgroundColor: '#3B82F615',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  deleteDiscountButton: {
    backgroundColor: '#EF444415',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  discountActionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#E5E7EB',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
