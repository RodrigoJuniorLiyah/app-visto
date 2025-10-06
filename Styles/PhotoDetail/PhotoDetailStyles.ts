import { Image } from 'expo-image';
import { Dimensions, TextInput } from 'react-native';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');

// Styled Components
export const Container = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
`;

export const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

export const PhotoCard = styled.View`
  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
  border-radius: 16px;
  margin-bottom: 20px;
  overflow: hidden;
  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 8px;
  elevation: 4;
  position: relative;
`;

export const Photo = styled(Image)`
  width: 100%;
  height: 300px;
`;

export const PhotoOverlay = styled.View`
  position: absolute;
  top: 12px;
  right: 12px;
  flex-direction: row;
  gap: 8px;
`;

export const OverlayButton = styled.TouchableOpacity`
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

export const InfoCard = styled.View`
  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
  border-radius: 16px;
  margin-bottom: 20px;
  padding: 20px;
  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 4px;
  elevation: 3;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
`;

export const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${(props: any) => props.theme.colors.text};
`;

export const InfoGrid = styled.View`
  gap: 16px;
`;

export const InfoItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

export const InfoContent = styled.View`
  flex: 1;
`;

export const InfoLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${(props: any) => props.theme.colors.gray700};
  margin-bottom: 4px;
`;

export const InfoValue = styled.Text`
  font-size: 16px;
  color: ${(props: any) => props.theme.colors.text};
`;

export const CoordinatesText = styled.Text`
  font-size: 12px;
  color: ${(props: any) => props.theme.colors.gray500};
  margin-top: 4px;
`;

export const ActionsCard = styled.View`
  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
  border-radius: 16px;
  margin-bottom: 50px;
  padding: 20px;
  
  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 4px;
  elevation: 3;
`;

export const ActionsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ActionButton = styled.TouchableOpacity<{ variant: 'edit' | 'share' | 'delete' }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 12px;
  gap: 8px;
  background-color: ${(props: { variant: 'edit' | 'share' | 'delete'; theme: any }) => {
    switch (props.variant) {
      case 'edit': return props.theme.colors.blue;
      case 'share': return props.theme.colors.success;
      case 'delete': return props.theme.colors.danger;
      default: return props.theme.colors.blue;
    }
  }};
`;

export const ActionButtonText = styled.Text`
  color: ${(props: any) => props.theme.colors.white};
  font-size: 14px;
  font-weight: 600;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
  border-radius: 16px;
  padding: 24px;
  width: ${width * 0.8}px;
  max-width: 400px;
`;

export const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  color: ${(props: any) => props.theme.colors.text};
`;

export const TitleInput = styled(TextInput)`
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.gray200};
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  margin-bottom: 20px;
  background-color: ${(props: any) => props.theme.colors.background};
`;

export const ModalButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
`;

export const ModalButton = styled.TouchableOpacity<{ variant: 'cancel' | 'save' }>`
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  background-color: ${(props: { variant: 'cancel' | 'save'; theme: any }) => 
    props.variant === 'cancel' ? props.theme.colors.gray200 : props.theme.colors.blue
  };
`;

export const ModalButtonText = styled.Text<{ variant: 'cancel' | 'save' }>`
  color: ${(props: { variant: 'cancel' | 'save'; theme: any }) => 
    props.variant === 'cancel' ? props.theme.colors.text : props.theme.colors.white
  };
  font-weight: 600;
  font-size: 16px;
`;
