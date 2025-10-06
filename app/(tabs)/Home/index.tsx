import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const features = [
    {
      title: 'Take Photos',
      description: 'Capture moments with your camera',
      icon: 'camera',
      color: '#007AFF',
      onPress: () => router.push('/(tabs)/Camera'),
    },
    {
      title: 'View Gallery',
      description: 'Browse all your captured photos',
      icon: 'images',
      color: '#34C759',
      onPress: () => router.push('/(tabs)/Gallery'),
    },
    {
      title: 'Photo Details',
      description: 'View metadata and location info',
      icon: 'information-circle',
      color: '#FF9500',
      onPress: () => router.push('/(tabs)/Gallery'),
    },
    {
      title: 'Compare Photos',
      description: 'Side-by-side photo comparison',
      icon: 'git-compare',
      color: '#AF52DE',
      onPress: () => router.push('/(tabs)/Gallery'),
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            📸 Photo Gallery
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Capture, organize, and compare your photos with location data and metadata
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.featuresContainer}>
          <ThemedText style={styles.featuresTitle}>Features</ThemedText>
          
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, { borderLeftColor: feature.color }]}
              onPress={feature.onPress}
            >
              <ThemedView style={styles.featureContent}>
                <ThemedView style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  <Ionicons name={feature.icon as any} size={24} color="white" />
                </ThemedView>
                
                <ThemedView style={styles.featureText}>
                  <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
                  <ThemedText style={styles.featureDescription}>{feature.description}</ThemedText>
                </ThemedView>
                
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>

        <ThemedView style={styles.infoContainer}>
          <ThemedText style={styles.infoTitle}>App Features</ThemedText>
          <ThemedView style={styles.infoList}>
            <ThemedView style={styles.infoItem}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <ThemedText style={styles.infoText}>Camera integration with location</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <ThemedText style={styles.infoText}>Offline storage and cache</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <ThemedText style={styles.infoText}>Search and filter photos</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <ThemedText style={styles.infoText}>Photo comparison tool</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <ThemedText style={styles.infoText}>Share with metadata</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <ThemedText style={styles.infoText}>Dark mode support</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 28,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 16,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});