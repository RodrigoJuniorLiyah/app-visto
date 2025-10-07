import { Dimensions, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { ImageWithLoading } from '../../components/ImageWithLoading';

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
  align-items: center;

  gap: 8px;
  margin-bottom: 20px;
`;

export const PhotoWrapper = styled.View`
  flex: 1;

  border-radius: 12px;
  overflow: hidden;

  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 4px;
  elevation: 3;

  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
`;

export const Photo = styled(ImageWithLoading)`
  width: 100%;
  height: 200px;
`;

export const PhotoInfo = styled.View`
  padding: 12px;
`;

export const PhotoTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;

  margin-bottom: 8px;

  color: ${(props: any) => props.theme.colors.text};
`;

export const PhotoDate = styled.Text`
  font-size: 14px;

  margin-bottom: 4px;

  color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? props.theme.colors.gray800 : props.theme.colors.gray500};
`;

export const PhotoLocation = styled.Text`
  font-size: 12px;

  color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? props.theme.colors.gray800 : props.theme.colors.gray700};
`;

export const ComparisonContainer = styled.View`
  margin-bottom: 20px;
  padding: 16px;

  border-radius: 12px;

  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 4px;
  elevation: 3;

  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
`;

export const ComparisonTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;

  margin-bottom: 16px;

  text-align: center;

  color: ${(props: any) => props.theme.colors.text};
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
  flex: 1;

  font-size: 14px;

  color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? props.theme.colors.gray800 : props.theme.colors.gray500};
`;

export const ComparisonValue = styled.Text`
  font-size: 14px;
  font-weight: 500;

  color: ${(props: any) => props.theme.colors.text};
`;

export const ActionButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding-horizontal: 20px;
  padding-vertical: 12px;
  margin-bottom: 10px;

  border-radius: 8px;

  background-color: ${(props: any) => props.theme.colors.blue};
`;

export const ActionButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;

  color: white;
`;