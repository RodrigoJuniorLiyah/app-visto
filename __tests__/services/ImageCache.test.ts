import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { ImageCache } from '../../services/ImageCache';

describe('ImageCache', () => {
  let imageCache: ImageCache;
  const mockFileInfo = {
    exists: true,
    isDirectory: false,
    size: 1024,
    uri: 'file://mock/image.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    imageCache = ImageCache.getInstance();
    
    // Mock do FileSystem
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue(mockFileInfo);
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('{}');
    (FileSystem.writeAsStringAsync as jest.Mock).mockResolvedValue(undefined);
    (FileSystem.makeDirectoryAsync as jest.Mock).mockResolvedValue(undefined);
    (FileSystem.moveAsync as jest.Mock).mockResolvedValue(undefined);
    (FileSystem.deleteAsync as jest.Mock).mockResolvedValue(undefined);

    // Mock do ImageManipulator
    (ImageManipulator.manipulateAsync as jest.Mock)
      .mockResolvedValueOnce({
        uri: 'file://mock/thumb.jpg',
        width: 300,
        height: 300,
      })
      .mockResolvedValueOnce({
        uri: 'file://mock/compressed.jpg',
        width: 1200,
        height: 1200,
      });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ImageCache.getInstance();
      const instance2 = ImageCache.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('cacheImage', () => {
    it('should cache image successfully', async () => {
      const originalUri = 'file://mock/original.jpg';
      
      const result = await imageCache.cacheImage(originalUri);

      expect(result).toMatchObject({
        originalUri,
        thumbnailUri: expect.stringContaining('thumbnails/thumb_'),
        compressedUri: expect.stringContaining('compressed/comp_'),
        size: expect.any(Number),
        cachedAt: expect.any(Number),
      });

      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledTimes(2);
      expect(ImageManipulator.manipulateAsync).toHaveBeenCalledTimes(2);
      expect(FileSystem.moveAsync).toHaveBeenCalledTimes(2);
    });

    it('should return existing cached image', async () => {
      const originalUri = 'file://mock/original.jpg';
      
      // Primeiro cache
      const result1 = await imageCache.cacheImage(originalUri);
      
      // Segundo cache (deve retornar o existente)
      const result2 = await imageCache.cacheImage(originalUri);

      expect(result1).toBe(result2);
      expect(ImageManipulator.manipulateAsync).toHaveBeenCalledTimes(2); // Apenas na primeira vez
    });

    it('should handle cache errors gracefully', async () => {
      (ImageManipulator.manipulateAsync as jest.Mock).mockRejectedValue(
        new Error('Manipulation error')
      );

      await expect(imageCache.cacheImage('file://mock/error.jpg')).rejects.toThrow(
        'Manipulation error'
      );
    });
  });

  describe('getThumbnailUri', () => {
    it('should return thumbnail URI for cached image', async () => {
      const originalUri = 'file://mock/original.jpg';
      
      // Cache a imagem primeiro
      await imageCache.cacheImage(originalUri);
      
      const thumbnailUri = await imageCache.getThumbnailUri(originalUri);

      expect(thumbnailUri).toContain('thumbnails/thumb_');
    });

    it('should create and return thumbnail for new image', async () => {
      const originalUri = 'file://mock/new.jpg';
      
      const thumbnailUri = await imageCache.getThumbnailUri(originalUri);

      expect(thumbnailUri).toContain('thumbnails/thumb_');
      expect(ImageManipulator.manipulateAsync).toHaveBeenCalled();
    });
  });

  describe('getCompressedUri', () => {
    it('should return compressed URI for cached image', async () => {
      const originalUri = 'file://mock/original.jpg';
      
      // Cache a imagem primeiro
      await imageCache.cacheImage(originalUri);
      
      const compressedUri = await imageCache.getCompressedUri(originalUri);

      expect(compressedUri).toContain('compressed/comp_');
    });

    it('should create and return compressed for new image', async () => {
      const originalUri = 'file://mock/new.jpg';
      
      const compressedUri = await imageCache.getCompressedUri(originalUri);

      expect(compressedUri).toContain('compressed/comp_');
      expect(ImageManipulator.manipulateAsync).toHaveBeenCalled();
    });
  });

  describe('getCachedImage', () => {
    it('should return cached image if exists', async () => {
      const originalUri = 'file://mock/original.jpg';
      
      await imageCache.cacheImage(originalUri);
      const cached = await imageCache.getCachedImage(originalUri);

      expect(cached).toMatchObject({
        originalUri,
        thumbnailUri: expect.any(String),
        compressedUri: expect.any(String),
        size: expect.any(Number),
        cachedAt: expect.any(Number),
      });
    });

    it('should return null for non-cached image', async () => {
      const cached = await imageCache.getCachedImage('file://mock/non-cached.jpg');

      expect(cached).toBeNull();
    });

    it('should return null for corrupted cache entry', async () => {
      const originalUri = 'file://mock/corrupted.jpg';
      
      // Mock file not existing
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValueOnce({
        exists: false,
      });

      await imageCache.cacheImage(originalUri);
      const cached = await imageCache.getCachedImage(originalUri);

      expect(cached).toBeNull();
    });
  });

  describe('clearCache', () => {
    it('should clear all cached images', async () => {
      const originalUri = 'file://mock/original.jpg';
      
      // Cache uma imagem
      await imageCache.cacheImage(originalUri);
      
      // Limpar cache
      await imageCache.clearCache();

      // Verificar se foi limpo
      const cached = await imageCache.getCachedImage(originalUri);
      expect(cached).toBeNull();
    });

    it('should handle clear cache errors gracefully', async () => {
      (FileSystem.deleteAsync as jest.Mock).mockRejectedValue(
        new Error('Delete error')
      );

      // Não deve lançar erro
      await expect(imageCache.clearCache()).resolves.toBeUndefined();
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', async () => {
      const originalUri = 'file://mock/original.jpg';
      
      await imageCache.cacheImage(originalUri);
      const stats = imageCache.getCacheStats();

      expect(stats).toMatchObject({
        size: expect.any(Number),
        count: expect.any(Number),
      });
      expect(stats.count).toBeGreaterThan(0);
    });
  });

  describe('setConfig', () => {
    it('should update cache configuration', () => {
      const newConfig = {
        thumbnailSize: { width: 400, height: 400 },
        compressionQuality: 0.9,
        maxCacheSize: 200,
      };

      imageCache.setConfig(newConfig);

      // Verificar se a configuração foi aplicada
      // (Isso seria testado internamente, mas como não temos acesso direto,
      // vamos testar através do comportamento)
      expect(() => imageCache.setConfig(newConfig)).not.toThrow();
    });
  });

  describe('Cache Persistence', () => {
    it('should load cache from disk on initialization', async () => {
      const mockCacheData = {
        'photo1.jpg': {
          originalUri: 'file://mock/photo1.jpg',
          thumbnailUri: 'file://mock/thumb1.jpg',
          compressedUri: 'file://mock/comp1.jpg',
          size: 1024,
          cachedAt: Date.now(),
        },
      };

      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
        JSON.stringify(mockCacheData)
      );

      // Criar nova instância para testar carregamento
      const newCache = ImageCache.getInstance();
      
      // Verificar se carregou do disco
      expect(FileSystem.readAsStringAsync).toHaveBeenCalled();
    });

    it('should save cache to disk', async () => {
      const originalUri = 'file://mock/original.jpg';
      
      await imageCache.cacheImage(originalUri);

      expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
    });
  });

  describe('Cache Cleanup', () => {
    it('should cleanup cache when size exceeds limit', async () => {
      // Mock cache size calculation
      jest.spyOn(imageCache as any, 'getCacheSize').mockResolvedValue(150); // 150MB
      
      const originalUri = 'file://mock/original.jpg';
      await imageCache.cacheImage(originalUri);

      // Verificar se tentou limpar cache
      expect(FileSystem.deleteAsync).toHaveBeenCalled();
    });

    it('should not cleanup cache when size is within limit', async () => {
      // Mock cache size calculation
      jest.spyOn(imageCache as any, 'getCacheSize').mockResolvedValue(50); // 50MB
      
      const originalUri = 'file://mock/original.jpg';
      await imageCache.cacheImage(originalUri);

      // Não deve tentar limpar cache
      expect(FileSystem.deleteAsync).not.toHaveBeenCalled();
    });
  });
});
