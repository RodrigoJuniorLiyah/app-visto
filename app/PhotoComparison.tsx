import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { PhotoMetadata } from '../types/photo';
import { PhotoStorage } from '../services/PhotoStorage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

const { width } = Dimensions.get('window');

export default function PhotoComparisonScreen() {
  const { photoId1, photoId2 } = useLocalSearchParams<{ 
    photoId1: string; 
    photoId2: string; 
  }>();
  const [photo1, setPhoto1] = useState<PhotoMetadata | null>(null);
  const [photo2, setPhoto2] = useState<PhotoMetadata | null>(null);
  const photoStorage = PhotoStorage.getInstance();

  useEffect(() => {
    if (photoId1 && photoId2) {
      const p1 = photoStorage.getPhotoById(photoId1);
      const p2 = photoStorage.getPhotoById(photoId2);
      
      if (p1 && p2) {
        setPhoto1(p1);
        setPhoto2(p2);
      } else {
        router.back();
      }
    }
  }, [photoId1, photoId2]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatFileSize = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  if (!photo1 || !photo2) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  const distance = photo1.location && photo2.location 
    ? calculateDistance(
        photo1.location.latitude, 
        photo1.location.longitude,
        photo2.location.latitude, 
        photo2.location.longitude
      )
    : null;

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
        
        <ThemedText style={styles.headerTitle}>Photo Comparison</ThemedText>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push({
              pathname: '/PhotoDetail',
              params: { photoId: photo1.id }
            })}
          >
            <Ionicons name="eye" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Photos Side by Side */}
        <View style={styles.photosContainer}>
          <View style={styles.photoColumn}>
            <Image
              source={{ uri: photo1.uri }}
              style={styles.photo}
              contentFit="cover"
            />
            <View style={styles.photoInfo}>
              <ThemedText style={styles.photoTitle} numberOfLines={1}>
                {photo1.title}
              </ThemedText>
              <ThemedText style={styles.photoDate}>
                {formatDate(photo1.timestamp)}
              </ThemedText>
            </View>
          </View>

          <View style={styles.photoColumn}>
            <Image
              source={{ uri: photo2.uri }}
              style={styles.photo}
              contentFit="cover"
            />
            <View style={styles.photoInfo}>
              <ThemedText style={styles.photoTitle} numberOfLines={1}>
                {photo2.title}
              </ThemedText>
              <ThemedText style={styles.photoDate}>
                {formatDate(photo2.timestamp)}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Comparison Stats */}
        <View style={styles.statsContainer}>
          <ThemedText style={styles.statsTitle}>Comparison Stats</ThemedText>
          
          {/* Time Difference */}
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Time Difference</ThemedText>
            <ThemedText style={styles.statValue}>
              {Math.abs(photo1.timestamp - photo2.timestamp) < 60000 
                ? 'Less than 1 minute'
                : `${Math.abs(photo1.timestamp - photo2.timestamp) / 60000 | 0} minutes`
              }
            </ThemedText>
          </View>

          {/* Distance */}
          {distance !== null && (
            <View style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Distance</ThemedText>
              <ThemedText style={styles.statValue}>
                {distance < 1 
                  ? `${(distance * 1000).toFixed(0)} meters`
                  : `${distance.toFixed(2)} km`
                }
              </ThemedText>
            </View>
          )}

          {/* Size Comparison */}
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>File Size</ThemedText>
            <ThemedText style={styles.statValue}>
              {formatFileSize(photo1.size)} vs {formatFileSize(photo2.size)}
            </ThemedText>
          </View>

          {/* Dimensions Comparison */}
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Dimensions</ThemedText>
            <ThemedText style={styles.statValue}>
              {photo1.width}×{photo1.height} vs {photo2.width}×{photo2.height}
            </ThemedText>
          </View>
        </View>

        {/* Detailed Info */}
        <View style={styles.detailsContainer}>
          <ThemedText style={styles.detailsTitle}>Detailed Information</ThemedText>
          
          {/* Photo 1 Details */}
          <View style={styles.detailSection}>
            <ThemedText style={styles.detailSectionTitle}>Photo 1</ThemedText>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Title:</ThemedText>
              <ThemedText style={styles.detailValue}>{photo1.title || 'Untitled'}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Date:</ThemedText>
              <ThemedText style={styles.detailValue}>{photo1.date} {photo1.time}</ThemedText>
            </View>
            {photo1.location && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Location:</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {photo1.location.address || 
                    `${photo1.location.latitude.toFixed(4)}, ${photo1.location.longitude.toFixed(4)}`}
                </ThemedText>
              </View>
            )}
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Size:</ThemedText>
              <ThemedText style={styles.detailValue}>{formatFileSize(photo1.size)}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Dimensions:</ThemedText>
              <ThemedText style={styles.detailValue}>{photo1.width} × {photo1.height}</ThemedText>
            </View>
          </View>

          {/* Photo 2 Details */}
          <View style={styles.detailSection}>
            <ThemedText style={styles.detailSectionTitle}>Photo 2</ThemedText>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Title:</ThemedText>
              <ThemedText style={styles.detailValue}>{photo2.title || 'Untitled'}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Date:</ThemedText>
              <ThemedText style={styles.detailValue}>{photo2.date} {photo2.time}</ThemedText>
            </View>
            {photo2.location && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Location:</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {photo2.location.address || 
                    `${photo2.location.latitude.toFixed(4)}, ${photo2.location.longitude.toFixed(4)}`}
                </ThemedText>
              </View>
            )}
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Size:</ThemedText>
              <ThemedText style={styles.detailValue}>{formatFileSize(photo2.size)}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Dimensions:</ThemedText>
              <ThemedText style={styles.detailValue}>{photo2.width} × {photo2.height}</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
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
  photosContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  photoColumn: {
    flex: 1,
    backgroundColor: 'white',
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
    height: 200,
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
  },
  statsContainer: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  detailsContainer: {
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
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#007AFF',
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});
