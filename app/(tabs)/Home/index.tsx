import { ModernHeader } from '@/components/ModernHeader';
import { useTheme } from '@/contexts/ThemeContext';
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
  SafeContainer
} from '@/Styles/Home/HomeStyles';
import { router } from 'expo-router';
import React from 'react';

export default function HomeScreen() {
  const { theme } = useTheme();
  
  const features = [
    {
      title: 'Tirar Fotos',
      description: 'Capture momentos incríveis com sua câmera',
      icon: 'camera',
      color: theme.colors.primary,
      onPress: () => router.push('/(tabs)/Camera'),
    },
    {
      title: 'Ver Galeria',
      description: 'Navegue pela sua coleção de fotos',
      icon: 'images',
      color: theme.colors.secondary,
      onPress: () => router.push('/(tabs)/Gallery'),
    },
    {
      title: 'Detalhes da Foto',
      description: 'Visualize metadados e informações de localização',
      icon: 'information-circle',
      color: theme.colors.blue,
      onPress: () => router.push('/(tabs)/Gallery'),
    },
    {
      title: 'Comparar Fotos',
      description: 'Ferramenta de comparação lado a lado',
      icon: 'git-compare',
      color: theme.colors.alert,
      onPress: () => router.push('/(tabs)/Gallery'),
    },
  ];

  return (
    <SafeContainer>
      <ModernHeader
        title="📸 Galeria de Fotos"
        subtitle="Capture, organize e compare suas fotos"
        variant="gradient"
        showThemeToggle
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
          <InfoTitle>Recursos do App</InfoTitle>
          <InfoList>
            <InfoItem>
              <CheckIcon />
              <InfoText>Integração da câmera com localização</InfoText>
            </InfoItem>
            <InfoItem>
              <CheckIcon />
              <InfoText>Armazenamento offline e cache</InfoText>
            </InfoItem>
            <InfoItem>
              <CheckIcon />
              <InfoText>Buscar e filtrar fotos</InfoText>
            </InfoItem>
            <InfoItem>
              <CheckIcon />
              <InfoText>Ferramenta de comparação de fotos</InfoText>
            </InfoItem>
            <InfoItem>
              <CheckIcon />
              <InfoText>Compartilhar com metadados</InfoText>
            </InfoItem>
            <InfoItem>
              <CheckIcon />
              <InfoText>Suporte ao modo escuro</InfoText>
            </InfoItem>
          </InfoList>
        </InfoContainer>
        </Content>
      </Container>
    </SafeContainer>
  );
}