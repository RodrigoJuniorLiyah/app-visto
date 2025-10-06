import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    Share,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { PhotoStorage } from '../services/PhotoStorage';
import { PhotoMetadata } from '../types/photo';

const { width, height } = Dimensions.get('window');

export default function PhotoDetailScreen() {
  const { photoId } = useLocalSearchParams<{ photoId: string }>();
  const [photo, setPhoto] = useState<PhotoMetadata | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const photoStorage = PhotoStorage.getInstance();

  useEffect(() => {
    if (photoId) {
      const photoData = photoStorage.getPhotoById(photoId);
      if (photoData) {
        setPhoto(photoData);
        setEditTitle(photoData.title || '');
      } else {
        Alert.alert('Error', 'Photo not found');
        router.back();
      }
    }
  }, [photoId]);

  const handleEditTitle = async () => {
    if (!photo) return;

    try {
      const success = await photoStorage.updatePhotoTitle(photo.id, editTitle);
      if (success) {
        setPhoto({ ...photo, title: editTitle });
        setShowEditModal(false);
        Alert.alert('Success', 'Photo title updated');
      } else {
        Alert.alert('Error', 'Failed to update photo title');
      }
    } catch (error) {
      console.error('Error updating photo title:', error);
      Alert.alert('Error', 'Failed to update photo title');
    }
  };

  const handleDeletePhoto = () => {
    if (!photo) return;

    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await photoStorage.deletePhoto(photo.id);
            if (success) {
              router.back();
            } else {
              Alert.alert('Error', 'Failed to delete photo');
            }
          },
        },
      ]
    );
  };

  const handleSharePhoto = async () => {
    if (!photo) return;

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(photo.uri, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Share Photo',
        });
      } else {
        // Fallback to React Native Share
        await Share.share({
          url: photo.uri,
          message: `Check out this photo I took! ${photo.title ? `\nTitle: ${photo.title}` : ''}${photo.location ? `\nLocation: ${photo.location.address || `${photo.location.latitude}, ${photo.location.longitude}`}` : ''}`,
        });
      }
    } catch (error) {
      console.error('Error sharing photo:', error);
      Alert.alert('Error', 'Failed to share photo');
    }
  };

  if (!photo) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <ThemedText style={styles.headerTitle}>Photo Details</ThemedText>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowEditModal(true)}
          >
            <Ionicons name="create" size={24} color="#007AFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSharePhoto}
          >
            <Ionicons name="share" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Photo */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: photo.uri }}
            style={styles.photo}
            contentFit="contain"
          />
        </View>

        {/* Photo Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
            <ThemedText style={styles.infoLabel}>Title</ThemedText>
            <ThemedText style={styles.infoValue}>
              {photo.title || 'Untitled'}
            </ThemedText>
          </View>

          <View style={styles.infoSection}>
            <ThemedText style={styles.infoLabel}>Date & Time</ThemedText>
            <ThemedText style={styles.infoValue}>
              {photo.date} at {photo.time}
            </ThemedText>
          </View>

          {photo.location && (
            <View style={styles.infoSection}>
              <ThemedText style={styles.infoLabel}>Location</ThemedText>
              <ThemedText style={styles.infoValue}>
                {photo.location.address || 
                  `${photo.location.latitude.toFixed(6)}, ${photo.location.longitude.toFixed(6)}`}
              </ThemedText>
              {photo.location.address && (
                <ThemedText style={styles.coordinatesText}>
                  📍 {photo.location.latitude.toFixed(6)}, {photo.location.longitude.toFixed(6)}
                </ThemedText>
              )}
            </View>
          )}

          <View style={styles.infoSection}>
            <ThemedText style={styles.infoLabel}>Dimensions</ThemedText>
            <ThemedText style={styles.infoValue}>
              {photo.width} × {photo.height}
            </ThemedText>
          </View>

          <View style={styles.infoSection}>
            <ThemedText style={styles.infoLabel}>File Size</ThemedText>
            <ThemedText style={styles.infoValue}>
              {(photo.size / 1024 / 1024).toFixed(2)} MB
            </ThemedText>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => setShowEditModal(true)}
          >
            <Ionicons name="create" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>Edit Title</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleSharePhoto}
          >
            <Ionicons name="share" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>Share</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeletePhoto}
          >
            <Ionicons name="trash" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>Delete</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Edit Photo Title</ThemedText>
            
            <TextInput
              style={styles.titleInput}
              placeholder="Enter photo title"
              value={editTitle}
              onChangeText={setEditTitle}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleEditTitle}
              >
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
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
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  content: {
    flex: 1,
  },
  photoContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photo: {
    width: '100%',
    height: height * 0.4,
  },
  infoContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoSection: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  shareButton: {
    backgroundColor: '#34C759',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: width * 0.8,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
