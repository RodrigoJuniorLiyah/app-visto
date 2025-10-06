import { ModernHeader } from '@/components/ModernHeader';
import { useTheme } from '@/contexts/ThemeContext';
import { PhotoStorage } from '@/services/PhotoStorage';
import {
  ActionButton,
  ActionButtonText,
  ActionsCard,
  ActionsGrid,
  CardHeader,
  CardTitle,
  Container,
  Content,
  CoordinatesText,
  InfoCard,
  InfoContent,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  ModalButton,
  ModalButtonText,
  ModalButtons,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  OverlayButton,
  Photo,
  PhotoCard,
  PhotoOverlay,
  TitleInput
} from '@/Styles/PhotoDetail/PhotoDetailStyles';
import { PhotoMetadata } from '@/types/photo';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PhotoDetailScreen() {
  const { theme } = useTheme();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <ModernHeader
        title="📸 Detalhes da Foto"
        subtitle={photo?.title || 'Carregando...'}
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
                <Ionicons name="create" size={20} color={theme.colors.white} />
              </OverlayButton>
              <OverlayButton onPress={handleSharePhoto}>
                <Ionicons name="share" size={20} color={theme.colors.white} />
              </OverlayButton>
            </PhotoOverlay>
          </PhotoCard>

          {/* Photo Info Card */}
          <InfoCard>
            <CardHeader>
              <Ionicons name="information-circle" size={24} color={theme.colors.blue} />
              <CardTitle>Informações da Foto</CardTitle>
            </CardHeader>
            
            <InfoGrid>
              <InfoItem>
                <Ionicons name="text" size={16} color={theme.colors.gray500} />
                <InfoContent>
                  <InfoLabel>Title</InfoLabel>
                  <InfoValue>
                    {photo.title || 'Untitled'}
                  </InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <Ionicons name="time" size={16} color={theme.colors.gray500} />
                <InfoContent>
                  <InfoLabel>Date & Time</InfoLabel>
                  <InfoValue>
                    {photo.date} at {photo.time}
                  </InfoValue>
                </InfoContent>
              </InfoItem>

              {photo.location && (
                <InfoItem>
                  <Ionicons name="location" size={16} color={theme.colors.gray500} />
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
                <Ionicons name="resize" size={16} color={theme.colors.gray500} />
                <InfoContent>
                  <InfoLabel>Dimensions</InfoLabel>
                  <InfoValue>
                    {photo.width} × {photo.height}
                  </InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <Ionicons name="folder" size={16} color={theme.colors.gray500} />
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
              <Ionicons name="settings" size={24} color={theme.colors.blue} />
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            
            <ActionsGrid>
              <ActionButton
                variant="edit"
                onPress={() => setShowEditModal(true)}
              >
                <Ionicons name="create" size={20} color={theme.colors.white} />
                <ActionButtonText>Editar Título</ActionButtonText>
              </ActionButton>
              
              <ActionButton
                variant="share"
                onPress={handleSharePhoto}
              >
                <Ionicons name="share" size={20} color={theme.colors.white} />
                <ActionButtonText>Compartilhar</ActionButtonText>
              </ActionButton>
              
              <ActionButton
                variant="delete"
                onPress={handleDeletePhoto}
              >
                <Ionicons name="trash" size={20} color={theme.colors.white} />
                <ActionButtonText>Excluir</ActionButtonText>
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
              <ModalTitle>Editar Título da Foto</ModalTitle>
              
              <TitleInput
                placeholder="Digite o título da foto"
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

