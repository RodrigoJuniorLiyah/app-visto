import { ModernHeader } from '@/components/ModernHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PhotoStorage } from '../../../services/PhotoStorage';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const cameraRef = useRef<CameraView>(null);
  const photoStorage = PhotoStorage.getInstance();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText>Requesting camera permission...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.message}>
            Camera permission is required to take photos
          </ThemedText>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <ThemedText style={styles.buttonText}>Grant Permission</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        setPhotoUri(photo.uri);
        setShowTitleModal(true);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const savePhoto = async () => {
    if (!photoUri) return;

    try {
      const photo = await photoStorage.savePhoto(photoUri, photoTitle);
      Alert.alert('Success', 'Photo saved successfully!');
      setShowTitleModal(false);
      setPhotoUri(null);
      setPhotoTitle('');
      router.back();
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo');
    }
  };

  const cancelPhoto = () => {
    setShowTitleModal(false);
    setPhotoUri(null);
    setPhotoTitle('');
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ModernHeader
        title="📷 Camera"
        subtitle="Take a photo"
        variant="gradient"
        showBackButton
        onBackPress={() => router.back()}
        rightAction={{
          icon: "camera-reverse",
          onPress: toggleCameraFacing
        }}
      />
      <ThemedView style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="picture"
      >
        <View style={styles.overlay}>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            <View style={styles.captureContainer}>
              <TouchableOpacity
                style={[
                  styles.captureButton,
                  isCapturing && styles.captureButtonActive
                ]}
                onPress={takePicture}
                disabled={isCapturing}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CameraView>

      {/* Title Modal */}
      <Modal
        visible={showTitleModal}
        transparent
        animationType="slide"
        onRequestClose={cancelPhoto}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Save Photo</ThemedText>
            
            <TextInput
              style={styles.titleInput}
              placeholder="Enter photo title (optional)"
              value={photoTitle}
              onChangeText={setPhotoTitle}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelPhoto}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={savePhoto}
              >
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 10,
  },
  captureContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
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
