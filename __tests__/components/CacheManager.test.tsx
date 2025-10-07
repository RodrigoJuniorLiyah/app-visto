import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { CacheManager } from '../../components/CacheManager';
import { ImageCache } from '../../services/ImageCache';

// Mock do Alert
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    alert: jest.fn(),
  },
}));

// Mock do ImageCache
jest.mock('../../services/ImageCache');
const MockedImageCache = ImageCache as jest.Mocked<typeof ImageCache>;

// Mock do styled-components
jest.mock('styled-components/native', () => {
  const React = require('react');
  const styled = (Component) => (strings, ...values) => {
    return React.forwardRef((props, ref) => {
      return React.createElement(Component, { ...props, ref });
    });
  };
  return styled;
});

// Mock do ThemeContext
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        text: '#000000',
        gray500: '#666666',
        primary: '#FF6B6B',
        danger: '#E74C3C',
        white: '#FFFFFF',
      },
    },
  }),
}));

describe('CacheManager', () => {
  const mockImageCache = {
    getCacheStats: jest.fn(),
    clearCache: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    MockedImageCache.getInstance.mockReturnValue(mockImageCache as any);
    mockImageCache.getCacheStats.mockReturnValue({ size: 2, count: 5 });
  });

  it('should render cache information', () => {
    const { getByText } = render(<CacheManager />);

    expect(getByText('Cache de Imagens')).toBeTruthy();
    expect(getByText('5 imagens • 2 MB')).toBeTruthy();
  });

  it('should display cache statistics correctly', () => {
    mockImageCache.getCacheStats.mockReturnValue({ size: 10.5, count: 15 });

    const { getByText } = render(<CacheManager />);

    expect(getByText('15 imagens • 10.5 MB')).toBeTruthy();
  });

  it('should handle refresh button press', async () => {
    const { getByTestId } = render(<CacheManager />);

    const refreshButton = getByTestId('refresh-button');
    fireEvent.press(refreshButton);

    await waitFor(() => {
      expect(mockImageCache.getCacheStats).toHaveBeenCalledTimes(2); // Initial + refresh
    });
  });

  it('should show clear cache confirmation', () => {
    const { getByTestId } = render(<CacheManager />);

    const clearButton = getByTestId('clear-button');
    fireEvent.press(clearButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Limpar Cache',
      'Tem certeza que deseja limpar todo o cache de imagens? Isso pode tornar o carregamento mais lento temporariamente.',
      expect.any(Array)
    );
  });

  it('should clear cache when confirmed', async () => {
    const onCacheCleared = jest.fn();
    mockImageCache.clearCache.mockResolvedValue(undefined);

    // Mock Alert.alert to simulate user confirming
    (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
      const confirmButton = buttons.find(button => button.text === 'Limpar');
      if (confirmButton) {
        confirmButton.onPress();
      }
    });

    const { getByTestId } = render(
      <CacheManager onCacheCleared={onCacheCleared} />
    );

    const clearButton = getByTestId('clear-button');
    fireEvent.press(clearButton);

    await waitFor(() => {
      expect(mockImageCache.clearCache).toHaveBeenCalled();
      expect(onCacheCleared).toHaveBeenCalled();
    });
  });

  it('should not clear cache when cancelled', async () => {
    // Mock Alert.alert to simulate user cancelling
    (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
      const cancelButton = buttons.find(button => button.text === 'Cancelar');
      if (cancelButton) {
        cancelButton.onPress();
      }
    });

    const { getByTestId } = render(<CacheManager />);

    const clearButton = getByTestId('clear-button');
    fireEvent.press(clearButton);

    await waitFor(() => {
      expect(mockImageCache.clearCache).not.toHaveBeenCalled();
    });
  });

  it('should handle clear cache error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockImageCache.clearCache.mockRejectedValue(new Error('Clear error'));

    // Mock Alert.alert to simulate user confirming
    (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
      const confirmButton = buttons.find(button => button.text === 'Limpar');
      if (confirmButton) {
        confirmButton.onPress();
      }
    });

    const { getByTestId } = render(<CacheManager />);

    const clearButton = getByTestId('clear-button');
    fireEvent.press(clearButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Falha ao limpar cache');
    });

    consoleErrorSpy.mockRestore();
  });

  it('should format cache size correctly for small values', () => {
    mockImageCache.getCacheStats.mockReturnValue({ size: 0.5, count: 3 });

    const { getByText } = render(<CacheManager />);

    expect(getByText('3 imagens • 512 KB')).toBeTruthy();
  });

  it('should format cache size correctly for large values', () => {
    mockImageCache.getCacheStats.mockReturnValue({ size: 150.7, count: 100 });

    const { getByText } = render(<CacheManager />);

    expect(getByText('100 imagens • 150.7 MB')).toBeTruthy();
  });

  it('should handle zero cache size', () => {
    mockImageCache.getCacheStats.mockReturnValue({ size: 0, count: 0 });

    const { getByText } = render(<CacheManager />);

    expect(getByText('0 imagens • 0 KB')).toBeTruthy();
  });

  it('should handle cache stats error', () => {
    mockImageCache.getCacheStats.mockImplementation(() => {
      throw new Error('Stats error');
    });

    const { getByText } = render(<CacheManager />);

    // Should still render with default values
    expect(getByText('Cache de Imagens')).toBeTruthy();
  });

  it('should disable buttons during loading', async () => {
    mockImageCache.clearCache.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    // Mock Alert.alert to simulate user confirming
    (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
      const confirmButton = buttons.find(button => button.text === 'Limpar');
      if (confirmButton) {
        confirmButton.onPress();
      }
    });

    const { getByTestId } = render(<CacheManager />);

    const clearButton = getByTestId('clear-button');
    fireEvent.press(clearButton);

    // Button should be disabled during loading
    expect(clearButton.props.disabled).toBe(true);

    await waitFor(() => {
      expect(mockImageCache.clearCache).toHaveBeenCalled();
    });
  });

  it('should call onCacheCleared callback', async () => {
    const onCacheCleared = jest.fn();
    mockImageCache.clearCache.mockResolvedValue(undefined);

    // Mock Alert.alert to simulate user confirming
    (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
      const confirmButton = buttons.find(button => button.text === 'Limpar');
      if (confirmButton) {
        confirmButton.onPress();
      }
    });

    const { getByTestId } = render(
      <CacheManager onCacheCleared={onCacheCleared} />
    );

    const clearButton = getByTestId('clear-button');
    fireEvent.press(clearButton);

    await waitFor(() => {
      expect(onCacheCleared).toHaveBeenCalled();
    });
  });

  it('should handle missing onCacheCleared callback', async () => {
    mockImageCache.clearCache.mockResolvedValue(undefined);

    // Mock Alert.alert to simulate user confirming
    (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
      const confirmButton = buttons.find(button => button.text === 'Limpar');
      if (confirmButton) {
        confirmButton.onPress();
      }
    });

    const { getByTestId } = render(<CacheManager />);

    const clearButton = getByTestId('clear-button');
    
    // Should not throw error when onCacheCleared is not provided
    expect(() => fireEvent.press(clearButton)).not.toThrow();
  });
});
