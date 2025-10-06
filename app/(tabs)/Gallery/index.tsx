import { ModernHeader } from '@/components/ModernHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    RefreshControl,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PhotoStorage } from '../../../services/PhotoStorage';
import { PhotoMetadata } from '../../../types/photo';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 30) / 2; // 2 columns with padding

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<PhotoMetadata[]>([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const photoStorage = PhotoStorage.getInstance();

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    filterPhotos();
  }, [photos, searchText]);

  const loadPhotos = async () => {
    try {
      const allPhotos = photoStorage.getAllPhotos();
      setPhotos(allPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
      Alert.alert('Error', 'Failed to load photos');
    }
  };

  const filterPhotos = () => {
    if (!searchText.trim()) {
      setFilteredPhotos(photos);
      return;
    }

    const filtered = photoStorage.searchPhotos(searchText);
    setFilteredPhotos(filtered);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  }, []);

  const handlePhotoPress = (photo: PhotoMetadata) => {
    if (isSelectionMode) {
      togglePhotoSelection(photo.id);
    } else {
      router.push({
        pathname: '/PhotoDetail',
        params: { photoId: photo.id }
      });
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId);
    } else {
      newSelection.add(photoId);
    }
    setSelectedPhotos(newSelection);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedPhotos(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedPhotos.size === 0) return;

    Alert.alert(
      'Delete Photos',
      `Are you sure you want to delete ${selectedPhotos.size} photo(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            for (const photoId of selectedPhotos) {
              await photoStorage.deletePhoto(photoId);
            }
            setSelectedPhotos(new Set());
            setIsSelectionMode(false);
            await loadPhotos();
          },
        },
      ]
    );
  };

  const handleComparePhotos = () => {
    if (selectedPhotos.size !== 2) {
      Alert.alert('Compare Photos', 'Please select exactly 2 photos to compare');
      return;
    }

    const photoIds = Array.from(selectedPhotos);
    router.push({
      pathname: '/PhotoComparison',
      params: { 
        photoId1: photoIds[0],
        photoId2: photoIds[1]
      }
    });
    setSelectedPhotos(new Set());
    setIsSelectionMode(false);
  };

  const renderPhotoItem = ({ item }: { item: PhotoMetadata }) => {
    const isSelected = selectedPhotos.has(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.photoContainer,
          isSelected && styles.selectedPhoto
        ]}
        onPress={() => handlePhotoPress(item)}
        onLongPress={() => {
          if (!isSelectionMode) {
            setIsSelectionMode(true);
            setSelectedPhotos(new Set([item.id]));
          }
        }}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.photo}
          contentFit="cover"
        />
        
        {isSelected && (
          <View style={styles.selectionOverlay}>
            <Ionicons name="checkmark-circle" size={30} color="#007AFF" />
          </View>
        )}
        
        <View style={styles.photoInfo}>
          <ThemedText style={styles.photoTitle} numberOfLines={1}>
            {item.title}
          </ThemedText>
          <ThemedText style={styles.photoDate}>
            {item.date} {item.time}
          </ThemedText>
          {item.location && (
            <ThemedText style={styles.photoLocation} numberOfLines={1}>
              📍 {item.location.address || `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}`}
            </ThemedText>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="camera-outline" size={80} color="#ccc" />
      <ThemedText style={styles.emptyTitle}>No Photos Yet</ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        Take your first photo to get started!
      </ThemedText>
      <TouchableOpacity
        style={styles.takePhotoButton}
        onPress={() => router.push('/Camera')}
      >
        <ThemedText style={styles.takePhotoButtonText}>Take Photo</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ModernHeader
        title="📸 Gallery"
        subtitle={`${photos.length} photos`}
        variant="gradient"
        rightAction={{
          icon: "camera",
          onPress: () => router.push('/(tabs)/Camera')
        }}
      />
      <ThemedView style={styles.container}>

      {/* Search Bar */}
      {photos.length > 0 && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search photos..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#666"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchText('')}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Selection Actions */}
      {isSelectionMode && selectedPhotos.size > 0 && (
        <View style={styles.selectionActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDeleteSelected}
          >
            <Ionicons name="trash" size={20} color="#FF3B30" />
            <ThemedText style={styles.actionButtonText}>Delete</ThemedText>
          </TouchableOpacity>
          
          {selectedPhotos.size === 2 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleComparePhotos}
            >
              <Ionicons name="git-compare" size={20} color="#007AFF" />
              <ThemedText style={styles.actionButtonText}>Compare</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Photos Grid */}
      <FlatList
        data={filteredPhotos}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.photosList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    marginLeft: 10,
  },
  selectionActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  photosList: {
    padding: 10,
    flexGrow: 1,
  },
  photoContainer: {
    width: ITEM_SIZE,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPhoto: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  photo: {
    width: '100%',
    height: ITEM_SIZE,
  },
  selectionOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 5,
  },
  photoInfo: {
    padding: 10,
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  photoDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  photoLocation: {
    fontSize: 11,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  takePhotoButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  takePhotoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
