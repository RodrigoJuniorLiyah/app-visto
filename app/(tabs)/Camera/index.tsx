import { ModernHeader } from '@/components/ModernHeader';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import {
  BottomControls,
  Button,
  ButtonText,
  Camera,
  CaptureButton,
  CaptureContainer,
  CaptureIndicator,
  Container,
  Message,
  ModalActions,
  ModalButton,
  ModalButtonText,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  Overlay,
  TitleInput
} from '@/Styles/Camera/CameraStyles';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal
} from 'react-native';
import { PhotoStorage } from '../../../services/PhotoStorage';


export default function CameraScreen() {
  const { theme } = useTheme();
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
      <Container style={{ flex: 1, backgroundColor: theme.colors.background,  }}>
        <Container>
          <ThemedText>Requesting camera permission...</ThemedText>
        </Container>
      </Container>
    );
  }

  if (!permission.granted) {
    return (
      <Container>
        <Message>
          Permissão da câmera é necessária para tirar fotos
        </Message>
        <Button onPress={requestPermission}>
          <ButtonText>Conceder Permissão</ButtonText>
        </Button>
      </Container>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          exif: true,
        });
        if (photo?.uri) {
          setPhotoUri(photo.uri);
          setShowTitleModal(true);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const savePhoto = async () => {
    if (photoUri) {
      try {
        await photoStorage.savePhoto(photoUri, photoTitle);
        Alert.alert('Success', 'Photo saved successfully!');
        setShowTitleModal(false);
        setPhotoTitle('');
        setPhotoUri(null);
        router.push('/(tabs)/Gallery'); // Navigate to gallery after saving
      } catch (error) {
        console.error('Error saving photo:', error);
        Alert.alert('Error', 'Failed to save photo');
      }
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
    <Container style={{ flex: 1, backgroundColor: theme.colors.background,  }}>
      <ModernHeader
        title="📷 Câmera"
        subtitle="Tire uma foto"
        variant="gradient"
        showBackButton
        onBackPress={() => router.back()}
        rightAction={{
          icon: "camera-reverse",
          onPress: toggleCameraFacing
        }}
      />
      <Container>
        <Camera
          ref={cameraRef}
          facing={facing}
          mode="picture"
        >
          <Overlay>
            {/* Bottom controls */}
            <BottomControls>
              <CaptureContainer>
                <CaptureButton
                  onPress={takePicture}
                  disabled={isCapturing}
                >
                  {isCapturing && <CaptureIndicator />}
                </CaptureButton>
              </CaptureContainer>
            </BottomControls>
          </Overlay>
        </Camera>

        {/* Title Modal */}
        <Modal
          visible={showTitleModal}
          transparent
          animationType="slide"
          onRequestClose={cancelPhoto}
        >
          <ModalOverlay>
            <ModalContent>
              <ModalTitle>Salvar Foto</ModalTitle>

              <TitleInput
                placeholder="Digite o título da foto (opcional)"
                value={photoTitle}
                onChangeText={setPhotoTitle}
                autoFocus
                placeholderTextColor={theme.colors.gray500}
              />

              <ModalActions>
                <ModalButton
                  variant="cancel"
                  onPress={cancelPhoto}
                >
                  <ModalButtonText variant="cancel">Cancelar</ModalButtonText>
                </ModalButton>

                <ModalButton
                  variant="save"
                  onPress={savePhoto}
                >
                  <ModalButtonText variant="save">Salvar</ModalButtonText>
                </ModalButton>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </Container>
    </Container>
  );
}