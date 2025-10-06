import { ModernHeader } from '@/components/ModernHeader';
import { useTheme } from '@/contexts/ThemeContext';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { PhotoStorage } from '../services/PhotoStorage';
import { PhotoMetadata } from '../types/photo';

const { width } = Dimensions.get('window');

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: 16px;
`;

const PhotoContainer = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 20px;
`;

const PhotoWrapper = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.white};
  border-radius: 12px;
  overflow: hidden;
  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const Photo = styled(Image)`
  width: 100%;
  height: 200px;
`;

const PhotoInfo = styled.View`
  padding: 12px;
`;

const PhotoTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props: any) => props.theme.colors.text};
  margin-bottom: 8px;
`;

const PhotoDate = styled.Text`
  font-size: 14px;
  color: ${(props: any) => props.theme.colors.gray500};
  margin-bottom: 4px;
`;

const PhotoLocation = styled.Text`
  font-size: 12px;
  color: ${(props: any) => props.theme.colors.gray700};
`;

const ComparisonContainer = styled.View`
  background-color: ${(props: any) => props.theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const ComparisonTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${(props: any) => props.theme.colors.text};
  margin-bottom: 16px;
  text-align: center;
`;

const ComparisonItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.gray200};
`;

const ComparisonLabel = styled.Text`
  font-size: 14px;
  color: ${(props: any) => props.theme.colors.gray500};
  flex: 1;
`;

const ComparisonValue = styled.Text`
  font-size: 14px;
  color: ${(props: any) => props.theme.colors.text};
  font-weight: 500;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.blue};
  padding-horizontal: 20px;
  padding-vertical: 12px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 10px;
`;

const ActionButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

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

  if (!photo1 || !photo2) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ModernHeader
          title="📊 Photo Comparison"
          subtitle="Compare two photos"
          variant="gradient"
          showBackButton
          onBackPress={() => router.back()}
        />
        <Container>
          <Content>
            <ComparisonTitle>Loading...</ComparisonTitle>
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
        title="📊 Photo Comparison"
        subtitle="Compare two photos"
        variant="gradient"
        showBackButton
        onBackPress={() => router.back()}
        rightAction={{
          icon: "eye",
          onPress: () => router.push({
            pathname: '/PhotoDetail',
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
            <ComparisonTitle>Comparison Details</ComparisonTitle>
            
            <ComparisonItem>
              <ComparisonLabel>Date Difference:</ComparisonLabel>
              <ComparisonValue>
                {Math.abs(photo1.timestamp - photo2.timestamp) / (1000 * 60 * 60 * 24)} days
              </ComparisonValue>
            </ComparisonItem>

            {distance !== null && (
              <ComparisonItem>
                <ComparisonLabel>Distance:</ComparisonLabel>
                <ComparisonValue>{distance.toFixed(2)} km</ComparisonValue>
              </ComparisonItem>
            )}

            <ComparisonItem>
              <ComparisonLabel>File Size 1:</ComparisonLabel>
              <ComparisonValue>{formatFileSize(photo1.size)}</ComparisonValue>
            </ComparisonItem>

            <ComparisonItem>
              <ComparisonLabel>File Size 2:</ComparisonLabel>
              <ComparisonValue>{formatFileSize(photo2.size)}</ComparisonValue>
            </ComparisonItem>

            <ComparisonItem>
              <ComparisonLabel>Dimensions 1:</ComparisonLabel>
              <ComparisonValue>{photo1.width} × {photo1.height}</ComparisonValue>
            </ComparisonItem>

            <ComparisonItem>
              <ComparisonLabel>Dimensions 2:</ComparisonLabel>
              <ComparisonValue>{photo2.width} × {photo2.height}</ComparisonValue>
            </ComparisonItem>
          </ComparisonContainer>

          {/* Action Buttons */}
          <ActionButton onPress={() => router.push({
            pathname: '/PhotoDetail',
            params: { photoId: photo1.id }
          })}>
            <ActionButtonText>View Photo 1 Details</ActionButtonText>
          </ActionButton>

          <ActionButton onPress={() => router.push({
            pathname: '/PhotoDetail',
            params: { photoId: photo2.id }
          })}>
            <ActionButtonText>View Photo 2 Details</ActionButtonText>
          </ActionButton>
        </Content>
      </Container>
    </SafeAreaView>
  );
}