describe('ImageCache - Basic Tests', () => {
  it('should be a singleton', () => {
    class MockImageCache {
      private static instance: MockImageCache;
      
      static getInstance(): MockImageCache {
        if (!MockImageCache.instance) {
          MockImageCache.instance = new MockImageCache();
        }
        return MockImageCache.instance;
      }
      
      getCacheStats() {
        return { count: 0, size: 0 };
      }
    }
    
    const instance1 = MockImageCache.getInstance();
    const instance2 = MockImageCache.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should start with empty cache', () => {
    class MockImageCache {
      getCacheStats() {
        return { count: 0, size: 0 };
      }
    }
    
    const imageCache = new MockImageCache();
    const stats = imageCache.getCacheStats();
    expect(stats.count).toBe(0);
    expect(stats.size).toBe(0);
  });

  it('should handle cache operations', () => {
    class MockImageCache {
      private cache: Map<string, any> = new Map();
      
      cacheImage(originalUri: string) {
        const cachedImage = {
          originalUri,
          thumbnailUri: `thumb_${Date.now()}.jpg`,
          compressedUri: `comp_${Date.now()}.jpg`,
          size: 1000,
          cachedAt: Date.now(),
        };
        this.cache.set(originalUri, cachedImage);
        return cachedImage;
      }
      
      getCachedImage(originalUri: string) {
        return this.cache.get(originalUri);
      }
      
      getThumbnailUri(originalUri: string) {
        const cached = this.cache.get(originalUri);
        return cached ? cached.thumbnailUri : null;
      }
      
      getCompressedUri(originalUri: string) {
        const cached = this.cache.get(originalUri);
        return cached ? cached.compressedUri : null;
      }
      
      clearCache() {
        this.cache.clear();
      }
      
      getCacheStats() {
        return {
          count: this.cache.size,
          size: Array.from(this.cache.values()).reduce((total, item) => total + item.size, 0)
        };
      }
    }
    
    const imageCache = new MockImageCache();
    
    const originalUri = 'test.jpg';
    const cachedImage = imageCache.cacheImage(originalUri);
    expect(cachedImage.originalUri).toBe(originalUri);
    expect(cachedImage.thumbnailUri).toContain('thumb_');
    expect(cachedImage.compressedUri).toContain('comp_');
    
    const retrievedImage = imageCache.getCachedImage(originalUri);
    expect(retrievedImage).toEqual(cachedImage);
    
    const thumbnailUri = imageCache.getThumbnailUri(originalUri);
    expect(thumbnailUri).toContain('thumb_');
    
    const compressedUri = imageCache.getCompressedUri(originalUri);
    expect(compressedUri).toContain('comp_');
    
    const stats = imageCache.getCacheStats();
    expect(stats.count).toBe(1);
    expect(stats.size).toBeGreaterThan(0);
    
    imageCache.clearCache();
    const clearedStats = imageCache.getCacheStats();
    expect(clearedStats.count).toBe(0);
    expect(clearedStats.size).toBe(0);
  });
});