import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons/Ionicons";
import { MobileTheme } from "../../constants/theme";

export const Container = styled.ScrollView<{ theme: MobileTheme }>`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.View<{ theme: MobileTheme }>`
  padding: 24px;
`;

export const Header = styled.View<{ theme: MobileTheme }>`
  align-items: center;
  margin-bottom: 48px;
  padding-top: 24px;
  padding-bottom: 24px;
`;

export const Title = styled.Text<{ theme: MobileTheme }>`
  font-size: 32px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin-bottom: 16px;
`;

export const Subtitle = styled.Text<{ theme: MobileTheme }>`
  font-size: 16px;
  color: ${props => props.theme.colors.gray700};
  text-align: center;
  line-height: 24px;
`;

export const FeaturesContainer = styled.View<{ theme: MobileTheme }>`
  margin-bottom: 48px;
`;

export const FeaturesTitle = styled.Text<{ theme: MobileTheme }>`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;
`;

export const FeatureCard = styled.TouchableOpacity<{ theme: MobileTheme; color?: string }>`
  background-color: ${props => props.theme.colors.white};
  border-radius: 12px;
  margin-bottom: 16px;
  border-left-width: 4px;
  border-left-color: ${props => props.color || props.theme.colors.primary};
`;

export const FeatureContent = styled.View<{ theme: MobileTheme }>`
  flex-direction: row;
  align-items: center;
  padding: 24px;
`;

export const FeatureIcon = styled.View<{ theme: MobileTheme; color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin-right: 24px;
  background-color: ${props => props.color || props.theme.colors.primary};
`;

export const FeatureText = styled.View<{ theme: MobileTheme }>`
  flex: 1;
`;

export const FeatureTitle = styled.Text<{ theme: MobileTheme }>`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

export const FeatureDescription = styled.Text<{ theme: MobileTheme }>`
  font-size: 14px;
  color: ${props => props.theme.colors.gray700};
`;

export const InfoContainer = styled.View<{ theme: MobileTheme }>`
  background-color: ${props => props.theme.colors.white};
  border-radius: 12px;
  padding: 24px;
`;

export const InfoTitle = styled.Text<{ theme: MobileTheme }>`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;
`;

export const InfoList = styled.View<{ theme: MobileTheme }>`
  gap: 8px;
`;

export const InfoItem = styled.View<{ theme: MobileTheme }>`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const InfoText = styled.Text<{ theme: MobileTheme }>`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

export const ChevronIcon = styled(Ionicons).attrs<{ theme: MobileTheme }>((props) => ({
  name: "chevron-forward",
  size: 20,
  color: props.theme.colors.gray700,
}))``;

export const CheckIcon = styled(Ionicons).attrs<{ theme: MobileTheme }>((props) => ({
  name: "checkmark-circle",
  size: 16,
  color: props.theme.colors.success,
}))``;
