import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import { ImageCache } from '../../services/ImageCache';
import { PhotoStorage } from '../../services/PhotoStorage';

// Mock do ImageCache
jest.mock('../../services/ImageCache');
const MockedImageCache = ImageCache as jest.Mocked<typeof ImageCache>;

describe('PhotoStorage', () => {
  let photoStorage: PhotoStorage;
  const mockFileInfo = {
    exists: true,
    isDirectory: false,
    size: 1024,
    uri: 'file://mock/photo.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    photoStorage = PhotoStorage.getInstance();
    
    // Mock do FileSystem
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue(mockFileInfo);
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('[]');
    (FileSystem.writeAsStringAsync as jest.Mock).mockResolvedValue(undefined);
    (FileSystem.makeDirectoryAsync as jest.Mock).mockResolvedValue(undefined);
    (FileSystem.copyAsync as jest.Mock).mockResolvedValue(undefined);
    (FileSystem.moveAsync as jest.Mock).mockResolvedValue(undefined);
    (FileSystem.deleteAsync as jest.Mock).mockResolvedValue(undefined);

    // Mock do ImageManipulator
    (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValue({
      uri: 'file://mock/compressed.jpg',
      width: 1920,
      height: 1080,
    });

    // Mock do Location
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
    });
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
      {
        street: 'Rua Teste',
        streetNumber: '123',
        city: 'São Paulo',
        region: 'SP',
      },
    ]);

    // Mock do ImageCache
    MockedImageCache.getInstance.mockReturnValue({
      cacheImage: jest.fn().mockResolvedValue({
        originalUri: 'file://mock/photo.jpg',
        thumbnailUri: 'file://mock/thumb.jpg',
        compressedUri: 'file://mock/compressed.jpg',
        size: 1024,
        cachedAt: Date.now(),
      }),
    } as any);
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = PhotoStorage.getInstance();
      const instance2 = PhotoStorage.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('savePhoto', () => {
    it('should save a photo successfully', async () => {
      const mockUri = 'file://mock/temp/photo.jpg';
      const mockTitle = 'Test Photo';

      const result = await photoStorage.savePhoto(mockUri, mockTitle);

      expect(result).toMatchObject({
        id: expect.stringMatching(/^photo_\d+$/),
        uri: expect.stringContaining('photos/photo_'),
        title: mockTitle,
        timestamp: expect.any(Number),
        date: expect.any(String),
        time: expect.any(String),
        location: {
          latitude: -23.5505,
          longitude: -46.6333,
          address: expect.any(String),
        },
        size: 1024,
        width: 1920,
        height: 1080,
      });

      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalled();
      expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(
        mockUri,
        [{ resize: { width: 1920, height: 1920 } }],
        { compress: 0.85, format: 'jpeg' }
      );
      expect(FileSystem.moveAsync).toHaveBeenCalled();
    });

    it('should handle location permission denied', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const result = await photoStorage.savePhoto('file://mock/photo.jpg');

      expect(result.location).toBeUndefined();
    });

    it('should handle location error', async () => {
      (Location.getCurrentPositionAsync as jest.Mock).mockRejectedValue(
        new Error('Location error')
      );

      const result = await photoStorage.savePhoto('file://mock/photo.jpg');

      expect(result.location).toBeUndefined();
    });
  });

  describe('getAllPhotos', () => {
    it('should return all photos', async () => {
      const mockPhotos = [
        {
          id: 'photo1',
          uri: 'file://mock/photo1.jpg',
          title: 'Photo 1',
          timestamp: Date.now(),
          date: '10/7/2025',
          time: '9:00:00 PM',
          size: 1024,
          width: 1920,
          height: 1080,
        },
        {
          id: 'photo2',
          uri: 'file://mock/photo2.jpg',
          title: 'Photo 2',
          timestamp: Date.now(),
          date: '10/7/2025',
          time: '9:30:00 PM',
          size: 2048,
          width: 1920,
          height: 1080,
        },
      ];

      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
        JSON.stringify(mockPhotos)
      );

      await photoStorage.loadPhotosFromStorage();
      const photos = photoStorage.getAllPhotos();

      expect(photos).toHaveLength(2);
      expect(photos[0]).toMatchObject(mockPhotos[0]);
      expect(photos[1]).toMatchObject(mockPhotos[1]);
    });

    it('should return empty array when no photos', async () => {
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('[]');

      await photoStorage.loadPhotosFromStorage();
      const photos = photoStorage.getAllPhotos();

      expect(photos).toHaveLength(0);
    });
  });

  describe('getPhotoById', () => {
    it('should return photo by id', async () => {
      const mockPhotos = [
        {
          id: 'photo1',
          uri: 'file://mock/photo1.jpg',
          title: 'Photo 1',
          timestamp: Date.now(),
          date: '10/7/2025',
          time: '9:00:00 PM',
          size: 1024,
          width: 1920,
          height: 1080,
        },
      ];

      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
        JSON.stringify(mockPhotos)
      );

      await photoStorage.loadPhotosFromStorage();
      const photo = photoStorage.getPhotoById('photo1');

      expect(photo).toMatchObject(mockPhotos[0]);
    });

    it('should return undefined for non-existent photo', async () => {
      await photoStorage.loadPhotosFromStorage();
      const photo = photoStorage.getPhotoById('non-existent');

      expect(photo).toBeUndefined();
    });
  });

  describe('deletePhoto', () => {
    it('should delete photo successfully', async () => {
      const mockPhotos = [
        {
          id: 'photo1',
          uri: 'file://mock/photo1.jpg',
          title: 'Photo 1',
          timestamp: Date.now(),
          date: '10/7/2025',
          time: '9:00:00 PM',
          size: 1024,
          width: 1920,
          height: 1080,
        },
      ];

      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
        JSON.stringify(mockPhotos)
      );

      await photoStorage.loadPhotosFromStorage();
      const result = await photoStorage.deletePhoto('photo1');

      expect(result).toBe(true);
      expect(FileSystem.deleteAsync).toHaveBeenCalledWith('file://mock/photo1.jpg');
    });

    it('should return false for non-existent photo', async () => {
      const result = await photoStorage.deletePhoto('non-existent');

      expect(result).toBe(false);
    });
  });

  describe('updatePhotoTitle', () => {
    it('should update photo title successfully', async () => {
      const mockPhotos = [
        {
          id: 'photo1',
          uri: 'file://mock/photo1.jpg',
          title: 'Old Title',
          timestamp: Date.now(),
          date: '10/7/2025',
          time: '9:00:00 PM',
          size: 1024,
          width: 1920,
          height: 1080,
        },
      ];

      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
        JSON.stringify(mockPhotos)
      );

      await photoStorage.loadPhotosFromStorage();
      const result = await photoStorage.updatePhotoTitle('photo1', 'New Title');

      expect(result).toBe(true);
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
    });

    it('should return false for non-existent photo', async () => {
      const result = await photoStorage.updatePhotoTitle('non-existent', 'New Title');

      expect(result).toBe(false);
    });
  });

  describe('searchPhotos', () => {
    beforeEach(async () => {
      const mockPhotos = [
        {
          id: 'photo1',
          uri: 'file://mock/photo1.jpg',
          title: 'Beach Photo',
          timestamp: Date.now(),
          date: '10/7/2025',
          time: '9:00:00 PM',
          size: 1024,
          width: 1920,
          height: 1080,
          location: {
            latitude: -23.5505,
            longitude: -46.6333,
            address: 'São Paulo, SP',
          },
        },
        {
          id: 'photo2',
          uri: 'file://mock/photo2.jpg',
          title: 'Mountain View',
          timestamp: Date.now(),
          date: '10/7/2025',
          time: '9:30:00 PM',
          size: 2048,
          width: 1920,
          height: 1080,
          location: {
            latitude: -22.9068,
            longitude: -43.1729,
            address: 'Rio de Janeiro, RJ',
          },
        },
      ];

      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
        JSON.stringify(mockPhotos)
      );

      await photoStorage.loadPhotosFromStorage();
    });

    it('should search by title', () => {
      const results = photoStorage.searchPhotos('beach');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Beach Photo');
    });

    it('should search by location', () => {
      const results = photoStorage.searchPhotos('São Paulo');

      expect(results).toHaveLength(1);
      expect(results[0].location?.address).toContain('São Paulo');
    });

    it('should return all photos for empty query', () => {
      const results = photoStorage.searchPhotos('');

      expect(results).toHaveLength(2);
    });

    it('should return empty array for no matches', () => {
      const results = photoStorage.searchPhotos('non-existent');

      expect(results).toHaveLength(0);
    });
  });

  describe('filterPhotosByDate', () => {
    beforeEach(async () => {
      const mockPhotos = [
        {
          id: 'photo1',
          uri: 'file://mock/photo1.jpg',
          title: 'Photo 1',
          timestamp: new Date('2025-01-01').getTime(),
          date: '1/1/2025',
          time: '9:00:00 PM',
          size: 1024,
          width: 1920,
          height: 1080,
        },
        {
          id: 'photo2',
          uri: 'file://mock/photo2.jpg',
          title: 'Photo 2',
          timestamp: new Date('2025-01-15').getTime(),
          date: '1/15/2025',
          time: '9:30:00 PM',
          size: 2048,
          width: 1920,
          height: 1080,
        },
      ];

      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
        JSON.stringify(mockPhotos)
      );

      await photoStorage.loadPhotosFromStorage();
    });

    it('should filter photos by date range', () => {
      const from = new Date('2025-01-01');
      const to = new Date('2025-01-10');

      const results = photoStorage.filterPhotosByDate(from, to);

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('photo1');
    });
  });

  describe('filterPhotosByLocation', () => {
    beforeEach(async () => {
      const mockPhotos = [
        {
          id: 'photo1',
          uri: 'file://mock/photo1.jpg',
          title: 'Photo 1',
          timestamp: Date.now(),
          date: '10/7/2025',
          time: '9:00:00 PM',
          size: 1024,
          width: 1920,
          height: 1080,
          location: {
            latitude: -23.5505,
            longitude: -46.6333,
            address: 'São Paulo, SP',
          },
        },
        {
          id: 'photo2',
          uri: 'file://mock/photo2.jpg',
          title: 'Photo 2',
          timestamp: Date.now(),
          date: '10/7/2025',
          time: '9:30:00 PM',
          size: 2048,
          width: 1920,
          height: 1080,
          location: {
            latitude: -22.9068,
            longitude: -43.1729,
            address: 'Rio de Janeiro, RJ',
          },
        },
      ];

      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
        JSON.stringify(mockPhotos)
      );

      await photoStorage.loadPhotosFromStorage();
    });

    it('should filter photos by location', () => {
      const results = photoStorage.filterPhotosByLocation(-23.5505, -46.6333, 10);

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('photo1');
    });

    it('should return empty array for no photos in radius', () => {
      const results = photoStorage.filterPhotosByLocation(0, 0, 1);

      expect(results).toHaveLength(0);
    });
  });
});
