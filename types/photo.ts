export interface PhotoMetadata {
  id: string;
  uri: string;
  title?: string;
  timestamp: number;
  date: string;
  time: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  size: number;
  width: number;
  height: number;
}

export interface PhotoFilter {
  searchText?: string;
  dateFrom?: Date;
  dateTo?: Date;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
}

export interface PhotoComparison {
  photo1: PhotoMetadata;
  photo2: PhotoMetadata;
}

export interface ShareData {
  photo: PhotoMetadata;
  includeMetadata: boolean;
  format: 'image' | 'text' | 'both';
}
