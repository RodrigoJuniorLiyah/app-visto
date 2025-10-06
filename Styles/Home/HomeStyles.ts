import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const SafeContainer = styled(SafeAreaView).attrs({
  edges: ['top']
})`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
`;

export const Container = styled(ScrollView).attrs({
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
`;

export const Content = styled.View`
  padding: 0px 20px;
`;

export const Header = styled(LinearGradient).attrs((props: any) => ({
  colors: props.theme.colors.background === '#1A1A1A' 
    ? ['#2A2A2A', '#1F1F1F'] 
    : [props.theme.colors.primary, props.theme.colors.secondary],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  align-items: center;
  margin-bottom: 32px;
  padding: 24px 20px;
  border-radius: 20px;
  shadow-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#000000' : props.theme.colors.primary};
  shadow-offset: 0px 8px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.5 : 0.3};
  shadow-radius: 16px;
  elevation: 8;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${(props: any) => props.theme.colors.white};
  text-align: center;
  margin-bottom: 8px;
  text-shadow: ${(props: any) => props.theme.colors.background === '#1A1A1A' 
    ? '0px 2px 8px rgba(0, 0, 0, 0.8)' 
    : '0px 2px 4px rgba(0, 0, 0, 0.3)'};
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: ${(props: any) => props.theme.colors.white};
  text-align: center;
  line-height: 22px;
  opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.95 : 0.9};
  text-shadow: ${(props: any) => props.theme.colors.background === '#1A1A1A' 
    ? '0px 1px 4px rgba(0, 0, 0, 0.6)' 
    : 'none'};
`;

export const FeaturesContainer = styled.View`
  margin-top: 30px;
  margin-bottom: 30px;
`;

export const FeaturesTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${(props: any) => props.theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

export const FeatureCard = styled.TouchableOpacity<{ color?: string }>`
  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
  border-radius: 16px;
  margin-bottom: 16px;
  border-left-width: 5px;
  border-left-color: ${(props: any) => props.theme.colors.primary};
  shadow-color: ${(props: any) => props.theme.colors.black};
  shadow-offset: 0px 4px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 12px;
  elevation: 4;
`;

export const FeatureContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px;
`;

export const FeatureIcon = styled(LinearGradient).attrs<{ color?: string }>((props: { color?: string; theme: any }) => ({
  colors: [props.color || props.theme.colors.primary, props.theme.colors.secondary],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  shadow-color: ${(props: any) => props.theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 4;
`;

export const FeatureText = styled.View`
  flex: 1;
`;

export const FeatureTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? props.theme.colors.white : props.theme.colors.text};
  margin-bottom: 4px;
`;

export const FeatureDescription = styled.Text`
  font-size: 14px;
  color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? props.theme.colors.gray800 : props.theme.colors.gray500};
  line-height: 20px;
`;

export const InfoContainer = styled.View`
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  shadow-color: ${(props: any) => props.theme.colors.black};
  shadow-offset: 0px 4px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 12px;
  elevation: 4;
  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
`;

export const InfoTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? props.theme.colors.white : props.theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

export const InfoList = styled.View`
  gap: 12px;
`;

export const InfoItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
`;

export const InfoText = styled.Text`
  font-size: 15px;
  color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? props.theme.colors.gray800 : props.theme.colors.text};
  flex: 1;
  line-height: 22px;
`;

export const ChevronIcon = styled(Ionicons).attrs((props: any) => ({
  name: "chevron-forward",
  size: 20,
  color: props.theme.colors.primary,
}))``;

export const CheckIcon = styled(Ionicons).attrs((props: any) => ({
  name: "checkmark-circle",
  size: 20,
  color: props.theme.colors.success,
}))``;

export const CameraIcon = styled(Ionicons).attrs((props: any) => ({
  name: "camera",
  size: 24,
  color: props.theme.colors.white,
}))``;

export const GalleryIcon = styled(Ionicons).attrs((props: any) => ({
  name: "images",
  size: 24,
  color: props.theme.colors.white,
}))``;

export const InfoIcon = styled(Ionicons).attrs((props: any) => ({
  name: "information-circle",
  size: 24,
  color: props.theme.colors.white,
}))``;

export const CompareIcon = styled(Ionicons).attrs((props: any) => ({
  name: "git-compare",
  size: 24,
  color: props.theme.colors.white,
}))``;