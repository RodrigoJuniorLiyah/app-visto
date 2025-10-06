import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as AppThemeProvider, useTheme } from '../contexts/ThemeContext';

interface ThemeProviderProps {
  children: React.ReactNode;
}

function StyledThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <StyledThemeProvider theme={theme}>
      {children}
    </StyledThemeProvider>
  );
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <AppThemeProvider>
      <StyledThemeWrapper>
        {children}
      </StyledThemeWrapper>
    </AppThemeProvider>
  );
}
