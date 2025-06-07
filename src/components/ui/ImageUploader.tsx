"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Edit2 } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { ProductImageUrls } from "@/app/admin/products/products.types";
import { SafeImage } from "./SafeImage";
import Image from "next/image";

interface ImageUploaderProps {
  onImageUploaded: (url: string, urls?: ProductImageUrls) => void;
  currentImage?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  shape?: "square" | "circle";
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  currentImage,
  className = "",
  size = "md",
  shape = "square",
  disabled = false,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploading, progress, error, uploadImage, clearError } =
    useImageUpload({
      onSuccess: (url, urls) => {
        console.log("Upload success, URL:", url);
        console.log("Upload success, URLs:", urls);
        onImageUploaded(url, urls);
        setImagePreview(null);
      },
    });
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-lg",
  };

  const handleFileSelect = async (file: File) => {
    clearError();

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadImage(file);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = "";
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled && !uploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);

    if (!disabled && !uploading) {
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFileSelect(file);
      }
    }
  };

  const handleRemove = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onImageUploaded("", undefined);
    setImagePreview(null);
    clearError();
  };

  const displayImage = imagePreview || currentImage;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className={`
          relative cursor-pointer transition-all duration-200 border-2 border-dashed overflow-hidden
          ${sizeClasses[size]} ${shapeClasses[shape]}
          ${
            dragOver
              ? "border-primary bg-primary/10 scale-105"
              : "border-gray-300 hover:border-primary/50"
          }
          ${uploading || disabled ? "pointer-events-none opacity-50" : ""}
          ${error ? "border-red-500" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || uploading}
        />

        {displayImage ? (
          <>
            <div
              className={`relative w-full h-full ${shapeClasses[shape]} overflow-hidden`}>
              {imagePreview ? (
                // Untuk preview lokal, gunakan Image dari next/image
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className={`object-cover ${shapeClasses[shape]}`}
                  sizes={`${
                    size === "sm" ? "80px" : size === "md" ? "128px" : "192px"
                  }`}
                  loading="lazy"
                  priority={false}
                />
              ) : (
                // Untuk gambar dari server, gunakan SafeImage
                <SafeImage
                  src={displayImage}
                  alt="Product image"
                  fill
                  className={`object-cover ${shapeClasses[shape]}`}
                  sizes={`${
                    size === "sm" ? "80px" : size === "md" ? "128px" : "192px"
                  }`}
                  loading="lazy"
                  priority={false}
                  onError={() => {
                    console.error(
                      "Failed to load image in uploader:",
                      displayImage
                    );
                    setImagePreview(null);
                    if (currentImage) {
                      onImageUploaded("", undefined);
                    }
                  }}
                />
              )}
            </div>

            {!disabled && !uploading && (
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg z-10"
                type="button">
                <X size={12} />
              </button>
            )}

            {!uploading && (
              <div
                className={`
                absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 
                transition-opacity duration-200 flex items-center justify-center
                ${shapeClasses[shape]}
              `}>
                <Edit2 className="text-white" size={20} />
              </div>
            )}

            {uploading && (
              <div
                className={`
                absolute inset-0 bg-black/70 flex flex-col items-center justify-center
                ${shapeClasses[shape]}
              `}>
                <Upload className="text-white animate-bounce mb-2" size={20} />

                <div className="text-white text-xs font-medium">
                  {progress}%
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            {uploading ? (
              <div className="flex flex-col items-center gap-2 w-full">
                <Upload
                  className="animate-bounce"
                  size={size === "sm" ? 16 : size === "md" ? 24 : 32}
                />
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}></div>
                </div>

                <span className="text-xs text-center">
                  Uploading... {progress}%
                </span>
              </div>
            ) : (
              <>
                <ImageIcon
                  size={size === "sm" ? 16 : size === "md" ? 24 : 32}
                  className="mb-2"
                />
                <span className="text-xs text-center font-medium">
                  Add Photo
                </span>
                <span className="text-xs text-center text-gray-400 mt-1">
                  Click or drag here
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-xs text-center max-w-48">{error}</div>
      )}

      {!error && (
        <div className="text-gray-500 text-xs text-center max-w-48">
          Supports: JPG, PNG, GIF, WEBP
          <br />
          Max size: 32MB
        </div>
      )}
    </div>
  );
};
