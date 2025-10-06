import { ModernHeader } from '@/components/ModernHeader';
import { useTheme } from '@/contexts/ThemeContext';
import { PhotoStorage } from '@/services/PhotoStorage';
import {
  ActionButton,
  ActionButtonText,
  ComparisonContainer,
  ComparisonItem,
  ComparisonLabel,
  ComparisonTitle,
  ComparisonValue,
  Container,
  Content,
  Photo,
  PhotoContainer,
  PhotoDate,
  PhotoInfo,
  PhotoLocation,
  PhotoTitle,
  PhotoWrapper
} from '@/Styles/PhotoComparison/PhotoComparisonStyles';
import { PhotoMetadata } from '@/types/photo';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PhotoComparisonScreen() {
  const { theme } = useTheme();
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

  const formatTimeDifference = (timestamp1: number, timestamp2: number): string => {
    const diffMs = Math.abs(timestamp1 - timestamp2);
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
    } else {
      return `${diffSeconds} ${diffSeconds === 1 ? 'segundo' : 'segundos'}`;
    }
  };

  if (!photo1 || !photo2) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
        <ModernHeader
          title="📊 Comparação de Fotos"
          subtitle="Compare duas fotos"
          variant="gradient"
          showBackButton
          onBackPress={() => router.back()}
        />
        <Container>
          <Content>
            <ComparisonTitle>Carregando...</ComparisonTitle>
          </Content>
        </Container>
      </SafeAreaView>
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
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ModernHeader
        title="📊 Comparação de Fotos"
        subtitle="Compare duas fotos"
        variant="gradient"
        showBackButton
        onBackPress={() => router.back()}
        rightAction={{
          icon: "eye",
          onPress: () => router.push({
            pathname: '/(tabs)/PhotoDetail/index',
            params: { photoId: photo1.id }
          })
        }}
      />
      <Container>
        <Content>
          {/* Photos Side by Side */}
          <PhotoContainer>
            <PhotoWrapper>
              <Photo
                source={{ uri: photo1.uri }}
                contentFit="cover"
              />
              <PhotoInfo>
                <PhotoTitle>{photo1.title || 'Untitled'}</PhotoTitle>
                <PhotoDate>{formatDate(photo1.timestamp)}</PhotoDate>
                {photo1.location && (
                  <PhotoLocation>
                    📍 {photo1.location.address || `${photo1.location.latitude.toFixed(4)}, ${photo1.location.longitude.toFixed(4)}`}
                  </PhotoLocation>
                )}
              </PhotoInfo>
            </PhotoWrapper>
            
            <PhotoWrapper>
              <Photo
                source={{ uri: photo2.uri }}
                contentFit="cover"
              />
              <PhotoInfo>
                <PhotoTitle>{photo2.title || 'Untitled'}</PhotoTitle>
                <PhotoDate>{formatDate(photo2.timestamp)}</PhotoDate>
                {photo2.location && (
                  <PhotoLocation>
                    📍 {photo2.location.address || `${photo2.location.latitude.toFixed(4)}, ${photo2.location.longitude.toFixed(4)}`}
                  </PhotoLocation>
                )}
              </PhotoInfo>
            </PhotoWrapper>
          </PhotoContainer>

          {/* Comparison Details */}
          <ComparisonContainer>
            <ComparisonTitle>Detalhes da Comparação</ComparisonTitle>
            
            <ComparisonItem>
              <ComparisonLabel>Diferença de Data:</ComparisonLabel>
              <ComparisonValue>
                {formatTimeDifference(photo1.timestamp, photo2.timestamp)}
              </ComparisonValue>
            </ComparisonItem>

            {distance !== null && (
              <ComparisonItem>
                <ComparisonLabel>Distância:</ComparisonLabel>
                <ComparisonValue>{distance.toFixed(2)} km</ComparisonValue>
              </ComparisonItem>
            )}

            <ComparisonItem>
              <ComparisonLabel>Tamanho do Arquivo 1:</ComparisonLabel>
              <ComparisonValue>{formatFileSize(photo1.size)}</ComparisonValue>
            </ComparisonItem>

            <ComparisonItem>
              <ComparisonLabel>Tamanho do Arquivo 2:</ComparisonLabel>
              <ComparisonValue>{formatFileSize(photo2.size)}</ComparisonValue>
            </ComparisonItem>

            <ComparisonItem>
              <ComparisonLabel>Dimensões 1:</ComparisonLabel>
              <ComparisonValue>{photo1.width} × {photo1.height}</ComparisonValue>
            </ComparisonItem>

            <ComparisonItem>
              <ComparisonLabel>Dimensões 2:</ComparisonLabel>
              <ComparisonValue>{photo2.width} × {photo2.height}</ComparisonValue>
            </ComparisonItem>
          </ComparisonContainer>

          {/* Action Buttons */}
          <ActionButton onPress={() => router.push({
            pathname: '/(tabs)/PhotoDetail/index',
            params: { photoId: photo1.id }
          })}>
            <ActionButtonText>Ver Detalhes da Foto 1</ActionButtonText>
          </ActionButton>

          <ActionButton onPress={() => router.push({
            pathname: '/(tabs)/PhotoDetail/index',
            params: { photoId: photo2.id }
          })}>
            <ActionButtonText>Ver Detalhes da Foto 2</ActionButtonText>
          </ActionButton>
        </Content>
      </Container>
    </SafeAreaView>
  );
}