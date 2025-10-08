import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import { PhotoMetadata } from '../types/photo';
import { ImageCache } from './ImageCache';

const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;
const METADATA_FILE = `${FileSystem.documentDirectory}photo_metadata.json`;

export class PhotoStorage {
  private static instance: PhotoStorage;
  private photos: PhotoMetadata[] = [];
  private imageCache: ImageCache;

  private constructor() {
    this.imageCache = ImageCache.getInstance();
  }

  public static getInstance(): PhotoStorage {
    if (!PhotoStorage.instance) {
      PhotoStorage.instance = new PhotoStorage();
    }
    return PhotoStorage.instance;
  }

  private async loadPhotos(): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(METADATA_FILE);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(METADATA_FILE);
        this.photos = JSON.parse(content);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
      this.photos = [];
    }
  }

  private async savePhotos(): Promise<void> {
    try {
      await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify(this.photos));
    } catch (error) {
      console.error('Error saving photos:', error);
    }
  }

  public async savePhoto(
    uri: string,
    title?: string
  ): Promise<PhotoMetadata> {
    try {
      console.log('Starting photo save process...');
      
      console.log('Checking photos directory...');
      const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
      if (!dirInfo.exists) {
        console.log('Creating photos directory...');
        await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
      }

      console.log('Getting location...');
      const location = await this.getCurrentLocation();
      
      console.log('Getting file info...');
      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log('File info:', fileInfo);
      
      console.log('Getting image dimensions...');
      const imageInfo = await this.getImageDimensions(uri);
      console.log('Image dimensions:', imageInfo);

      const timestamp = Date.now();
      const filename = `photo_${timestamp}.jpg`;
      const newUri = `${PHOTOS_DIR}${filename}`;
      console.log('New URI:', newUri);

      console.log('Compressing and saving photo...');
      const compressedResult = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            resize: {
              width: 1920, // Máximo 1920px de largura
              height: 1920, // Máximo 1920px de altura
            },
          },
        ],
        {
          compress: 0.85, // 85% de qualidade
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      await FileSystem.moveAsync({
        from: compressedResult.uri,
        to: newUri,
      });
      console.log('Photo compressed and saved successfully');

      const photo: PhotoMetadata = {
        id: `photo_${timestamp}`,
        uri: newUri,
        title: title || `Photo ${new Date(timestamp).toLocaleDateString()}`,
        timestamp,
        date: new Date(timestamp).toLocaleDateString(),
        time: new Date(timestamp).toLocaleTimeString(),
        location,
        size: (fileInfo as any).size || 0,
        width: imageInfo.width,
        height: imageInfo.height,
      };

      console.log('Photo metadata created:', photo);

      this.photos.unshift(photo); // Add to beginning for newest first
      await this.savePhotos();
      
      try {
        console.log('🔄 Iniciando cache da foto:', newUri);
        await this.imageCache.cacheImage(newUri);
        console.log('✅ Photo cached successfully');
      } catch (cacheError) {
        console.warn('❌ Failed to cache photo:', cacheError);
      }
      
      console.log('Photo saved successfully');

      return photo;
    } catch (error) {
      console.error('Error saving photo:', error);
      throw error;
    }
  }

  private async getCurrentLocation(): Promise<PhotoMetadata['location']> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return undefined;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const address = await this.getAddressFromCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return undefined;
    }
  }

  private async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string | undefined> {
    try {
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        return `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}, ${addr.region || ''}`.trim();
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
    return undefined;
  }

  private async getImageDimensions(uri: string): Promise<{ width: number; height: number }> {
    try {
      return { width: 1920, height: 1080 }; // Default dimensions
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      return { width: 1920, height: 1080 }; // Default dimensions
    }
  }

  public async loadPhotosFromStorage(): Promise<void> {
    await this.loadPhotos();
  }

  public getAllPhotos(): PhotoMetadata[] {
    return [...this.photos];
  }

  public getPhotoById(id: string): PhotoMetadata | undefined {
    return this.photos.find(photo => photo.id === id);
  }

  public async deletePhoto(id: string): Promise<boolean> {
    try {
      const photo = this.photos.find(p => p.id === id);
      if (!photo) return false;

      const fileInfo = await FileSystem.getInfoAsync(photo.uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(photo.uri);
      }

      this.photos = this.photos.filter(p => p.id !== id);
      await this.savePhotos();

      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      return false;
    }
  }

  public async updatePhotoTitle(id: string, title: string): Promise<boolean> {
    try {
      const photo = this.photos.find(p => p.id === id);
      if (!photo) return false;

      photo.title = title;
      await this.savePhotos();
      return true;
    } catch (error) {
      console.error('Error updating photo title:', error);
      return false;
    }
  }

  public searchPhotos(query: string): PhotoMetadata[] {
    if (!query.trim()) return this.photos;

    const lowercaseQuery = query.toLowerCase();
    return this.photos.filter(photo => 
      photo.title?.toLowerCase().includes(lowercaseQuery) ||
      photo.date.toLowerCase().includes(lowercaseQuery) ||
      photo.time.toLowerCase().includes(lowercaseQuery) ||
      photo.location?.address?.toLowerCase().includes(lowercaseQuery)
    );
  }

  public filterPhotosByDate(from: Date, to: Date): PhotoMetadata[] {
    return this.photos.filter(photo => {
      const photoDate = new Date(photo.timestamp);
      return photoDate >= from && photoDate <= to;
    });
  }

  public filterPhotosByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): PhotoMetadata[] {
    return this.photos.filter(photo => {
      if (!photo.location) return false;
      
      const distance = this.calculateDistance(
        latitude,
        longitude,
        photo.location.latitude,
        photo.location.longitude
      );
      
      return distance <= radiusKm;
    });
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}