"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  fallbackSrc?: string;
  onError?: (error?: Error) => void;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  width,
  height,
  fill,
  className = "",
  sizes,
  priority = false,
  loading = "lazy",
  fallbackSrc,
  onError,
}) => {
  const [imgSrc, setImgSrc] = useState(src.trim());
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2; // Reduced retries for faster fallback
  const timeoutDuration = 5000; // Reduced timeout to 5 seconds

  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src.trim());
    setHasError(false);
    setIsLoading(true);
    setRetryCount(0);
  }, [src]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        if (isLoading) {
          handleError();
        }
      }, timeoutDuration);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  const handleError = () => {
    if (retryCount < maxRetries) {
      // Retry loading the image
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      return;
    }

    setHasError(true);
    setIsLoading(false);

    if (fallbackSrc && imgSrc !== fallbackSrc.trim()) {
      setImgSrc(fallbackSrc.trim());
      setHasError(false);
      setIsLoading(true);
      setRetryCount(0);
    } else {
      onError?.(new Error(`Failed to load image: ${imgSrc}`));
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Jika gambar error dan tidak ada fallback, tampilkan placeholder
  if (hasError && (!fallbackSrc || imgSrc === fallbackSrc.trim())) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
        <ImageIcon className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        sizes={sizes}
        priority={priority}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        quality={80}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjg0OD4wMDw7QEBAPj5APj4+Pj4+Pj4+Pj4+Pj7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </>
  );
};
