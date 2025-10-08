import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
  showThemeToggle?: boolean;
  variant?: 'default' | 'gradient' | 'minimal';
}

// Styled Components
const HeaderContainer = styled.View<{ variant: string }>`
  border-bottom-width: ${(props: any) => props.variant === 'minimal' ? '0.5px' : '0px'};
  border-bottom-color: ${(props: any) => props.theme.colors.gray200};

  padding-top: 0px;
  min-height: 100px;

  shadow-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#000000' : '#000'};
  shadow-offset: 0px 1px;
  shadow-opacity: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? 0.3 : 0.1};
  shadow-radius: 2px;
  elevation: 2;

  background-color: ${(props: any) => {
    switch (props.variant) {
      case 'gradient': return 'transparent';
      case 'minimal': return props.theme.colors.background;
      default: return props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.primary;
    }
  }};
`;

const Content = styled.View`
  flex-direction: row;
  align-items: center;

  padding-horizontal: 16px;
  padding-vertical: 20px;
  padding-top: 50px;
  min-height: 100px;
`;

const LeftSection = styled.View`
  width: 40px;

  align-items: flex-start;
`;

const CenterSection = styled.View`
  flex: 1;

  align-items: center;
  padding-horizontal: 12px;
`;

const RightSection = styled.View`
  width: 40px;

  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
`;

const BackButton = styled.TouchableOpacity<{ variant: string }>`
  width: 32px;
  height: 32px;

  justify-content: center;
  align-items: center;

  border-radius: 16px;

  background-color: ${(props: any) => 
    props.variant === 'minimal' 
      ? props.theme.colors.gray100 
      : 'rgba(255, 255, 255, 0.15)'
  };
`;

const RightButton = styled.TouchableOpacity<{ variant: string }>`
  width: 32px;
  height: 32px;

  justify-content: center;
  align-items: center;

  border-radius: 16px;

  background-color: ${(props: any) => 
    props.variant === 'minimal' 
      ? props.theme.colors.gray100 
      : 'rgba(255, 255, 255, 0.15)'
  };
`;

const Title = styled.Text<{ variant: string }>`
  font-size: 18px;
  font-weight: 700;

  text-align: center;
  letter-spacing: 0.5px;

  color: ${(props: any) => 
    props.variant === 'minimal' 
      ? props.theme.colors.text 
      : props.theme.colors.white
  };
`;

const Subtitle = styled.Text<{ variant: string }>`
  font-size: 12px;
  font-weight: 500;

  text-align: center;
  margin-top: 4px;
  letter-spacing: 0.3px;

  opacity: ${(props: any) => props.variant === 'minimal' ? 1 : 0.85};

  color: ${(props: any) => 
    props.variant === 'minimal' 
      ? props.theme.colors.gray700 
      : props.theme.colors.white
  };
`;

export function ModernHeader({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightAction,
  showThemeToggle = false,
  variant = 'default'
}: ModernHeaderProps) {
  const { theme } = useTheme();
  
  const renderContent = () => (
    <Content>
      {/* Left Section */}
      <LeftSection>
        {showBackButton && (
          <BackButton variant={variant} onPress={onBackPress} activeOpacity={0.7}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={variant === 'minimal' ? theme.colors.text : theme.colors.white}
            />
          </BackButton>
        )}
      </LeftSection>

      {/* Center Section */}
      <CenterSection>
        <Title variant={variant}>{title}</Title>
        {subtitle && <Subtitle variant={variant}>{subtitle}</Subtitle>}
      </CenterSection>

      {/* Right Section */}
      <RightSection>
        {showThemeToggle && <ThemeToggle size={20} />}
        {rightAction && (
          <RightButton variant={variant} onPress={rightAction.onPress} activeOpacity={0.7}>
            <Ionicons
              name={rightAction.icon}
              size={20}
              color={variant === 'minimal' ? theme.colors.text : theme.colors.white}
            />
          </RightButton>
        )}
      </RightSection>
    </Content>
  );

  if (variant === 'gradient') {
    const gradientColors = theme.colors.background === '#1A1A1A' 
      ? ['#2A2A2A', '#1F1F1F'] as const
      : [theme.colors.primary, theme.colors.secondary] as const;
    
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ 
          shadowColor: theme.colors.background === '#1A1A1A' ? '#000000' : '#000', 
          shadowOffset: { width: 0, height: 1 }, 
          shadowOpacity: theme.colors.background === '#1A1A1A' ? 0.3 : 0.1, 
          shadowRadius: 2, 
          elevation: 2 
        }}
      >
        {renderContent()}
      </LinearGradient>
    );
  }

  return (
    <HeaderContainer variant={variant}>
      {renderContent()}
    </HeaderContainer>
  );
}