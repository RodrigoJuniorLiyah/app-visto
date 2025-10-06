import { MobileTheme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTheme } from 'styled-components';
import styled from 'styled-components/native';

// Styled Components
const Container = styled.ScrollView<{ theme: MobileTheme }>`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.View<{ theme: MobileTheme }>`
  padding: 24px;
`;

const Header = styled.View<{ theme: MobileTheme }>`
  align-items: center;
  margin-bottom: 48px;
  padding-top: 24px;
  padding-bottom: 24px;
`;

const Title = styled.Text<{ theme: MobileTheme }>`
  font-size: 32px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin-bottom: 16px;
`;

const Subtitle = styled.Text<{ theme: MobileTheme }>`
  font-size: 16px;
  color: ${props => props.theme.colors.gray700};
  text-align: center;
  line-height: 24px;
`;

const FeaturesContainer = styled.View<{ theme: MobileTheme }>`
  margin-bottom: 48px;
`;

const FeaturesTitle = styled.Text<{ theme: MobileTheme }>`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;
`;

const FeatureCard = styled.TouchableOpacity<{ theme: MobileTheme; color?: string }>`
  background-color: ${props => props.theme.colors.white};
  border-radius: 12px;
  margin-bottom: 16px;
  border-left-width: 4px;
  border-left-color: ${props => props.color || props.theme.colors.primary};
`;

const FeatureContent = styled.View<{ theme: MobileTheme }>`
  flex-direction: row;
  align-items: center;
  padding: 24px;
`;

const FeatureIcon = styled.View<{ theme: MobileTheme; color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin-right: 24px;
  background-color: ${props => props.color || props.theme.colors.primary};
`;

const FeatureText = styled.View<{ theme: MobileTheme }>`
  flex: 1;
`;

const FeatureTitle = styled.Text<{ theme: MobileTheme }>`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const FeatureDescription = styled.Text<{ theme: MobileTheme }>`
  font-size: 14px;
  color: ${props => props.theme.colors.gray700};
`;

const InfoContainer = styled.View<{ theme: MobileTheme }>`
  background-color: ${props => props.theme.colors.white};
  border-radius: 12px;
  padding: 24px;
`;

const InfoTitle = styled.Text<{ theme: MobileTheme }>`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;
`;

const InfoList = styled.View<{ theme: MobileTheme }>`
  gap: 8px;
`;

const InfoItem = styled.View<{ theme: MobileTheme }>`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const InfoText = styled.Text<{ theme: MobileTheme }>`
  font-size: 14px;
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

                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={theme.colors.gray700} 
                />
              </FeatureContent>
            </FeatureCard>
          ))}
        </FeaturesContainer>

        <InfoContainer>
          <InfoTitle>App Features</InfoTitle>
          <InfoList>
            <InfoItem>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <InfoText>Camera integration with location</InfoText>
            </InfoItem>
            <InfoItem>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <InfoText>Offline storage and cache</InfoText>
            </InfoItem>
            <InfoItem>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <InfoText>Search and filter photos</InfoText>
            </InfoItem>
            <InfoItem>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <InfoText>Photo comparison tool</InfoText>
            </InfoItem>
            <InfoItem>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <InfoText>Share with metadata</InfoText>
            </InfoItem>
            <InfoItem>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <InfoText>Dark mode support</InfoText>
            </InfoItem>
          </InfoList>
        </InfoContainer>
      </Content>
    </Container>
  );
}