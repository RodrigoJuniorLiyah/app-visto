import { ModernHeader } from '@/components/ModernHeader';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { PhotoStorage } from '../../../services/PhotoStorage';

const { width, height } = Dimensions.get('window');

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
`;

const Camera = styled(CameraView)`
  flex: 1;
`;

const Overlay = styled.View`
  flex: 1;
  background-color: transparent;
  justify-content: flex-end;
`;

const BottomControls = styled.View`
  padding: 20px;
  background-color: rgba(0,0,0,0.4);
  align-items: center;
`;

const CaptureContainer = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: rgba(255,255,255,0.3);
  justify-content: center;
  align-items: center;
`;

const CaptureButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const CaptureIndicator = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: red;
`;

const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
`;

const ModalContent = styled.View`
  width: 80%;
  background-color: ${(props: any) => props.theme.colors.white};
  border-radius: 10px;
  padding: 20px;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: ${(props: any) => props.theme.colors.text};
`;

const PreviewImage = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  margin-bottom: 15px;
`;

const TitleInput = styled(TextInput)`
  width: 100%;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.gray200};
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
  color: ${(props: any) => props.theme.colors.text};
  background-color: ${(props: any) => props.theme.colors.background};
`;

const ModalActions = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const ModalButton = styled.TouchableOpacity<{ variant: 'cancel' | 'save' }>`
  padding-vertical: 10px;
  padding-horizontal: 20px;
  border-radius: 5px;
  background-color: ${(props: any) => props.variant === 'cancel' ? props.theme.colors.gray200 : props.theme.colors.blue};
`;

const ModalButtonText = styled.Text<{ variant: 'cancel' | 'save' }>`
  color: ${(props: any) => props.variant === 'cancel' ? props.theme.colors.text : props.theme.colors.white};
  font-weight: bold;
`;

const Message = styled.Text`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
  color: ${(props: any) => props.theme.colors.text};
`;

const Button = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.blue};
  padding-horizontal: 20px;
  padding-vertical: 10px;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

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
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Container>
          <ThemedText>Requesting camera permission...</ThemedText>
        </Container>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Container>
          <Message>
            Camera permission is required to take photos
          </Message>
          <Button onPress={requestPermission}>
            <ButtonText>Grant Permission</ButtonText>
          </Button>
        </Container>
      </SafeAreaView>
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
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
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
              <ModalTitle>Save Photo</ModalTitle>

              <TitleInput
                placeholder="Enter photo title (optional)"
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
                  <ModalButtonText variant="cancel">Cancel</ModalButtonText>
                </ModalButton>

                <ModalButton
                  variant="save"
                  onPress={savePhoto}
                >
                  <ModalButtonText variant="save">Save</ModalButtonText>
                </ModalButton>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </Container>
    </SafeAreaView>
  );
}