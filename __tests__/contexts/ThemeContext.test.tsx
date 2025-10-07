import { act, render } from '@testing-library/react-native';
import React from 'react';
import { darkTheme, lightTheme } from '../../constants/theme';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';

// Mock do react-native
jest.mock('react-native', () => ({
  Appearance: {
    getColorScheme: jest.fn(),
    addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
  },
}));

// Componente de teste para usar o hook
const TestComponent = () => {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="theme-name">{isDark ? 'dark' : 'light'}</div>
      <div data-testid="primary-color">{theme.colors.primary}</div>
      <button data-testid="toggle-theme" onPress={toggleTheme}>
        Toggle
      </button>
      <button data-testid="set-dark" onPress={() => setTheme(true)}>
        Set Dark
      </button>
      <button data-testid="set-light" onPress={() => setTheme(false)}>
        Set Light
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ThemeProvider', () => {
    it('should provide light theme by default', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme-name')).toHaveTextContent('light');
      expect(getByTestId('primary-color')).toHaveTextContent(lightTheme.colors.primary);
    });

    it('should provide dark theme when system is dark', () => {
      const { Appearance } = require('react-native');
      Appearance.getColorScheme.mockReturnValue('dark');

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme-name')).toHaveTextContent('dark');
      expect(getByTestId('primary-color')).toHaveTextContent(darkTheme.colors.primary);
    });

    it('should toggle theme correctly', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Inicialmente light
      expect(getByTestId('theme-name')).toHaveTextContent('light');

      // Toggle para dark
      act(() => {
        getByTestId('toggle-theme').props.onPress();
      });

      expect(getByTestId('theme-name')).toHaveTextContent('dark');
      expect(getByTestId('primary-color')).toHaveTextContent(darkTheme.colors.primary);

      // Toggle de volta para light
      act(() => {
        getByTestId('toggle-theme').props.onPress();
      });

      expect(getByTestId('theme-name')).toHaveTextContent('light');
      expect(getByTestId('primary-color')).toHaveTextContent(lightTheme.colors.primary);
    });

    it('should set theme explicitly', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Set dark theme
      act(() => {
        getByTestId('set-dark').props.onPress();
      });

      expect(getByTestId('theme-name')).toHaveTextContent('dark');
      expect(getByTestId('primary-color')).toHaveTextContent(darkTheme.colors.primary);

      // Set light theme
      act(() => {
        getByTestId('set-light').props.onPress();
      });

      expect(getByTestId('theme-name')).toHaveTextContent('light');
      expect(getByTestId('primary-color')).toHaveTextContent(lightTheme.colors.primary);
    });

    it('should listen to system theme changes', () => {
      const { Appearance } = require('react-native');
      const mockListener = jest.fn();
      Appearance.addChangeListener.mockReturnValue({ remove: mockListener });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(Appearance.addChangeListener).toHaveBeenCalled();
    });

    it('should clean up listener on unmount', () => {
      const { Appearance } = require('react-native');
      const mockRemove = jest.fn();
      Appearance.addChangeListener.mockReturnValue({ remove: mockRemove });

      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      unmount();

      expect(mockRemove).toHaveBeenCalled();
    });
  });

  describe('useTheme hook', () => {
    it('should throw error when used outside provider', () => {
      // Suprimir console.error para este teste
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');

      console.error = originalError;
    });

    it('should provide correct theme object', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Verificar se as cores estão corretas
      expect(getByTestId('primary-color')).toHaveTextContent(lightTheme.colors.primary);
    });

    it('should maintain theme state across re-renders', () => {
      const { getByTestId, rerender } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Toggle theme
      act(() => {
        getByTestId('toggle-theme').props.onPress();
      });

      expect(getByTestId('theme-name')).toHaveTextContent('dark');

      // Re-render
      rerender(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Theme should still be dark
      expect(getByTestId('theme-name')).toHaveTextContent('dark');
    });
  });

  describe('Theme switching', () => {
    it('should switch between light and dark themes', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Light theme
      expect(getByTestId('primary-color')).toHaveTextContent(lightTheme.colors.primary);

      // Switch to dark
      act(() => {
        getByTestId('set-dark').props.onPress();
      });

      expect(getByTestId('primary-color')).toHaveTextContent(darkTheme.colors.primary);

      // Switch back to light
      act(() => {
        getByTestId('set-light').props.onPress();
      });

      expect(getByTestId('primary-color')).toHaveTextContent(lightTheme.colors.primary);
    });

    it('should handle multiple rapid theme changes', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Multiple rapid changes
      act(() => {
        getByTestId('set-dark').props.onPress();
        getByTestId('set-light').props.onPress();
        getByTestId('set-dark').props.onPress();
        getByTestId('toggle-theme').props.onPress();
      });

      // Should end up in light theme (dark -> light -> dark -> toggle dark to light)
      expect(getByTestId('theme-name')).toHaveTextContent('light');
    });
  });

  describe('Theme properties', () => {
    it('should have correct light theme properties', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Verificar se está usando light theme
      expect(getByTestId('primary-color')).toHaveTextContent(lightTheme.colors.primary);
    });

    it('should have correct dark theme properties', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Switch to dark theme
      act(() => {
        getByTestId('set-dark').props.onPress();
      });

      // Verificar se está usando dark theme
      expect(getByTestId('primary-color')).toHaveTextContent(darkTheme.colors.primary);
    });
  });
});
