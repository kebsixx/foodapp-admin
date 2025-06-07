"use client";

import React, { forwardRef, useState } from "react";
import { Button } from "./button";
import { ImageIcon, Upload, X } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { SafeImage } from "./SafeImage";
import { toast } from "sonner";

interface CategoryImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export const CategoryImageUpload = forwardRef<HTMLDivElement, CategoryImageUploadProps>(({
  value,
  onChange,
  onRemove,
  disabled,
}, ref) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const result = await uploadToCloudinary(file);
      onChange(result.secure_url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4" ref={ref}>
      <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors">
        {value ? (
          <>
            <SafeImage
              src={value}
              alt="Category image"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onRemove}
              disabled={disabled || isUploading}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <label
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={disabled || isUploading}
            />
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">
              {isUploading ? "Uploading..." : "Upload image"}
            </span>
          </label>
        )}
      </div>
    </div>
  );
});

CategoryImageUpload.displayName = "CategoryImageUpload"; 