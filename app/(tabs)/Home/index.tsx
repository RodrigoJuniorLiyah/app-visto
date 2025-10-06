import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTheme } from 'styled-components';
import {
  Container,
  Content,
  Header,
  Title,
  Subtitle,
  FeaturesContainer,
  FeaturesTitle,
  FeatureCard,
  FeatureContent,
  FeatureIcon,
  FeatureText,
  FeatureTitle,
  FeatureDescription,
  InfoContainer,
  InfoTitle,
  InfoList,
  InfoItem,
  InfoText,
  ChevronIcon,
  CheckIcon,
} from '../../Styles/Home/HomeStyles';

export default function HomeScreen() {
  const theme = useTheme();
  const features = [
    {
      title: 'Take Photos',
      description: 'Capture moments with your camera',
      icon: 'camera',
      color: theme.colors.primary,
      onPress: () => router.push('/(tabs)/Camera'),
    },
    {
      title: 'View Gallery',
      description: 'Browse all your captured photos',
      icon: 'images',
      color: theme.colors.secondary,
      onPress: () => router.push('/(tabs)/Gallery'),
    },
    {
      title: 'Photo Details',
      description: 'View metadata and location info',
      icon: 'information-circle',
      color: theme.colors.blue,
      onPress: () => router.push('/(tabs)/Gallery'),
    },
    {
      title: 'Compare Photos',
      description: 'Side-by-side photo comparison',
      icon: 'git-compare',
      color: theme.colors.alert,
      onPress: () => router.push('/(tabs)/Gallery'),
    },
  ];

  return (
    <Container>
      <Content>
        <Header>
          <Title>📸 Photo Gallery</Title>
          <Subtitle>
            Capture, organize, and compare your photos with location data and metadata
          </Subtitle>
        </Header>

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
                  <Ionicons name={feature.icon as any} size={24} color="white" />
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
  );
}