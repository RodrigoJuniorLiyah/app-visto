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
  flex: 1;
  margin-bottom: 20px;

  border-radius: 16px;
  overflow: hidden;

  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 8px;
  elevation: 4;

  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
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
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const OverlayButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;

  justify-content: center;
  align-items: center;

  border-radius: 20px;

  background-color: rgba(0, 0, 0, 0.6);
`;

export const InfoCard = styled.View`
  margin-bottom: 20px;
  padding: 20px;

  border-radius: 16px;

  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 4px;
  elevation: 3;

  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
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

  margin-bottom: 4px;

  color: ${(props: any) => props.theme.colors.gray700};
`;

export const InfoValue = styled.Text`
  font-size: 16px;

  color: ${(props: any) => props.theme.colors.text};
`;

export const CoordinatesText = styled.Text`
  font-size: 12px;

  margin-top: 4px;

  color: ${(props: any) => props.theme.colors.gray500};
`;

export const ActionsCard = styled.View`
  margin-bottom: 50px;
  padding: 20px;

  border-radius: 16px;

  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 4px;
  elevation: 3;

  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
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
  gap: 8px;

  border-radius: 12px;

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
  font-size: 14px;
  font-weight: 600;

  color: ${(props: any) => props.theme.colors.white};
`;

export const ModalOverlay = styled.View`
  flex: 1;

  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  width: ${width * 0.8}px;

  padding: 24px;

  border-radius: 16px;

  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
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
  margin-bottom: 20px;

  font-size: 16px;

  color: ${(props: any) => props.theme.colors.text};
  background-color: ${(props: any) => props.theme.colors.background};
`;

export const ModalButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  gap: 12px;
`;

export const ModalButton = styled.TouchableOpacity<{ variant: 'cancel' | 'save' }>`
  flex: 1;

  align-items: center;
  justify-content: center;
  padding: 16px;

  border-radius: 12px;

  background-color: ${(props: { variant: 'cancel' | 'save'; theme: any }) => 
    props.variant === 'cancel' ? props.theme.colors.gray200 : props.theme.colors.blue
  };
`;

export const ModalButtonText = styled.Text<{ variant: 'cancel' | 'save' }>`
  font-weight: 600;
  font-size: 16px;

  color: ${(props: { variant: 'cancel' | 'save'; theme: any }) => 
    props.variant === 'cancel' ? props.theme.colors.text : props.theme.colors.white
  };
`;