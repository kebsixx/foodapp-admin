import { useState } from 'react';
import { uploadImageToImgBB, validateImageFile, compressImage } from '@/lib/imgbb';
import { ProductImageUrls } from '@/app/admin/products/products.types';

interface UseImageUploadProps {
  onSuccess?: (url: string, urls?: ProductImageUrls) => void;
  onError?: (error: string) => void;
  autoCompress?: boolean;
  compressionQuality?: number;
}

export const useImageUpload = ({
  onSuccess,
  onError,
  autoCompress = true,
  compressionQuality = 0.8,
}: UseImageUploadProps = {}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      setProgress(20);

      // Compress image if needed
      let fileToUpload = file;
      if (autoCompress && file.size > 1024 * 1024) { // 1MB
        fileToUpload = await compressImage(file, compressionQuality);
      }

      setProgress(40);

      // Upload to ImgBB
      const result = await uploadImageToImgBB(fileToUpload);

      setProgress(80);

      if (result.success && result.url) {
        const urls: ProductImageUrls = {
          original: result.urls?.original,
          display: result.urls?.display,
          medium: result.urls?.medium,
          thumb: result.urls?.thumb,
        };

        setProgress(100);
        onSuccess?.(result.url, urls);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    uploading,
    progress,
    error,
    uploadImage,
    clearError,
  };
};