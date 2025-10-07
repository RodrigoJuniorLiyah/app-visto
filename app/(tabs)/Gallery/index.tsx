import { ModernHeader } from '@/components/ModernHeader';
import { useTheme } from '@/contexts/ThemeContext';
import {
  ActionButton,
  ActionButtonText,
  ClearButton,
  ClearIcon,
  Container,
  EmptyState,
  EmptySubtitle,
  EmptyTitle,
  Photo,
  PhotoContainer,
  PhotoDate,
  PhotoInfo,
  PhotoLocation,
  PhotosList,
  PhotoTitle,
  SearchContainer,
  SearchIcon,
  SearchInput,
  SelectionActions,
  SelectionOverlay,
  TakePhotoButton,
  TakePhotoButtonText
} from '@/Styles/Gallery/GalleryStyles';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PhotoStorage } from '../../../services/PhotoStorage';
import { PhotoMetadata } from '../../../types/photo';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 30) / 2; // 2 columns with padding

export default function GalleryScreen() {
  const { theme } = useTheme();
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<PhotoMetadata[]>([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
      console.log('🔄 Carregando fotos da galeria...');
      setIsLoading(true);
      
      // Primeiro, carregar fotos do armazenamento
      await photoStorage.loadPhotosFromStorage();
      
      // Depois, obter todas as fotos
      const allPhotos = photoStorage.getAllPhotos();
      console.log('📸 Fotos carregadas:', allPhotos.length);
      
      setPhotos(allPhotos);
      setIsLoading(false);

    } catch (error) {
      console.error('❌ Error loading photos:', error);
      setIsLoading(false);
      Alert.alert('Erro', 'Falha ao carregar fotos');
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
      'Excluir Fotos',
      `Tem certeza que deseja excluir ${selectedPhotos.size} foto(s)?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
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
      Alert.alert('Comparar Fotos', 'Selecione exatamente 2 fotos para comparar');
      return;
    }

    const photoIds = [...selectedPhotos];
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

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <EmptyState>
          <Ionicons name="hourglass-outline" size={80} color={theme.colors.gray500} />
          <EmptyTitle>Carregando Fotos...</EmptyTitle>
          <EmptySubtitle>
            Aguarde enquanto carregamos suas fotos
          </EmptySubtitle>
        </EmptyState>
      );
    }

    return (
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
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
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
          keyExtractor={(item: any) => item.id}
          numColumns={2}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
          removeClippedSubviews={true}
          getItemLayout={(data: any, index: number) => ({
            length: ITEM_SIZE,
            offset: ITEM_SIZE * Math.floor(index / 2),
            index,
          })}
        />
      </Container>
    </SafeAreaView>
  );
}

