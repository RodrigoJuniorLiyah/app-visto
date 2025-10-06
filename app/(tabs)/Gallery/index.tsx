import { ModernHeader } from '@/components/ModernHeader';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { PhotoStorage } from '../../../services/PhotoStorage';
import { PhotoMetadata } from '../../../types/photo';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 30) / 2; // 2 columns with padding

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.white};
  border-radius: 10px;
  margin: 10px;
  padding-horizontal: 10px;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  elevation: 2;
`;

const SearchIcon = styled(Ionicons).attrs((props: any) => ({
  name: "search",
  size: 20,
}))`
  margin-right: 10px;
  color: ${(props: any) => props.theme.colors.gray500};
`;

const SearchInput = styled(TextInput)`
  flex: 1;
  height: 40px;
  color: ${(props: any) => props.theme.colors.text};
`;

const ClearButton = styled.TouchableOpacity`
  padding: 5px;
`;

const ClearIcon = styled(Ionicons).attrs((props: any) => ({
  name: "close-circle",
  size: 20,
}))`
  color: ${(props: any) => props.theme.colors.gray500};
`;

const SelectionActions = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding-vertical: 10px;
  background-color: ${(props: any) => props.theme.colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.gray200};
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 10px;
  border-radius: 5px;
`;

const ActionButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${(props: any) => props.theme.colors.blue};
`;

const PhotosList = styled(FlatList)`
  padding: 5px;
`;

const PhotoContainer = styled.TouchableOpacity<{ isSelected?: boolean }>`
  width: ${ITEM_SIZE}px;
  height: ${ITEM_SIZE}px;
  margin: 5px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  background-color: ${(props: any) => props.theme.colors.gray200};
  border-width: ${(props: any) => props.isSelected ? '3px' : '0px'};
  border-color: ${(props: any) => props.isSelected ? props.theme.colors.blue : 'transparent'};
`;

const Photo = styled(Image)`
  width: 100%;
  height: 100%;
`;

const SelectionOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 122, 255, 0.5);
  justify-content: center;
  align-items: center;
`;

const PhotoInfo = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0,0,0,0.6);
  padding: 8px;
`;

const PhotoTitle = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: white;
  margin-bottom: 2px;
`;

const PhotoDate = styled.Text`
  font-size: 11px;
  color: #eee;
  margin-bottom: 2px;
`;

const PhotoLocation = styled.Text`
  font-size: 11px;
  color: #999;
`;

const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: 40px;
`;

const EmptyTitle = styled.Text`
  font-size: 24px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${(props: any) => props.theme.colors.text};
`;

const EmptySubtitle = styled.Text`
  font-size: 16px;
  color: ${(props: any) => props.theme.colors.gray500};
  text-align: center;
  margin-bottom: 30px;
`;

const TakePhotoButton = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.blue};
  padding-horizontal: 30px;
  padding-vertical: 15px;
  border-radius: 25px;
`;

const TakePhotoButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

export default function GalleryScreen() {
  const { theme } = useTheme();
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

  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [])
  );

  useEffect(() => {
    filterPhotos();
  }, [photos, searchText]);

  const loadPhotos = async () => {
    try {
      // Force reload photos from storage
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
    try {
      await loadPhotos();
    } finally {
      setRefreshing(false);
    }
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
      <PhotoContainer
        isSelected={isSelected}
        onPress={() => handlePhotoPress(item)}
        onLongPress={() => {
          if (!isSelectionMode) {
            setIsSelectionMode(true);
            setSelectedPhotos(new Set([item.id]));
          }
        }}
      >
        <Photo
          source={{ uri: item.uri }}
          contentFit="cover"
        />

        {isSelected && (
          <SelectionOverlay>
            <Ionicons name="checkmark-circle" size={30} color={theme.colors.blue} />
          </SelectionOverlay>
        )}

        <PhotoInfo>
          <PhotoTitle numberOfLines={1}>
            {item.title}
          </PhotoTitle>
          <PhotoDate>
            {item.date} {item.time}
          </PhotoDate>
          {item.location && (
            <PhotoLocation numberOfLines={1}>
              📍 {item.location.address || `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}`}
            </PhotoLocation>
          )}
        </PhotoInfo>
      </PhotoContainer>
    );
  };

  const renderEmptyState = () => (
    <EmptyState>
      <Ionicons name="camera-outline" size={80} color={theme.colors.gray500} />
      <EmptyTitle>Ainda Não Há Fotos</EmptyTitle>
      <EmptySubtitle>
        Tire sua primeira foto para começar!
      </EmptySubtitle>
      <TakePhotoButton onPress={() => router.push('/(tabs)/Camera')}>
        <TakePhotoButtonText>Tirar Foto</TakePhotoButtonText>
      </TakePhotoButton>
    </EmptyState>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ModernHeader
        title="📸 Galeria"
        subtitle={`${photos.length} fotos`}
        variant="gradient"
        rightAction={{
          icon: "camera",
          onPress: () => router.push('/(tabs)/Camera')
        }}
      />
      <Container>
        {/* Search Bar */}
        {photos.length > 0 && (
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              placeholder="Buscar fotos..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={theme.colors.gray500}
            />
            {searchText.length > 0 && (
              <ClearButton onPress={() => setSearchText('')}>
                <ClearIcon />
              </ClearButton>
            )}
          </SearchContainer>
        )}

        {/* Selection Actions */}
        {isSelectionMode && selectedPhotos.size > 0 && (
          <SelectionActions>
            <ActionButton onPress={handleDeleteSelected}>
              <Ionicons name="trash" size={20} color={theme.colors.danger} />
                  <ActionButtonText>Excluir</ActionButtonText>
            </ActionButton>
            
            {selectedPhotos.size === 2 && (
              <ActionButton onPress={handleComparePhotos}>
                <Ionicons name="git-compare" size={20} color={theme.colors.blue} />
                <ActionButtonText>Comparar</ActionButtonText>
              </ActionButton>
            )}
          </SelectionActions>
        )}

        {/* Photos Grid */}
        <PhotosList
          data={filteredPhotos}
          renderItem={renderPhotoItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </Container>
    </SafeAreaView>
  );
}

