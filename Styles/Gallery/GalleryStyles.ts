import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Dimensions, FlatList, TextInput } from 'react-native';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 30) / 2; // 2 columns with padding

// Styled Components
export const Container = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
`;

export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.white};
  border-radius: 10px;
  margin: 10px;
  padding-horizontal: 10px;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  elevation: 2;
`;

export const SearchIcon = styled(Ionicons).attrs((props: any) => ({
  name: "search",
  size: 20,
}))`
  margin-right: 10px;
  color: ${(props: any) => props.theme.colors.gray500};
`;

export const SearchInput = styled(TextInput)`
  flex: 1;
  height: 40px;
  color: ${(props: any) => props.theme.colors.text};
`;

export const ClearButton = styled.TouchableOpacity`
  padding: 5px;
`;

export const ClearIcon = styled(Ionicons).attrs((props: any) => ({
  name: "close-circle",
  size: 20,
}))`
  color: ${(props: any) => props.theme.colors.gray500};
`;

export const SelectionActions = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding-vertical: 10px;
  background-color: ${(props: any) => props.theme.colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.gray200};
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
  overflow: hidden;
  position: relative;
  background-color: ${(props: any) => props.theme.colors.gray200};
  border-width: ${(props: any) => props.isSelected ? '3px' : '0px'};
  border-color: ${(props: any) => props.isSelected ? props.theme.colors.blue : 'transparent'};
`;

export const Photo = styled(Image)`
  width: 100%;
  height: 100%;
`;

export const SelectionOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 122, 255, 0.5);
  justify-content: center;
  align-items: center;
`;

export const PhotoInfo = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0,0,0,0.6);
  padding: 8px;
`;

export const PhotoTitle = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: white;
  margin-bottom: 2px;
`;

export const PhotoDate = styled.Text`
  font-size: 11px;
  color: #eee;
  margin-bottom: 2px;
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
  color: ${(props: any) => props.theme.colors.gray500};
  text-align: center;
  margin-bottom: 30px;
`;

export const TakePhotoButton = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.blue};
  padding-horizontal: 30px;
  padding-vertical: 15px;
  border-radius: 25px;
`;

export const TakePhotoButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;
