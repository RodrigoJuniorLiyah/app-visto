import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '../contexts/ThemeContext';

const ToggleButton = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${(props: any) => props.theme.colors.gray100};
  justify-content: center;
  align-items: center;
  shadow-color: ${(props: any) => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
`;

interface ThemeToggleProps {
  size?: number;
  style?: any;
}

export function ThemeToggle({ size = 24, style }: ThemeToggleProps) {
  const { colorScheme, toggleTheme, theme } = useTheme();

  return (
    <ToggleButton
      onPress={toggleTheme}
      style={style}
      activeOpacity={0.7}
    >
      <Ionicons
        name={colorScheme === 'dark' ? 'sunny' : 'moon'}
        size={size}
        color={theme.colors.text}
      />
    </ToggleButton>
  );
}
