import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components';

// Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.View`
  padding: 24px;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: 48px;
  padding-top: 24px;
  padding-bottom: 24px;
`;

const Title = styled.Text`
  font-size: ${props => props.theme.typography.xxxl.fontSize}px;
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin-bottom: 16px;
`;

const Subtitle = styled.Text`
  font-size: ${props => props.theme.typography.md.fontSize}px;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  line-height: ${props => props.theme.lineHeights.lg}px;
`;

const FeaturesContainer = styled.View`
  margin-bottom: 48px;
`;

const FeaturesTitle = styled.Text`
  font-size: ${props => props.theme.typography.xl.fontSize}px;
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;
`;

const FeatureCard = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.card};
  border-radius: 12px;
  margin-bottom: 16px;
  border-left-width: 4px;
  border-left-color: ${props => props.color || props.theme.colors.primary[500]};
`;

const FeatureContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 24px;
`;

const FeatureIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin-right: 24px;
  background-color: ${props => props.color || props.theme.colors.primary[500]};
`;

const FeatureText = styled.View`
  flex: 1;
`;

const FeatureTitle = styled.Text`
  font-size: ${props => props.theme.typography.md.fontSize}px;
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const FeatureDescription = styled.Text`
  font-size: ${props => props.theme.typography.sm.fontSize}px;
  color: ${props => props.theme.colors.textSecondary};
`;

const InfoContainer = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: 12px;
  padding: 24px;
`;

const InfoTitle = styled.Text`
  font-size: ${props => props.theme.typography.lg.fontSize}px;
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;
`;

const InfoList = styled.View`
  gap: 8px;
`;

const InfoItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const InfoText = styled.Text`
  font-size: ${props => props.theme.typography.sm.fontSize}px;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

export default function HomeScreen() {
  const theme = useTheme();
  const features = [
    {
      title: 'Take Photos',
      description: 'Capture moments with your camera',
      icon: 'camera',
      color: theme.colors.primary[500],
      onPress: () => router.push('/(tabs)/Camera'),
    },
    {
      title: 'View Gallery',
      description: 'Browse all your captured photos',
      icon: 'images',
      color: theme.colors.primary[400],
      onPress: () => router.push('/(tabs)/Gallery'),
    },
    {
      title: 'Photo Details',
      description: 'View metadata and location info',
      icon: 'information-circle',
      color: theme.colors.primary[300],
      onPress: () => router.push('/(tabs)/Gallery'),
    },
    {
      title: 'Compare Photos',
      description: 'Side-by-side photo comparison',
      icon: 'git-compare',
      color: theme.colors.primary[600],
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

                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={theme.colors.textSecondary} 
                />
              </FeatureContent>
            </FeatureCard>
          ))}
        </FeaturesContainer>

        <InfoContainer>
          <InfoTitle>App Features</InfoTitle>
          <InfoList>
            <InfoItem>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary[400]} />
              <InfoText>Camera integration with location</InfoText>
            </InfoItem>
            <InfoItem>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary[400]} />
              <InfoText>Offline storage and cache</InfoText>
            </InfoItem>
            <InfoItem>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary[400]} />
              <InfoText>Search and filter photos</InfoText>
            </InfoItem>
            <InfoItem>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary[400]} />
              <InfoText>Photo comparison tool</InfoText>
            </InfoItem>
            <InfoItem>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary[400]} />
              <InfoText>Share with metadata</InfoText>
            </InfoItem>
            <InfoItem>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary[400]} />
              <InfoText>Dark mode support</InfoText>
            </InfoItem>
          </InfoList>
        </InfoContainer>
      </Content>
    </Container>
  );
}