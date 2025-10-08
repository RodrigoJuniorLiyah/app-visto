// Teste de validação de tipos PhotoMetadata
import { PhotoComparison, PhotoFilter, PhotoMetadata, ShareData } from '../../types/photo';

describe('PhotoMetadata Validation', () => {
  describe('Required Fields', () => {
    it('should validate required photo fields', () => {
      const validPhoto: PhotoMetadata = {
        id: 'photo_1234567890',
        uri: 'file:///path/to/photo.jpg',
        timestamp: Date.now(),
        date: '2024-01-15',
        time: '14:30:25',
        size: 1024000,
        width: 1920,
        height: 1080,
      };

      expect(validPhoto.id).toBeDefined();
      expect(validPhoto.uri).toBeDefined();
      expect(validPhoto.timestamp).toBeDefined();
      expect(validPhoto.date).toBeDefined();
      expect(validPhoto.time).toBeDefined();
      expect(validPhoto.size).toBeDefined();
      expect(validPhoto.width).toBeDefined();
      expect(validPhoto.height).toBeDefined();
    });

    it('should handle optional title field', () => {
      const photoWithTitle: PhotoMetadata = {
        id: 'photo_1234567890',
        uri: 'file:///path/to/photo.jpg',
        title: 'Beautiful sunset',
        timestamp: Date.now(),
        date: '2024-01-15',
        time: '14:30:25',
        size: 1024000,
        width: 1920,
        height: 1080,
      };

      const photoWithoutTitle: PhotoMetadata = {
        id: 'photo_1234567890',
        uri: 'file:///path/to/photo.jpg',
        timestamp: Date.now(),
        date: '2024-01-15',
        time: '14:30:25',
        size: 1024000,
        width: 1920,
        height: 1080,
      };

      expect(photoWithTitle.title).toBe('Beautiful sunset');
      expect(photoWithoutTitle.title).toBeUndefined();
    });

    it('should handle optional location data', () => {
      const photoWithLocation: PhotoMetadata = {
        id: 'photo_1234567890',
        uri: 'file:///path/to/photo.jpg',
        timestamp: Date.now(),
        date: '2024-01-15',
        time: '14:30:25',
        location: {
          latitude: -23.5505,
          longitude: -46.6333,
          address: 'São Paulo, SP, Brazil',
        },
        size: 1024000,
        width: 1920,
        height: 1080,
      };

      const photoWithoutLocation: PhotoMetadata = {
        id: 'photo_1234567890',
        uri: 'file:///path/to/photo.jpg',
        timestamp: Date.now(),
        date: '2024-01-15',
        time: '14:30:25',
        size: 1024000,
        width: 1920,
        height: 1080,
      };

      expect(photoWithLocation.location).toBeDefined();
      expect(photoWithLocation.location?.latitude).toBe(-23.5505);
      expect(photoWithLocation.location?.longitude).toBe(-46.6333);
      expect(photoWithLocation.location?.address).toBe('São Paulo, SP, Brazil');
      expect(photoWithoutLocation.location).toBeUndefined();
    });
  });

  describe('Data Types Validation', () => {
    it('should validate numeric fields', () => {
      const photo: PhotoMetadata = {
        id: 'photo_1234567890',
        uri: 'file:///path/to/photo.jpg',
        timestamp: 1705320625000,
        date: '2024-01-15',
        time: '14:30:25',
        size: 2048000,
        width: 1920,
        height: 1080,
      };

      expect(typeof photo.timestamp).toBe('number');
      expect(typeof photo.size).toBe('number');
      expect(typeof photo.width).toBe('number');
      expect(typeof photo.height).toBe('number');
      expect(photo.timestamp).toBeGreaterThan(0);
      expect(photo.size).toBeGreaterThan(0);
      expect(photo.width).toBeGreaterThan(0);
      expect(photo.height).toBeGreaterThan(0);
    });

    it('should validate string fields', () => {
      const photo: PhotoMetadata = {
        id: 'photo_1234567890',
        uri: 'file:///path/to/photo.jpg',
        timestamp: Date.now(),
        date: '2024-01-15',
        time: '14:30:25',
        size: 1024000,
        width: 1920,
        height: 1080,
      };

      expect(typeof photo.id).toBe('string');
      expect(typeof photo.uri).toBe('string');
      expect(typeof photo.date).toBe('string');
      expect(typeof photo.time).toBe('string');
      expect(photo.id.length).toBeGreaterThan(0);
      expect(photo.uri.length).toBeGreaterThan(0);
    });
  });

  describe('PhotoFilter Validation', () => {
    it('should handle search text filter', () => {
      const filter: PhotoFilter = {
        searchText: 'sunset',
      };

      expect(filter.searchText).toBe('sunset');
      expect(filter.dateFrom).toBeUndefined();
      expect(filter.dateTo).toBeUndefined();
      expect(filter.location).toBeUndefined();
    });

    it('should handle date range filter', () => {
      const dateFrom = new Date('2024-01-01');
      const dateTo = new Date('2024-01-31');
      
      const filter: PhotoFilter = {
        dateFrom,
        dateTo,
      };

      expect(filter.dateFrom).toEqual(dateFrom);
      expect(filter.dateTo).toEqual(dateTo);
      expect(filter.searchText).toBeUndefined();
      expect(filter.location).toBeUndefined();
    });

    it('should handle location filter', () => {
      const filter: PhotoFilter = {
        location: {
          latitude: -23.5505,
          longitude: -46.6333,
          radius: 10, // 10km radius
        },
      };

      expect(filter.location?.latitude).toBe(-23.5505);
      expect(filter.location?.longitude).toBe(-46.6333);
      expect(filter.location?.radius).toBe(10);
      expect(filter.searchText).toBeUndefined();
      expect(filter.dateFrom).toBeUndefined();
      expect(filter.dateTo).toBeUndefined();
    });

    it('should handle combined filters', () => {
      const dateFrom = new Date('2024-01-01');
      const dateTo = new Date('2024-01-31');
      
      const filter: PhotoFilter = {
        searchText: 'beach',
        dateFrom,
        dateTo,
        location: {
          latitude: -23.5505,
          longitude: -46.6333,
          radius: 5,
        },
      };

      expect(filter.searchText).toBe('beach');
      expect(filter.dateFrom).toEqual(dateFrom);
      expect(filter.dateTo).toEqual(dateTo);
      expect(filter.location?.latitude).toBe(-23.5505);
      expect(filter.location?.longitude).toBe(-46.6333);
      expect(filter.location?.radius).toBe(5);
    });
  });

  describe('PhotoComparison Validation', () => {
    it('should validate photo comparison structure', () => {
      const photo1: PhotoMetadata = {
        id: 'photo_1',
        uri: 'file:///path/to/photo1.jpg',
        timestamp: Date.now(),
        date: '2024-01-15',
        time: '14:30:25',
        size: 1024000,
        width: 1920,
        height: 1080,
      };

      const photo2: PhotoMetadata = {
        id: 'photo_2',
        uri: 'file:///path/to/photo2.jpg',
        timestamp: Date.now() + 3600000, // 1 hour later
        date: '2024-01-15',
        time: '15:30:25',
        size: 2048000,
        width: 1920,
        height: 1080,
      };

      const comparison: PhotoComparison = {
        photo1,
        photo2,
      };

      expect(comparison.photo1).toEqual(photo1);
      expect(comparison.photo2).toEqual(photo2);
      expect(comparison.photo1.id).toBe('photo_1');
      expect(comparison.photo2.id).toBe('photo_2');
    });
  });

  describe('ShareData Validation', () => {
    it('should validate share data structure', () => {
      const photo: PhotoMetadata = {
        id: 'photo_1234567890',
        uri: 'file:///path/to/photo.jpg',
        timestamp: Date.now(),
        date: '2024-01-15',
        time: '14:30:25',
        size: 1024000,
        width: 1920,
        height: 1080,
      };

      const shareData: ShareData = {
        photo,
        includeMetadata: true,
        format: 'both',
      };

      expect(shareData.photo).toEqual(photo);
      expect(shareData.includeMetadata).toBe(true);
      expect(shareData.format).toBe('both');
    });

    it('should handle different share formats', () => {
      const photo: PhotoMetadata = {
        id: 'photo_1234567890',
        uri: 'file:///path/to/photo.jpg',
        timestamp: Date.now(),
        date: '2024-01-15',
        time: '14:30:25',
        size: 1024000,
        width: 1920,
        height: 1080,
      };

      const imageOnly: ShareData = {
        photo,
        includeMetadata: false,
        format: 'image',
      };

      const textOnly: ShareData = {
        photo,
        includeMetadata: true,
        format: 'text',
      };

      expect(imageOnly.format).toBe('image');
      expect(imageOnly.includeMetadata).toBe(false);
      expect(textOnly.format).toBe('text');
      expect(textOnly.includeMetadata).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings in optional fields', () => {
      const photo: PhotoMetadata = {
        id: 'photo_1234567890',
        uri: 'file:///path/to/photo.jpg',
        title: '', // Empty string
        timestamp: Date.now(),
        date: '2024-01-15',
        time: '14:30:25',
        size: 1024000,
        width: 1920,
        height: 1080,
      };

      expect(photo.title).toBe('');
      expect(photo.title?.length).toBe(0);
    });

    it('should handle zero values in numeric fields', () => {
      const photo: PhotoMetadata = {
        id: 'photo_1234567890',
        uri: 'file:///path/to/photo.jpg',
        timestamp: 0,
        date: '2024-01-15',
        time: '14:30:25',
        size: 0,
        width: 0,
        height: 0,
      };

      expect(photo.timestamp).toBe(0);
      expect(photo.size).toBe(0);
      expect(photo.width).toBe(0);
      expect(photo.height).toBe(0);
    });

    it('should handle very large numeric values', () => {
      const photo: PhotoMetadata = {
        id: 'photo_1234567890',
        uri: 'file:///path/to/photo.jpg',
        timestamp: Number.MAX_SAFE_INTEGER,
        date: '2024-01-15',
        time: '14:30:25',
        size: Number.MAX_SAFE_INTEGER,
        width: Number.MAX_SAFE_INTEGER,
        height: Number.MAX_SAFE_INTEGER,
      };

      expect(photo.timestamp).toBe(Number.MAX_SAFE_INTEGER);
      expect(photo.size).toBe(Number.MAX_SAFE_INTEGER);
      expect(photo.width).toBe(Number.MAX_SAFE_INTEGER);
      expect(photo.height).toBe(Number.MAX_SAFE_INTEGER);
    });
  });
});
