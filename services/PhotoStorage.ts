import * as FileSystem from 'expo-file-system/legacy';
import * as Location from 'expo-location';
import { PhotoMetadata } from '../types/photo';

const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;
const METADATA_FILE = `${FileSystem.documentDirectory}photo_metadata.json`;

export class PhotoStorage {
  private static instance: PhotoStorage;
  private photos: PhotoMetadata[] = [];

  private constructor() {
    this.loadPhotos();
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
      
      // Ensure photos directory exists
      console.log('Checking photos directory...');
      const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
      if (!dirInfo.exists) {
        console.log('Creating photos directory...');
        await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
      }

      // Get current location
      console.log('Getting location...');
      const location = await this.getCurrentLocation();
      
      // Get file info
      console.log('Getting file info...');
      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log('File info:', fileInfo);
      
      // Get image dimensions
      console.log('Getting image dimensions...');
      const imageInfo = await this.getImageDimensions(uri);
      console.log('Image dimensions:', imageInfo);

      // Generate unique filename
      const timestamp = Date.now();
      const filename = `photo_${timestamp}.jpg`;
      const newUri = `${PHOTOS_DIR}${filename}`;
      console.log('New URI:', newUri);

      // Copy photo to app directory
      console.log('Copying photo...');
      await FileSystem.copyAsync({
        from: uri,
        to: newUri,
      });
      console.log('Photo copied successfully');

      // Create metadata
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

      // Add to photos array
      this.photos.unshift(photo); // Add to beginning for newest first
      await this.savePhotos();
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

      // Get address from coordinates
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
      // For now, we'll use default dimensions since getting real dimensions
      // requires additional native modules that can cause build issues
      // In a production app, you might want to use expo-image-manipulator
      // or react-native-image-size with proper Android configuration
      return { width: 1920, height: 1080 }; // Default dimensions
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      return { width: 1920, height: 1080 }; // Default dimensions
    }
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

      // Delete file
      const fileInfo = await FileSystem.getInfoAsync(photo.uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(photo.uri);
      }

      // Remove from array
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