import * as FileSystem from 'expo-file-system/legacy';
import { ImageCache } from './ImageCache';

export class CacheDebugger {
  public static async debugCache(): Promise<void> {
    console.log('🔍 === DEBUG DO CACHE DE IMAGENS ===');
    
    try {
      // Verificar diretórios de cache
      const thumbnailsDir = `${FileSystem.documentDirectory}thumbnails/`;
      const compressedDir = `${FileSystem.documentDirectory}compressed/`;
      const cacheFile = `${FileSystem.documentDirectory}image_cache.json`;
      
      console.log('📁 Verificando diretórios...');
      
      const thumbnailsInfo = await FileSystem.getInfoAsync(thumbnailsDir);
      const compressedInfo = await FileSystem.getInfoAsync(compressedDir);
      const cacheFileInfo = await FileSystem.getInfoAsync(cacheFile);
      
      console.log('📂 Thumbnails dir exists:', thumbnailsInfo.exists);
      console.log('📂 Compressed dir exists:', compressedInfo.exists);
      console.log('📄 Cache file exists:', cacheFileInfo.exists);
      
      if (cacheFileInfo.exists) {
        const cacheContent = await FileSystem.readAsStringAsync(cacheFile);
        const cacheData = JSON.parse(cacheContent);
        console.log('📊 Cache entries:', Object.keys(cacheData).length);
        
        // Verificar cada entrada do cache
        for (const [key, cachedImage] of Object.entries(cacheData)) {
          const image = cachedImage as any;
          console.log(`🖼️ Cache entry: ${key}`);
          console.log(`   Original: ${image.originalUri}`);
          console.log(`   Thumbnail: ${image.thumbnailUri}`);
          console.log(`   Compressed: ${image.compressedUri}`);
          console.log(`   Size: ${image.size}`);
          console.log(`   Cached at: ${new Date(image.cachedAt).toLocaleString()}`);
          
          // Verificar se os arquivos existem
          const thumbnailExists = await FileSystem.getInfoAsync(image.thumbnailUri);
          const compressedExists = await FileSystem.getInfoAsync(image.compressedUri);
          
          console.log(`   ✅ Thumbnail exists: ${thumbnailExists.exists}`);
          console.log(`   ✅ Compressed exists: ${compressedExists.exists}`);
          
          if (thumbnailExists.exists) {
            console.log(`   📏 Thumbnail size: ${thumbnailExists.size} bytes`);
          }
          if (compressedExists.exists) {
            console.log(`   📏 Compressed size: ${compressedExists.size} bytes`);
          }
        }
      }
      
      // Verificar instância do ImageCache
      const imageCache = ImageCache.getInstance();
      const stats = imageCache.getCacheStats();
      console.log('📈 Cache stats:', stats);
      
      // Listar arquivos nos diretórios
      if (thumbnailsInfo.exists) {
        const thumbnailsFiles = await FileSystem.readDirectoryAsync(thumbnailsDir);
        console.log('🖼️ Thumbnail files:', thumbnailsFiles);
      }
      
      if (compressedInfo.exists) {
        const compressedFiles = await FileSystem.readDirectoryAsync(compressedDir);
        console.log('🗜️ Compressed files:', compressedFiles);
      }
      
    } catch (error) {
      console.error('❌ Erro no debug do cache:', error);
    }
    
    console.log('🔍 === FIM DO DEBUG ===');
  }
  
  public static async testCacheImage(uri: string): Promise<void> {
    console.log('🧪 Testando cache de imagem:', uri);
    
    try {
      const imageCache = ImageCache.getInstance();
      
      console.log('⏳ Iniciando cache...');
      const startTime = Date.now();
      
      const cachedImage = await imageCache.cacheImage(uri);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log('✅ Cache concluído em:', duration, 'ms');
      console.log('📊 Resultado:', {
        originalUri: cachedImage.originalUri,
        thumbnailUri: cachedImage.thumbnailUri,
        compressedUri: cachedImage.compressedUri,
        size: cachedImage.size,
        cachedAt: new Date(cachedImage.cachedAt).toLocaleString()
      });
      
      // Verificar se os arquivos foram criados
      const thumbnailInfo = await FileSystem.getInfoAsync(cachedImage.thumbnailUri);
      const compressedInfo = await FileSystem.getInfoAsync(cachedImage.compressedUri);
      
      console.log('✅ Thumbnail criado:', thumbnailInfo.exists, thumbnailInfo.size, 'bytes');
      console.log('✅ Compressed criado:', compressedInfo.exists, compressedInfo.size, 'bytes');
      
    } catch (error) {
      console.error('❌ Erro ao testar cache:', error);
    }
  }
}
