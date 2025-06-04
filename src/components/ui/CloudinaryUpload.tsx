import { useState, useRef } from 'react';
import { Button } from './button';
import { Loader2, Upload } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface CloudinaryUploadProps {
  onSuccess: (result: {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
  }) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const CloudinaryUpload = ({
  onSuccess,
  onError,
  className = '',
}: CloudinaryUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadToCloudinary(file);
      onSuccess({
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
      });
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
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
        className={className}
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </>
        )}
      </Button>
    </div>
  );
}; 