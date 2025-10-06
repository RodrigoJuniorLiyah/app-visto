import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../contexts/ThemeContext';

const ToggleButton = styled.TouchableOpacity<{ isDark: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${props => props.isDark ? '#2C2C2C' : '#F0F0F0'};
  justify-content: center;
  align-items: center;
  shadow-color: ${props => props.isDark ? '#000' : '#666'};
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
  const { isDark, toggleTheme } = useTheme();

  return (
    <ToggleButton
      isDark={isDark}
      onPress={toggleTheme}
      style={style}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={size}
        color={isDark ? '#FFD700' : '#4A4A4A'}
      />
    </ToggleButton>
  );
}
