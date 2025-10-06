import { Image } from 'expo-image';
import { Dimensions, ScrollView } from 'react-native';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

// Styled Components
export const Container = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
`;

export const Content = styled(ScrollView)`
  flex: 1;
  padding: 16px;
`;

export const PhotoContainer = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 20px;
`;

export const PhotoWrapper = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
  border-radius: 12px;
  overflow: hidden;
  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 4px;
  elevation: 3;
`;

export const Photo = styled(Image)`
  width: 100%;
  height: 200px;
`;

export const PhotoInfo = styled.View`
  padding: 12px;
`;

export const PhotoTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props: any) => props.theme.colors.text};
  margin-bottom: 8px;
`;

export const PhotoDate = styled.Text`
  font-size: 14px;
  color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? props.theme.colors.gray800 : props.theme.colors.gray500};
  margin-bottom: 4px;
`;

export const PhotoLocation = styled.Text`
  font-size: 12px;
  color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? props.theme.colors.gray800 : props.theme.colors.gray700};
`;

export const ComparisonContainer = styled.View`
  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 4px;
  elevation: 3;
`;

export const ComparisonTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${(props: any) => props.theme.colors.text};
  margin-bottom: 16px;
  text-align: center;
`;

export const ComparisonItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? props.theme.colors.gray600 : props.theme.colors.gray200};
`;

export const ComparisonLabel = styled.Text`
  font-size: 14px;
  color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? props.theme.colors.gray800 : props.theme.colors.gray500};
  flex: 1;
`;

export const ComparisonValue = styled.Text`
  font-size: 14px;
  color: ${(props: any) => props.theme.colors.text};
  font-weight: 500;
`;

export const ActionButton = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.blue};
  padding-horizontal: 20px;
  padding-vertical: 12px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 10px;
`;

export const ActionButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;
