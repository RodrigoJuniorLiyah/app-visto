import { CacheManager } from '@/components/CacheManager';
import ComparisonTutorial from '@/components/ComparisonTutorial';
import { ModernHeader } from '@/components/ModernHeader';
import { useTheme } from '@/contexts/ThemeContext';
import { CacheDebugger } from '@/services/CacheDebugger';
import { PhotoStorage } from '@/services/PhotoStorage';
import { TutorialService } from '@/services/TutorialService';
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
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function HomeScreen() {
  const { theme } = useTheme();
  const [showTutorial, setShowTutorial] = useState(false);
  const tutorialService = TutorialService.getInstance();
  
  // Garantir que o PhotoStorage seja inicializado
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        const photoStorage = PhotoStorage.getInstance();
        await photoStorage.loadPhotosFromStorage();
        console.log('✅ PhotoStorage inicializado na Home');
      } catch (error) {
        console.error('❌ Erro ao inicializar PhotoStorage:', error);
      }
    };
    
    initializeStorage();
  }, []);

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleTutorialClose = async () => {
    setShowTutorial(false);
    try {
      await tutorialService.markComparisonTutorialAsSeen();
    } catch (error) {
      console.error('Erro ao marcar tutorial como visto:', error);
    }
  };

  const handleTutorialComplete = () => {
    router.push('/(tabs)/Gallery');
  };

  const handleTutorialSkip = () => {
    router.push('/(tabs)/Gallery');
  };
  
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
      onPress: handleShowTutorial,
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

        <CacheManager />
        
        <FeatureCard
          color={theme.colors.alert}
          onPress={async () => {
            console.log('🔍 Iniciando debug do cache...');
            await CacheDebugger.debugCache();
          }}
        >
          <FeatureContent>
            <FeatureIcon color={theme.colors.alert}>
              <Ionicons name="bug" size={24} color="white" />
            </FeatureIcon>
            <FeatureText>
              <FeatureTitle>Debug Cache</FeatureTitle>
              <FeatureDescription>Verificar status do cache</FeatureDescription>
            </FeatureText>
            <ChevronIcon />
          </FeatureContent>
        </FeatureCard>

        <FeatureCard
          color={theme.colors.blue}
          onPress={handleShowTutorial}
        >
          <FeatureContent>
            <FeatureIcon color={theme.colors.blue}>
              <Ionicons name="help-circle" size={24} color="white" />
            </FeatureIcon>
            <FeatureText>
              <FeatureTitle>Tutorial de Comparação</FeatureTitle>
              <FeatureDescription>Aprenda a comparar fotos</FeatureDescription>
            </FeatureText>
            <ChevronIcon />
          </FeatureContent>
        </FeatureCard>
        </Content>
      </Container>

      {/* Tutorial Modal */}
      <ComparisonTutorial
        visible={showTutorial}
        onClose={handleTutorialClose}
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
      />
    </SafeContainer>
  );
}