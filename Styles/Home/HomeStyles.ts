import Ionicons from "@expo/vector-icons/Ionicons";
import styled from "styled-components/native";
import { lightTheme } from "../../constants/theme";

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${lightTheme.colors.background};
`;

export const Content = styled.View`
  padding: 24px;
`;

export const Header = styled.View`
  align-items: center;
  margin-bottom: 48px;
  padding-top: 24px;
  padding-bottom: 24px;
`;

export const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: ${lightTheme.colors.text};
  text-align: center;
  margin-bottom: 16px;
`

export const Subtitle = styled.Text`
  font-size: 16px;
  color: ${lightTheme.colors.gray700};
  text-align: center;
  line-height: 24px;
`;

export const FeaturesContainer = styled.View`
  margin-bottom: 48px;
`;

export const FeaturesTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${lightTheme.colors.text};
  margin-bottom: 24px;
`;

export const FeatureCard = styled.TouchableOpacity<{ color?: string }>`
  background-color: ${lightTheme.colors.white};
  border-radius: 12px;
  margin-bottom: 16px;
  border-left-width: 4px;
  border-left-color: ${lightTheme.colors.primary};
`;

export const FeatureContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 24px;
`;

export const FeatureIcon = styled.View<{ color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin-right: 24px;
  background-color: ${lightTheme.colors.primary};
`;

export const FeatureText = styled.View`
  flex: 1;
`;

export const FeatureTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${lightTheme.colors.text};
  margin-bottom: 4px;
`;

export const FeatureDescription = styled.Text`
  font-size: 14px;
  color: ${lightTheme.colors.gray700};
`;

export const InfoContainer = styled.View`
  background-color: ${lightTheme.colors.white};
  border-radius: 12px;
  padding: 24px;
`;

export const InfoTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${lightTheme.colors.text};
  margin-bottom: 24px;
`;

export const InfoList = styled.View`
  gap: 8px;
`;

export const InfoItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const InfoText = styled.Text`
  font-size: 14px;
  color: ${lightTheme.colors.text};
  flex: 1;
`;

export const ChevronIcon = styled(Ionicons).attrs({
  name: "chevron-forward",
  size: 20,
  color: lightTheme.colors.gray700,
})``;

export const CheckIcon = styled(Ionicons).attrs({
  name: "checkmark-circle",
  size: 16,
  color: lightTheme.colors.success,
})``;
