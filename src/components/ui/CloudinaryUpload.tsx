import { useState, useRef } from 'react';
import { Button } from './button';
import { Loader2, Upload } from 'lucide-react';
import { smartUploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'react-hot-toast';
import { compressImage } from '@/lib/image-compression';

interface CloudinaryUploadProps {
  onSuccess: (result: {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
  }) => void;
  onError?: (error: string) => void;
  className?: string;
  compressOptions?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSizeMB?: number;
  };
}

export const CloudinaryUpload = ({
  onSuccess,
  onError,
  className = '',
  compressOptions = {
    maxWidth: 1600,
    maxHeight: 1200,
    quality: 0.7,
    maxSizeMB: 1
  }
}: CloudinaryUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Reset error state
    setUploadError(null);
    setUploadProgress(0);

    // Validate file size (max 10MB for original)
    if (file.size > 10 * 1024 * 1024) {
      const errorMsg = 'File size exceeds 10MB limit';
      setUploadError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Show compression status
      toast.loading('Compressing image...', { id: 'compress-image' });
      
      // Compress the image before uploading
      const compressedFile = await compressImage(file, compressOptions);
      
      setUploadProgress(40);
      toast.success('Image compressed successfully', { id: 'compress-image' });
      
      // Show upload status
      toast.loading('Uploading to Cloudinary...', { id: 'upload-image' });
      
      // Use the smart upload function that chooses the best method
      const result = await smartUploadToCloudinary(compressedFile);
      
      setUploadProgress(100);
      toast.success('Upload successful!', { id: 'upload-image' });
      
      onSuccess({
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMsg);
      onError?.(errorMsg);
      toast.error(`Image upload failed: ${errorMsg}`, { id: 'upload-image' });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        className={`flex items-center justify-center text-sm ${className}`}
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="truncate">
              {uploadProgress !== null ? `Processing (${uploadProgress}%)` : 'Uploading...'}
            </span>
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            <span className="truncate">Upload Image</span>
          </>
        )}
      </Button>
      {uploadError && (
        <p className="text-xs text-red-500 mt-1">{uploadError}</p>
      )}
    </div>
  );
}; 