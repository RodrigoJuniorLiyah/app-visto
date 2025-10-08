import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';

export interface CacheConfig {
  thumbnailSize: { width: number; height: number };
  compressionQuality: number;
  maxCacheSize: number; // MB
}

export interface CachedImage {
  originalUri: string;
  thumbnailUri: string;
  compressedUri: string;
  size: number;
  cachedAt: number;
}

export class ImageCache {
  private static instance: ImageCache;
  private cache = new Map<string, CachedImage>();
  private config: CacheConfig = {
    thumbnailSize: { width: 300, height: 300 },
    compressionQuality: 0.8,
    maxCacheSize: 100, // 100MB
  };

  private constructor() {
    this.loadCacheFromDisk();
  }

  public static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  private async loadCacheFromDisk(): Promise<void> {
    try {
      const cacheFile = `${FileSystem.documentDirectory}image_cache.json`;
      const fileInfo = await FileSystem.getInfoAsync(cacheFile);
      
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(cacheFile);
        const cacheData = JSON.parse(content);
        
        for (const [key, cachedImage] of Object.entries(cacheData)) {
          const thumbnailExists = await FileSystem.getInfoAsync((cachedImage as CachedImage).thumbnailUri);
          const compressedExists = await FileSystem.getInfoAsync((cachedImage as CachedImage).compressedUri);
          
          if (thumbnailExists.exists && compressedExists.exists) {
            this.cache.set(key, cachedImage as CachedImage);
          }
        }
      }
    } catch (error) {
      console.error('Error loading cache from disk:', error);
    }
  }

  private async saveCacheToDisk(): Promise<void> {
    try {
      const cacheFile = `${FileSystem.documentDirectory}image_cache.json`;
      const cacheData = Object.fromEntries(this.cache);
      await FileSystem.writeAsStringAsync(cacheFile, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving cache to disk:', error);
    }
  }

  private async getCacheSize(): Promise<number> {
    let totalSize = 0;
    
    for (const cachedImage of this.cache.values()) {
      try {
        const thumbnailInfo = await FileSystem.getInfoAsync(cachedImage.thumbnailUri);
        const compressedInfo = await FileSystem.getInfoAsync(cachedImage.compressedUri);
        
        if (thumbnailInfo.exists) totalSize += thumbnailInfo.size || 0;
        if (compressedInfo.exists) totalSize += compressedInfo.size || 0;
      } catch (error) {
        console.error('Error getting file size:', error);
      }
    }
    
    return totalSize / (1024 * 1024); // Convert to MB
  }

  private async cleanupCache(): Promise<void> {
    const currentSize = await this.getCacheSize();
    
    if (currentSize > this.config.maxCacheSize) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.cachedAt - b.cachedAt);
      
      const itemsToRemove = Math.ceil(sortedEntries.length * 0.2);
      
      for (let i = 0; i < itemsToRemove; i++) {
        const [key, cachedImage] = sortedEntries[i];
        
        try {
          await FileSystem.deleteAsync(cachedImage.thumbnailUri);
          await FileSystem.deleteAsync(cachedImage.compressedUri);
        } catch (error) {
          console.error('Error deleting cached file:', error);
        }
        
        this.cache.delete(key);
      }
      
      await this.saveCacheToDisk();
    }
  }

  public async getCachedImage(originalUri: string): Promise<CachedImage | null> {
    const cacheKey = this.getCacheKey(originalUri);
    
    if (this.cache.has(cacheKey)) {
      const cachedImage = this.cache.get(cacheKey)!;
      
      const thumbnailExists = await FileSystem.getInfoAsync(cachedImage.thumbnailUri);
      const compressedExists = await FileSystem.getInfoAsync(cachedImage.compressedUri);
      
      if (thumbnailExists.exists && compressedExists.exists) {
        return cachedImage;
      } else {
        this.cache.delete(cacheKey);
      }
    }
    
    return null;
  }

  public async cacheImage(originalUri: string): Promise<CachedImage> {
    console.log('🔄 Iniciando cache de imagem:', originalUri);
    const cacheKey = this.getCacheKey(originalUri);
    console.log('🔑 Cache key:', cacheKey);
    
    const existing = await this.getCachedImage(originalUri);
    if (existing) {
      console.log('✅ Imagem já está em cache:', existing.thumbnailUri);
      return existing;
    }
    
    try {
      const thumbnailsDir = `${FileSystem.documentDirectory}thumbnails/`;
      const compressedDir = `${FileSystem.documentDirectory}compressed/`;
      
      await FileSystem.makeDirectoryAsync(thumbnailsDir, { intermediates: true });
      await FileSystem.makeDirectoryAsync(compressedDir, { intermediates: true });
      
      const thumbnailResult = await ImageManipulator.manipulateAsync(
        originalUri,
        [
          {
            resize: {
              width: this.config.thumbnailSize.width,
              height: this.config.thumbnailSize.height,
            },
          },
        ],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      
      const compressedResult = await ImageManipulator.manipulateAsync(
        originalUri,
        [
          {
            resize: {
              width: 1200, // Máximo 1200px de largura
              height: 1200, // Máximo 1200px de altura
            },
          },
        ],
        {
          compress: this.config.compressionQuality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      
      const timestamp = Date.now();
      const thumbnailUri = `${thumbnailsDir}thumb_${timestamp}.jpg`;
      const compressedUri = `${compressedDir}comp_${timestamp}.jpg`;
      
      await FileSystem.moveAsync({
        from: thumbnailResult.uri,
        to: thumbnailUri,
      });
      
      await FileSystem.moveAsync({
        from: compressedResult.uri,
        to: compressedUri,
      });
      
      const cachedImage: CachedImage = {
        originalUri,
        thumbnailUri,
        compressedUri,
        size: compressedResult.width * compressedResult.height,
        cachedAt: Date.now(),
      };
      
      this.cache.set(cacheKey, cachedImage);
      
      await this.saveCacheToDisk();
      
      await this.cleanupCache();
      
      return cachedImage;
    } catch (error) {
      console.error('Error caching image:', error);
      throw error;
    }
  }

  public async getThumbnailUri(originalUri: string): Promise<string> {
    console.log('🔍 Verificando cache para:', originalUri);
    const cached = await this.getCachedImage(originalUri);
    if (cached) {
      console.log('✅ Cache encontrado, usando thumbnail:', cached.thumbnailUri);
      return cached.thumbnailUri;
    }
    
    console.log('⏳ Cache não encontrado, criando novo...');
    const newCached = await this.cacheImage(originalUri);
    console.log('✅ Novo cache criado:', newCached.thumbnailUri);
    return newCached.thumbnailUri;
  }

  public async getCompressedUri(originalUri: string): Promise<string> {
    const cached = await this.getCachedImage(originalUri);
    if (cached) {
      return cached.compressedUri;
    }
    
    const newCached = await this.cacheImage(originalUri);
    return newCached.compressedUri;
  }

  public async clearCache(): Promise<void> {
    try {
      for (const cachedImage of this.cache.values()) {
        try {
          await FileSystem.deleteAsync(cachedImage.thumbnailUri);
          await FileSystem.deleteAsync(cachedImage.compressedUri);
        } catch (error) {
          console.error('Error deleting cached file:', error);
        }
      }
      
      this.cache.clear();
      
      const cacheFile = `${FileSystem.documentDirectory}image_cache.json`;
      const fileInfo = await FileSystem.getInfoAsync(cacheFile);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(cacheFile);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  public getCacheStats(): { size: number; count: number } {
    return {
      size: this.cache.size,
      count: this.cache.size,
    };
  }

  private getCacheKey(uri: string): string {
    return uri.split('/').pop() || uri;
  }

  public setConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
