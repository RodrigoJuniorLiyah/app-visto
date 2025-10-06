import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { lightTheme } from "../../constants/theme";

export const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${lightTheme.colors.background};
`;

export const Container = styled.ScrollView`
  flex: 1;
  padding-bottom: 0px;
  background-color: ${lightTheme.colors.background};
`;

export const Content = styled.View`
  padding: 0px 20px;
`;

export const Header = styled(LinearGradient).attrs({
  colors: [lightTheme.colors.primary, lightTheme.colors.secondary],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  align-items: center;
  margin-bottom: 32px;
  padding: 24px 20px;
  border-radius: 20px;
  shadow-color: ${lightTheme.colors.primary};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.3;
  shadow-radius: 16px;
  elevation: 8;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${lightTheme.colors.white};
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: ${lightTheme.colors.white};
  text-align: center;
  line-height: 22px;
  opacity: 0.9;
`;

export const FeaturesContainer = styled.View`
  margin-bottom: 32px;
`;

export const FeaturesTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${lightTheme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

export const FeatureCard = styled.TouchableOpacity<{ color?: string }>`
  background-color: ${lightTheme.colors.white};
  border-radius: 16px;
  margin-bottom: 16px;
  border-left-width: 5px;
  border-left-color: ${lightTheme.colors.primary};
  shadow-color: ${lightTheme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 12px;
  elevation: 4;
`;

export const FeatureContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px;
`;

export const FeatureIcon = styled(LinearGradient).attrs<{ color?: string }>((props: { color?: string }) => ({
  colors: [props.color || lightTheme.colors.primary, lightTheme.colors.secondary],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  shadow-color: ${lightTheme.colors.primary};
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
  color: ${lightTheme.colors.text};
  margin-bottom: 4px;
`;

export const FeatureDescription = styled.Text`
  font-size: 14px;
  color: ${lightTheme.colors.gray700};
  line-height: 20px;
`;

export const InfoContainer = styled.View`
  background-color: ${lightTheme.colors.white};
  border-radius: 16px;
  padding: 24px;
  
  shadow-color: ${lightTheme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 12px;
  elevation: 4;
`;

export const InfoTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${lightTheme.colors.text};
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
  color: ${lightTheme.colors.text};
  flex: 1;
  line-height: 22px;
`;

export const ChevronIcon = styled(Ionicons).attrs({
  name: "chevron-forward",
  size: 20,
  color: lightTheme.colors.primary,
})``;

export const CheckIcon = styled(Ionicons).attrs({
  name: "checkmark-circle",
  size: 20,
  color: lightTheme.colors.success,
})``;

export const CameraIcon = styled(Ionicons).attrs({
  name: "camera",
  size: 24,
  color: lightTheme.colors.white,
})``;

export const GalleryIcon = styled(Ionicons).attrs({
  name: "images",
  size: 24,
  color: lightTheme.colors.white,
})``;

export const InfoIcon = styled(Ionicons).attrs({
  name: "information-circle",
  size: 24,
  color: lightTheme.colors.white,
})``;

export const CompareIcon = styled(Ionicons).attrs({
  name: "git-compare",
  size: 24,
  color: lightTheme.colors.white,
})``;