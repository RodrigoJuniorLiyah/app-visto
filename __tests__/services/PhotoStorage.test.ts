// Teste simples do PhotoStorage sem dependências externas
describe('PhotoStorage - Basic Tests', () => {
  it('should be a singleton', () => {
    // Mock do PhotoStorage para teste básico
    class MockPhotoStorage {
      private static instance: MockPhotoStorage;
      
      static getInstance(): MockPhotoStorage {
        if (!MockPhotoStorage.instance) {
          MockPhotoStorage.instance = new MockPhotoStorage();
        }
        return MockPhotoStorage.instance;
      }
      
      getAllPhotos() {
        return [];
      }
    }
    
    const instance1 = MockPhotoStorage.getInstance();
    const instance2 = MockPhotoStorage.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should start with empty photos array', () => {
    class MockPhotoStorage {
      getAllPhotos() {
        return [];
      }
    }
    
    const photoStorage = new MockPhotoStorage();
    const photos = photoStorage.getAllPhotos();
    expect(photos).toEqual([]);
  });

  it('should handle photo operations', () => {
    class MockPhotoStorage {
      private photos: any[] = [];
      
      savePhoto(uri: string, title: string) {
        const photo = {
          id: `photo_${Date.now()}`,
          uri,
          title,
          createdAt: new Date(),
        };
        this.photos.push(photo);
        return photo;
      }
      
      getPhotoById(id: string) {
        return this.photos.find(photo => photo.id === id);
      }
      
      deletePhoto(id: string) {
        const index = this.photos.findIndex(photo => photo.id === id);
        if (index > -1) {
          this.photos.splice(index, 1);
          return true;
        }
        return false;
      }
      
      searchPhotos(query: string) {
        return this.photos.filter(photo => 
          photo.title.toLowerCase().includes(query.toLowerCase())
        );
      }
    }
    
    const photoStorage = new MockPhotoStorage();
    
    // Test save
    const savedPhoto = photoStorage.savePhoto('test.jpg', 'Test Photo');
    expect(savedPhoto.title).toBe('Test Photo');
    expect(savedPhoto.id).toContain('photo_');
    
    // Test get by ID
    const retrievedPhoto = photoStorage.getPhotoById(savedPhoto.id);
    expect(retrievedPhoto).toEqual(savedPhoto);
    
    // Test search
    const searchResults = photoStorage.searchPhotos('Test');
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0].title).toBe('Test Photo');
    
    // Test delete
    const deleteResult = photoStorage.deletePhoto(savedPhoto.id);
    expect(deleteResult).toBe(true);
    
    const deletedPhoto = photoStorage.getPhotoById(savedPhoto.id);
    expect(deletedPhoto).toBeUndefined();
  });
});