import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { ImageWithLoading } from '../../components/ImageWithLoading';
import { ImageCache } from '../../services/ImageCache';

// Mock do ImageCache
jest.mock('../../services/ImageCache');
const MockedImageCache = ImageCache as jest.Mocked<typeof ImageCache>;

// Mock do react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

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

describe('ImageWithLoading', () => {
  const mockSource = { uri: 'file://mock/image.jpg' };
  const mockThumbnailUri = 'file://mock/thumbnail.jpg';

  beforeEach(() => {
    jest.clearAllMocks();
    
    MockedImageCache.getInstance.mockReturnValue({
      getThumbnailUri: jest.fn().mockResolvedValue(mockThumbnailUri),
    } as any);
  });

  it('should render with loading state initially', () => {
    const { getByText } = render(
      <ImageWithLoading source={mockSource} />
    );

    expect(getByText('Carregando...')).toBeTruthy();
  });

  it('should load image with thumbnail when useThumbnail is true', async () => {
    const { getByTestId } = render(
      <ImageWithLoading 
        source={mockSource} 
        useThumbnail={true}
        testID="image-with-loading"
      />
    );

    await waitFor(() => {
      expect(MockedImageCache.getInstance().getThumbnailUri).toHaveBeenCalledWith(mockSource.uri);
    });
  });

  it('should load original image when useThumbnail is false', async () => {
    const { getByTestId } = render(
      <ImageWithLoading 
        source={mockSource} 
        useThumbnail={false}
        testID="image-with-loading"
      />
    );

    await waitFor(() => {
      expect(MockedImageCache.getInstance().getThumbnailUri).not.toHaveBeenCalled();
    });
  });

  it('should handle thumbnail loading error gracefully', async () => {
    MockedImageCache.getInstance().getThumbnailUri.mockRejectedValue(
      new Error('Thumbnail error')
    );

    const { getByTestId } = render(
      <ImageWithLoading 
        source={mockSource} 
        useThumbnail={true}
        testID="image-with-loading"
      />
    );

    await waitFor(() => {
      // Should fallback to original image
      expect(getByTestId('image-with-loading')).toBeTruthy();
    });
  });

  it('should call onLoad callback when image loads', async () => {
    const onLoadMock = jest.fn();

    render(
      <ImageWithLoading 
        source={mockSource} 
        onLoad={onLoadMock}
      />
    );

    await waitFor(() => {
      expect(onLoadMock).toHaveBeenCalled();
    });
  });

  it('should call onError callback when image fails to load', async () => {
    const onErrorMock = jest.fn();
    MockedImageCache.getInstance().getThumbnailUri.mockRejectedValue(
      new Error('Load error')
    );

    render(
      <ImageWithLoading 
        source={mockSource} 
        onError={onErrorMock}
      />
    );

    await waitFor(() => {
      expect(onErrorMock).toHaveBeenCalled();
    });
  });

  it('should show loading progress', async () => {
    const { getByText } = render(
      <ImageWithLoading 
        source={mockSource} 
        showLoading={true}
      />
    );

    // Should show loading text
    expect(getByText('Carregando...')).toBeTruthy();
  });

  it('should hide loading when showLoading is false', () => {
    const { queryByText } = render(
      <ImageWithLoading 
        source={mockSource} 
        showLoading={false}
      />
    );

    expect(queryByText('Carregando...')).toBeNull();
  });

  it('should handle different contentFit values', () => {
    const { getByTestId } = render(
      <ImageWithLoading 
        source={mockSource} 
        contentFit="contain"
        testID="image-with-loading"
      />
    );

    expect(getByTestId('image-with-loading')).toBeTruthy();
  });

  it('should handle style prop', () => {
    const customStyle = { width: 100, height: 100 };
    
    const { getByTestId } = render(
      <ImageWithLoading 
        source={mockSource} 
        style={customStyle}
        testID="image-with-loading"
      />
    );

    expect(getByTestId('image-with-loading')).toBeTruthy();
  });

  it('should handle error state', async () => {
    MockedImageCache.getInstance().getThumbnailUri.mockRejectedValue(
      new Error('Network error')
    );

    const { getByText } = render(
      <ImageWithLoading 
        source={mockSource} 
        useThumbnail={true}
      />
    );

    await waitFor(() => {
      expect(getByText('Erro ao carregar')).toBeTruthy();
    });
  });

  it('should handle loading progress updates', async () => {
    const { getByText } = render(
      <ImageWithLoading 
        source={mockSource} 
        showLoading={true}
      />
    );

    // Should show progress text
    expect(getByText('Carregando...')).toBeTruthy();
  });

  it('should handle source changes', async () => {
    const newSource = { uri: 'file://mock/new-image.jpg' };
    
    const { rerender } = render(
      <ImageWithLoading source={mockSource} />
    );

    rerender(<ImageWithLoading source={newSource} />);

    await waitFor(() => {
      expect(MockedImageCache.getInstance().getThumbnailUri).toHaveBeenCalledWith(newSource.uri);
    });
  });

  it('should handle multiple rapid source changes', async () => {
    const sources = [
      { uri: 'file://mock/image1.jpg' },
      { uri: 'file://mock/image2.jpg' },
      { uri: 'file://mock/image3.jpg' },
    ];

    const { rerender } = render(
      <ImageWithLoading source={sources[0]} />
    );

    // Rapid source changes
    sources.forEach((source, index) => {
      rerender(<ImageWithLoading source={source} />);
    });

    await waitFor(() => {
      expect(MockedImageCache.getInstance().getThumbnailUri).toHaveBeenCalledTimes(sources.length);
    });
  });

  it('should handle empty source', () => {
    const { getByTestId } = render(
      <ImageWithLoading 
        source={{ uri: '' }} 
        testID="image-with-loading"
      />
    );

    expect(getByTestId('image-with-loading')).toBeTruthy();
  });

  it('should handle null source', () => {
    const { getByTestId } = render(
      <ImageWithLoading 
        source={null as any} 
        testID="image-with-loading"
      />
    );

    expect(getByTestId('image-with-loading')).toBeTruthy();
  });
});
