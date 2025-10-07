import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import { ImageCache } from '../services/ImageCache';

interface ImageWithLoadingProps {
  source: { uri: string };
  style?: any;
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  showLoading?: boolean;
  useThumbnail?: boolean;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

const Container = styled.View`
  position: relative;
  overflow: hidden;
`;

const LoadingContainer = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.1);
`;

const LoadingSpinner = styled(Animated.View)`
  width: 40px;
  height: 40px;

  border-width: 3px;
  border-color: ${(props: any) => props.theme.colors.gray300};
  border-top-color: ${(props: any) => props.theme.colors.primary};
  border-radius: 20px;
`;

const LoadingText = styled.Text`
  font-size: 12px;
  font-weight: 500;
  margin-top: 8px;

  color: ${(props: any) => props.theme.colors.gray500};
`;

const ErrorContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  justify-content: center;
  align-items: center;

  background-color: ${(props: any) => props.theme.colors.gray100};
`;

const ErrorText = styled.Text`
  font-size: 12px;
  font-weight: 500;

  color: ${(props: any) => props.theme.colors.gray500};
`;

export const ImageWithLoading: React.FC<ImageWithLoadingProps> = ({
  source,
  style,
  contentFit = 'cover',
  showLoading = true,
  useThumbnail = true,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const imageCache = ImageCache.getInstance();

  useEffect(() => {
    loadImage();
  }, [source.uri]);

  const loadImage = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      setLoadingProgress(0);

      // Simular progresso de carregamento
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      let finalUri = source.uri;

      if (useThumbnail) {
        try {
          console.log('🖼️ Tentando obter thumbnail para:', source.uri);
          // Tentar obter thumbnail primeiro
          const thumbnailUri = await imageCache.getThumbnailUri(source.uri);
          console.log('✅ Thumbnail obtido:', thumbnailUri);
          finalUri = thumbnailUri;
        } catch (error) {
          console.warn('❌ Failed to get thumbnail, using original:', error);
          finalUri = source.uri;
        }
      }

      setImageUri(finalUri);
      clearInterval(progressInterval);
      setLoadingProgress(100);

      // Pequeno delay para mostrar a animação
      setTimeout(() => {
        setIsLoading(false);
        onLoad?.();
      }, 200);

    } catch (error) {
      console.error('Error loading image:', error);
      setHasError(true);
      setIsLoading(false);
      onError?.(error);
    }
  };

  // Animação do spinner
  useEffect(() => {
    if (isLoading) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1
      );

      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1
      );
    } else {
      rotation.value = withTiming(0);
      scale.value = withTiming(1);
    }
  }, [isLoading]);

  // Animação de fade in quando a imagem carrega
  useEffect(() => {
    if (!isLoading && !hasError) {
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [isLoading, hasError]);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (hasError) {
    return (
      <Container style={style}>
        <ErrorContainer>
          <ErrorText>Erro ao carregar</ErrorText>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container style={style}>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: '100%', height: '100%' }}
          contentFit={contentFit}
          onLoad={() => {
            setIsLoading(false);
            onLoad?.();
          }}
          onError={(error) => {
            setHasError(true);
            setIsLoading(false);
            onError?.(error);
          }}
        />
      )}

      {showLoading && isLoading && (
        <LoadingContainer>
          <LoadingSpinner style={spinnerStyle} />
          <LoadingText>
            {loadingProgress < 100 ? `${loadingProgress}%` : 'Carregando...'}
          </LoadingText>
        </LoadingContainer>
      )}
    </Container>
  );
};
