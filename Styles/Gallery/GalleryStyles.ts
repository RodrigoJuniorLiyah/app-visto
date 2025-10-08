import { Ionicons } from '@expo/vector-icons';
import { Dimensions, FlatList, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { ImageWithLoading } from '../../components/ImageWithLoading';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 30) / 2; // 2 columns with padding

export const Container = styled.View`
  flex: 1;

  background-color: ${(props: any) => props.theme.colors.background};
`;

export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;

  margin: 10px;
  padding-horizontal: 10px;

  border-radius: 10px;

  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  elevation: 2;

  background-color: ${(props: any) => {
    if (props.theme?.colors?.background === '#1A1A1A') {
      return '#2A2A2A'; // Background escuro para modo escuro
    }
    return props.theme?.colors?.white || '#FFFFFF'; // Branco para modo claro
  }};
`;

export const SearchIcon = styled(Ionicons).attrs((props: any) => ({
  name: "search",
  size: 20,
}))`
  margin-right: 10px;

  color: ${(props: any) => {
    if (props.theme?.colors?.background === '#1A1A1A') {
      return '#A0A0A0'; // Cinza claro para modo escuro
    }
    return props.theme?.colors?.gray500 || '#6C757D'; // Cinza escuro para modo claro
  }};
`;

export const SearchInput = styled(TextInput)`
  flex: 1;
  height: 40px;

  color: ${(props: any) => {
    if (props.theme?.colors?.background === '#1A1A1A') {
      return '#FFFFFF'; // Branco para modo escuro
    }
    return props.theme?.colors?.text || '#212529'; // Cor do tema ou fallback
  }};
  font-size: 16px;
`;

export const ClearButton = styled.TouchableOpacity`
  padding: 5px;
`;

export const ClearIcon = styled(Ionicons).attrs((props: any) => ({
  name: "close-circle",
  size: 20,
}))`
  color: ${(props: any) => {
    if (props.theme?.colors?.background === '#1A1A1A') {
      return '#A0A0A0'; // Cinza claro para modo escuro
    }
    return props.theme?.colors?.gray500 || '#6C757D'; // Cinza escuro para modo claro
  }};
`;

export const SelectionActions = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  padding-vertical: 10px;

  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.gray200};

  background-color: ${(props: any) => props.theme.colors.white};
`;

export const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;

  gap: 5px;
  padding: 10px;

  border-radius: 5px;
`;

export const ActionButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;

  color: ${(props: any) => props.theme.colors.blue};
`;

export const PhotosList = styled(FlatList)`
  padding: 5px;
`;

export const PhotoContainer = styled.TouchableOpacity<{ isSelected?: boolean }>`
  width: ${ITEM_SIZE}px;
  height: ${ITEM_SIZE}px;

  margin: 5px;

  border-radius: 10px;
  border-width: ${(props: any) => props.isSelected ? '3px' : '0px'};
  border-color: ${(props: any) => props.isSelected ? props.theme.colors.blue : 'transparent'};

  background-color: ${(props: any) => props.theme.colors.gray200};
`;

export const Photo = styled(ImageWithLoading)`
  width: 100%;
  height: 100%;
`;

export const SelectionOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  justify-content: center;
  align-items: center;

  background-color: rgba(0, 122, 255, 0.5);
`;

export const PhotoInfo = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  padding: 8px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  background-color: rgba(0,0,0,0.6);
`;

export const PhotoTitle = styled.Text`
  font-size: 13px;
  font-weight: bold;

  margin-bottom: 2px;

  color: white;
`;

export const PhotoDate = styled.Text`
  font-size: 11px;

  margin-bottom: 2px;

  color: #eee;
`;

export const PhotoLocation = styled.Text`
  font-size: 11px;

  color: #999;
`;

export const EmptyState = styled.View`
  flex: 1;

  justify-content: center;
  align-items: center;
  padding-horizontal: 40px;
`;

export const EmptyTitle = styled.Text`
  font-size: 24px;
  font-weight: 600;

  margin-top: 20px;
  margin-bottom: 10px;

  color: ${(props: any) => props.theme.colors.text};
`;

export const EmptySubtitle = styled.Text`
  font-size: 16px;

  text-align: center;
  margin-bottom: 30px;

  color: ${(props: any) => props.theme.colors.gray500};
`;

export const TakePhotoButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding-horizontal: 30px;
  padding-vertical: 15px;

  border-radius: 25px;

  background-color: ${(props: any) => props.theme.colors.blue};
`;

export const TakePhotoButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;

  color: white;
`;