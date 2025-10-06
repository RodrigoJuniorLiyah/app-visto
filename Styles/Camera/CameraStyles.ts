import { CameraView } from 'expo-camera';
import { Dimensions, TextInput } from 'react-native';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');

// Styled Components
export const Container = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
`;

export const Camera = styled(CameraView)`
  flex: 1;
`;

export const Overlay = styled.View`
  flex: 1;
  background-color: transparent;
  justify-content: flex-end;
`;

export const BottomControls = styled.View`
  padding: 20px;
  background-color: rgba(0,0,0,0.4);
  align-items: center;
`;

export const CaptureContainer = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: rgba(255,255,255,0.3);
  justify-content: center;
  align-items: center;
`;

export const CaptureButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

export const CaptureIndicator = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: red;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
`;

export const ModalContent = styled.View`
  width: 80%;
  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
  border-radius: 10px;
  padding: 20px;
  align-items: center;
  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 8px;
  elevation: 4;
`;

export const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: ${(props: any) => props.theme.colors.text};
`;

export const PreviewImage = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  margin-bottom: 15px;
`;

export const TitleInput = styled(TextInput)`
  width: 100%;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? props.theme.colors.gray600 : props.theme.colors.gray200};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  color: ${(props: any) => props.theme.colors.text};
  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#1A1A1A' : props.theme.colors.background};
  font-size: 16px;
`;

export const ModalActions = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

export const ModalButton = styled.TouchableOpacity<{ variant: 'cancel' | 'save' }>`
  padding-vertical: 12px;
  padding-horizontal: 24px;
  border-radius: 8px;
  background-color: ${(props: any) => {
    if (props.variant === 'cancel') {
      return props.theme.colors.background === '#1A1A1A' ? props.theme.colors.gray600 : props.theme.colors.gray200;
    }
    return props.theme.colors.blue;
  }};
  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 4px;
  elevation: 2;
`;

export const ModalButtonText = styled.Text<{ variant: 'cancel' | 'save' }>`
  color: ${(props: any) => {
    if (props.variant === 'cancel') {
      return props.theme.colors.background === '#1A1A1A' ? props.theme.colors.white : props.theme.colors.text;
    }
    return props.theme.colors.white;
  }};
  font-weight: 600;
  font-size: 16px;
`;

export const Message = styled.Text`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
  color: ${(props: any) => props.theme.colors.text};
`;

export const Button = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.blue};
  padding-horizontal: 20px;
  padding-vertical: 10px;
  border-radius: 5px;
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;
