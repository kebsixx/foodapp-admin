export interface ImgBBResponse {
  success: boolean;
  url?: string;
  urls?: {
    original?: string;
    display?: string;
    medium?: string;
    thumb?: string;
  };
  delete_url?: string;
  viewer_url?: string;
  width?: number;
  height?: number;
  size?: number;
  error?: string;
}

export const uploadImageToImgBB = async (file: File): Promise<ImgBBResponse> => {
  try {
    const base64 = await convertFileToBase64(file);
    
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64 }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('Upload result:', result);
    
    return result;
  } catch (error) {
    console.error('ImgBB upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image'
    };
  }
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' };
  }

  const maxSize = 32 * 1024 * 1024; // 32MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 32MB' };
  }

  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
  if (!supportedFormats.includes(file.type)) {
    return { valid: false, error: 'Unsupported file format. Please use JPG, PNG, GIF, BMP, or WEBP' };
  }

  return { valid: true };
};

export const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const maxSize = 1200;
      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Fungsi untuk memigrasi gambar dari Supabase ke ImgBB
export const migrateImageToImgBB = async (supabaseUrl: string): Promise<{
  url: string;
  urls: {
    original: string;
    display: string;
    medium: string;
    thumb: string;
  };
}> => {
  try {
    // Download gambar dari Supabase
    const response = await fetch(supabaseUrl);
    if (!response.ok) {
      throw new Error('Failed to download image from Supabase');
    }

    // Convert response ke blob
    const blob = await response.blob();
    
    // Convert blob ke File object
    const file = new File([blob], 'migrated-image.jpg', { type: blob.type });

    // Upload ke ImgBB
    const result = await uploadImageToImgBB(file);

    if (!result.success) {
      throw new Error(result.error || 'Failed to upload to ImgBB');
    }

    // Return URL ImgBB
    return {
      url: result.url || '',
      urls: {
        original: result.urls?.original || result.url || '',
        display: result.urls?.display || result.url || '',
        medium: result.urls?.medium || result.url || '',
        thumb: result.urls?.thumb || result.url || '',
      }
    };
  } catch (error) {
    console.error('Migration error:', error);
    throw new Error('Failed to migrate image to ImgBB');
  }
};

// Fungsi untuk memvalidasi URL ImgBB
export const validateImgBBUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== 'i.ibb.co' && parsedUrl.hostname !== 'ibb.co') {
      return false;
    }
    
    // Validasi format path
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    return pathParts.length >= 2;
  } catch {
    return false;
  }
};

// Fungsi untuk memperbaiki URL ImgBB yang tidak valid
export const fixImgBBUrl = async (invalidUrl: string): Promise<string> => {
  try {
    // Download gambar dari URL yang tidak valid
    const response = await fetch(invalidUrl);
    if (!response.ok) {
      throw new Error('Failed to download image');
    }

    // Convert ke blob
    const blob = await response.blob();
    
    // Convert ke File
    const file = new File([blob], 'fixed-image.jpg', { type: blob.type });

    // Upload ke ImgBB
    const result = await uploadImageToImgBB(file);

    if (!result.success || !result.url) {
      throw new Error('Failed to upload to ImgBB');
    }

    // Validasi URL baru
    if (!validateImgBBUrl(result.url)) {
      throw new Error('Invalid ImgBB URL received');
    }

    return result.url;
  } catch (error) {
    console.error('Failed to fix ImgBB URL:', error);
    throw error;
  }
};