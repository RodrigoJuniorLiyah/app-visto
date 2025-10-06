import { ModernHeader } from '@/components/ModernHeader';
import { lightTheme } from '@/constants/theme';
import {
  CameraIcon,
  CheckIcon,
  ChevronIcon,
  CompareIcon,
  Container,
  Content,
  FeatureCard,
  FeatureContent,
  FeatureDescription,
  FeatureIcon,
  FeaturesContainer,
  FeaturesTitle,
  FeatureText,
  FeatureTitle,
  GalleryIcon,
  InfoContainer,
  InfoIcon,
  InfoItem,
  InfoList,
  InfoText,
  InfoTitle,
  SafeContainer,
} from '@/Styles/Home/HomeStyles';
import { router } from 'expo-router';
import React from 'react';

export default function HomeScreen() {
  const features = [
    {
      title: 'Take Photos',
      description: 'Capture amazing moments with your camera',
      icon: 'camera',
      color: lightTheme.colors.primary,
      onPress: () => router.push('/(tabs)/Camera'),
    },
    {
      title: 'View Gallery',
      description: 'Browse through your photo collection',
      icon: 'images',
      color: lightTheme.colors.secondary,
      onPress: () => router.push('/(tabs)/Gallery'),
    },
    {
      title: 'Photo Details',
      description: 'View metadata and location information',
      icon: 'information-circle',
      color: lightTheme.colors.blue,
      onPress: () => router.push('/(tabs)/Gallery'),
    },
    {
      title: 'Compare Photos',
      description: 'Side-by-side photo comparison tool',
      icon: 'git-compare',
      color: lightTheme.colors.alert,
      onPress: () => router.push('/(tabs)/Gallery'),
    },
  ];

  return (
    <SafeContainer>
      <ModernHeader
        title="📸 Photo Gallery"
        subtitle="Capture, organize, and compare your photos with location data and metadata"
        variant="gradient"
        rightAction={{
          icon: "settings",
          onPress: () => console.log("Settings pressed")
        }}
      />
      <Container>
        <Content>

        <FeaturesContainer>
          <FeaturesTitle>Features</FeaturesTitle>

          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              color={feature.color}
              onPress={feature.onPress}
            >
              <FeatureContent>
                <FeatureIcon color={feature.color}>
                  {feature.icon === 'camera' && <CameraIcon />}
                  {feature.icon === 'images' && <GalleryIcon />}
                  {feature.icon === 'information-circle' && <InfoIcon />}
                  {feature.icon === 'git-compare' && <CompareIcon />}
                </FeatureIcon>

                <FeatureText>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureText>

                <ChevronIcon />
              </FeatureContent>
            </FeatureCard>
          ))}
        </FeaturesContainer>

        <InfoContainer>
          <InfoTitle>App Features</InfoTitle>
          <InfoList>
            <InfoItem>
              <CheckIcon />
              <InfoText>Camera integration with location</InfoText>
            </InfoItem>
            <InfoItem>
              <CheckIcon />
              <InfoText>Offline storage and cache</InfoText>
            </InfoItem>
            <InfoItem>
              <CheckIcon />
              <InfoText>Search and filter photos</InfoText>
            </InfoItem>
            <InfoItem>
              <CheckIcon />
              <InfoText>Photo comparison tool</InfoText>
            </InfoItem>
            <InfoItem>
              <CheckIcon />
              <InfoText>Share with metadata</InfoText>
            </InfoItem>
            <InfoItem>
              <CheckIcon />
              <InfoText>Dark mode support</InfoText>
            </InfoItem>
          </InfoList>
        </InfoContainer>
        </Content>
      </Container>
    </SafeContainer>
  );
}