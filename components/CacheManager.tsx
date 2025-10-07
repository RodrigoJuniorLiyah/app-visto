import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../contexts/ThemeContext';
import { ImageCache } from '../services/ImageCache';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 12px 16px;
  margin: 8px 16px;

  border-radius: 12px;

  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.gray100};
`;

const CacheInfo = styled.View`
  flex: 1;
`;

const CacheTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;

  color: ${(props: any) => props.theme.colors.text};
`;

const CacheSubtitle = styled.Text`
  font-size: 12px;

  color: ${(props: any) => props.theme.colors.gray500};
`;

const CacheActions = styled.View`
  flex-direction: row;
  align-items: center;

  gap: 8px;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 8px;

  border-radius: 8px;

  background-color: ${(props: any) => props.theme.colors.primary};
`;

const ClearButton = styled.TouchableOpacity`
  padding: 8px;

  border-radius: 8px;

  background-color: ${(props: any) => props.theme.colors.danger};
`;

interface CacheManagerProps {
  onCacheCleared?: () => void;
}

export const CacheManager: React.FC<CacheManagerProps> = ({ onCacheCleared }) => {
  const { theme } = useTheme();
  const [cacheStats, setCacheStats] = useState({ size: 0, count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  
  const imageCache = ImageCache.getInstance();

  useEffect(() => {
    updateCacheStats();
  }, []);

  const updateCacheStats = () => {
    const stats = imageCache.getCacheStats();
    setCacheStats(stats);
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Limpar Cache',
      'Tem certeza que deseja limpar todo o cache de imagens? Isso pode tornar o carregamento mais lento temporariamente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await imageCache.clearCache();
              updateCacheStats();
              onCacheCleared?.();
              Alert.alert('Sucesso', 'Cache limpo com sucesso!');
            } catch (error) {
              console.error('Error clearing cache:', error);
              Alert.alert('Erro', 'Falha ao limpar cache');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatCacheSize = (size: number): string => {
    if (size < 1) {
      return `${(size * 1024).toFixed(0)} KB`;
    }
    return `${size.toFixed(1)} MB`;
  };

  return (
    <Container>
      <CacheInfo>
        <CacheTitle>Cache de Imagens</CacheTitle>
        <CacheSubtitle>
          {cacheStats.count} imagens • {formatCacheSize(cacheStats.size)}
        </CacheSubtitle>
      </CacheInfo>
      
      <CacheActions>
        <ActionButton onPress={updateCacheStats} disabled={isLoading}>
          <Ionicons 
            name="refresh" 
            size={16} 
            color={theme.colors.white} 
          />
        </ActionButton>
        
        <ClearButton onPress={handleClearCache} disabled={isLoading}>
          <Ionicons 
            name="trash" 
            size={16} 
            color={theme.colors.white} 
          />
        </ClearButton>
      </CacheActions>
    </Container>
  );
};
