import { ModernHeader } from '@/components/ModernHeader';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Share,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { lightTheme } from '../constants/theme';
import { PhotoStorage } from '../services/PhotoStorage';
import { PhotoMetadata } from '../types/photo';

const { width, height } = Dimensions.get('window');

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: ${lightTheme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const PhotoCard = styled.View`
  background-color: ${lightTheme.colors.white};
  border-radius: 16px;
  margin-bottom: 20px;
  overflow: hidden;
  shadow-color: ${lightTheme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
  position: relative;
`;

const Photo = styled(Image)`
  width: 100%;
  height: 300px;
`;

const PhotoOverlay = styled.View`
  position: absolute;
  top: 12px;
  right: 12px;
  flex-direction: row;
  gap: 8px;
`;

const OverlayButton = styled.TouchableOpacity`
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const InfoCard = styled.View`
  background-color: ${lightTheme.colors.white};
  border-radius: 16px;
  margin-bottom: 20px;
  padding: 20px;
  shadow-color: ${lightTheme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
`;

const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${lightTheme.colors.text};
`;

const InfoGrid = styled.View`
  gap: 16px;
`;

const InfoItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

const InfoContent = styled.View`
  flex: 1;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${lightTheme.colors.gray700};
  margin-bottom: 4px;
`;

const InfoValue = styled.Text`
  font-size: 16px;
  color: ${lightTheme.colors.text};
`;

const CoordinatesText = styled.Text`
  font-size: 12px;
  color: ${lightTheme.colors.gray500};
  margin-top: 4px;
`;

const ActionsCard = styled.View`
  background-color: ${lightTheme.colors.white};
  border-radius: 16px;
  margin-bottom: 50px;
  padding: 20px;
  
  shadow-color: ${lightTheme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const ActionsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const ActionButton = styled.TouchableOpacity<{ variant: 'edit' | 'share' | 'delete' }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 12px;
  gap: 8px;
  background-color: ${(props: { variant: 'edit' | 'share' | 'delete' }) => {
    switch (props.variant) {
      case 'edit': return lightTheme.colors.blue;
      case 'share': return lightTheme.colors.success;
      case 'delete': return lightTheme.colors.danger;
      default: return lightTheme.colors.blue;
    }
  }};
`;

const ActionButtonText = styled.Text`
  color: ${lightTheme.colors.white};
  font-size: 14px;
  font-weight: 600;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  background-color: ${lightTheme.colors.white};
  border-radius: 16px;
  padding: 24px;
  width: ${width * 0.8}px;
  max-width: 400px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  color: ${lightTheme.colors.text};
`;

const TitleInput = styled(TextInput)`
  border-width: 1px;
  border-color: ${lightTheme.colors.gray200};
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  margin-bottom: 20px;
  background-color: ${lightTheme.colors.background};
`;

const ModalButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
`;

const ModalButton = styled.TouchableOpacity<{ variant: 'cancel' | 'save' }>`
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  background-color: ${(props: { variant: 'cancel' | 'save' }) => 
    props.variant === 'cancel' ? lightTheme.colors.gray200 : lightTheme.colors.blue
  };
`;

const ModalButtonText = styled.Text<{ variant: 'cancel' | 'save' }>`
  color: ${(props: { variant: 'cancel' | 'save' }) => 
    props.variant === 'cancel' ? lightTheme.colors.text : lightTheme.colors.white
  };
  font-weight: 600;
  font-size: 16px;
`;

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
      <Container>
        <InfoValue>Loading...</InfoValue>
      </Container>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ModernHeader
        title="📸 Photo Details"
        subtitle={photo?.title || 'Loading...'}
        variant="gradient"
        showBackButton
        onBackPress={() => router.back()}
        rightAction={{
          icon: "share",
          onPress: handleSharePhoto
        }}
      />
      <Container>
        <Content showsVerticalScrollIndicator={false}>
          {/* Photo Card */}
          <PhotoCard>
            <Photo
              source={{ uri: photo.uri }}
              contentFit="cover"
            />
            <PhotoOverlay>
              <OverlayButton onPress={() => setShowEditModal(true)}>
                <Ionicons name="create" size={20} color="white" />
              </OverlayButton>
              <OverlayButton onPress={handleSharePhoto}>
                <Ionicons name="share" size={20} color="white" />
              </OverlayButton>
            </PhotoOverlay>
          </PhotoCard>

          {/* Photo Info Card */}
          <InfoCard>
            <CardHeader>
              <Ionicons name="information-circle" size={24} color="#007AFF" />
              <CardTitle>Photo Information</CardTitle>
            </CardHeader>
            
            <InfoGrid>
              <InfoItem>
                <Ionicons name="text" size={16} color="#666" />
                <InfoContent>
                  <InfoLabel>Title</InfoLabel>
                  <InfoValue>
                    {photo.title || 'Untitled'}
                  </InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <Ionicons name="time" size={16} color="#666" />
                <InfoContent>
                  <InfoLabel>Date & Time</InfoLabel>
                  <InfoValue>
                    {photo.date} at {photo.time}
                  </InfoValue>
                </InfoContent>
              </InfoItem>

              {photo.location && (
                <InfoItem>
                  <Ionicons name="location" size={16} color="#666" />
                  <InfoContent>
                    <InfoLabel>Location</InfoLabel>
                    <InfoValue>
                      {photo.location.address || 
                       `${photo.location.latitude.toFixed(6)}, ${photo.location.longitude.toFixed(6)}`}
                    </InfoValue>
                    {photo.location.address && (
                      <CoordinatesText>
                        📍 {photo.location.latitude.toFixed(6)}, {photo.location.longitude.toFixed(6)}
                      </CoordinatesText>
                    )}
                  </InfoContent>
                </InfoItem>
              )}

              <InfoItem>
                <Ionicons name="resize" size={16} color="#666" />
                <InfoContent>
                  <InfoLabel>Dimensions</InfoLabel>
                  <InfoValue>
                    {photo.width} × {photo.height}
                  </InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <Ionicons name="folder" size={16} color="#666" />
                <InfoContent>
                  <InfoLabel>File Size</InfoLabel>
                  <InfoValue>
                    {(photo.size / 1024 / 1024).toFixed(2)} MB
                  </InfoValue>
                </InfoContent>
              </InfoItem>
            </InfoGrid>
          </InfoCard>

          {/* Actions Card */}
          <ActionsCard>
            <CardHeader>
              <Ionicons name="settings" size={24} color="#007AFF" />
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            
            <ActionsGrid>
              <ActionButton
                variant="edit"
                onPress={() => setShowEditModal(true)}
              >
                <Ionicons name="create" size={20} color="white" />
                <ActionButtonText>Edit Title</ActionButtonText>
              </ActionButton>
              
              <ActionButton
                variant="share"
                onPress={handleSharePhoto}
              >
                <Ionicons name="share" size={20} color="white" />
                <ActionButtonText>Share</ActionButtonText>
              </ActionButton>
              
              <ActionButton
                variant="delete"
                onPress={handleDeletePhoto}
              >
                <Ionicons name="trash" size={20} color="white" />
                <ActionButtonText>Delete</ActionButtonText>
              </ActionButton>
            </ActionsGrid>
          </ActionsCard>
        </Content>

        {/* Edit Modal */}
        <Modal
          visible={showEditModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowEditModal(false)}
        >
          <ModalOverlay>
            <ModalContent>
              <ModalTitle>Edit Photo Title</ModalTitle>
              
              <TitleInput
                placeholder="Enter photo title"
                value={editTitle}
                onChangeText={setEditTitle}
                autoFocus
              />

              <ModalButtons>
                <ModalButton
                  variant="cancel"
                  onPress={() => setShowEditModal(false)}
                >
                  <ModalButtonText variant="cancel">Cancel</ModalButtonText>
                </ModalButton>
                
                <ModalButton
                  variant="save"
                  onPress={handleEditTitle}
                >
                  <ModalButtonText variant="save">Save</ModalButtonText>
                </ModalButton>
              </ModalButtons>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </Container>
    </SafeAreaView>
  );
}

