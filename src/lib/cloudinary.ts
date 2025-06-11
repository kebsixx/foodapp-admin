"use client";

import { CldUploadWidget } from 'next-cloudinary';

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
};

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  // Check if we're online first
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('You appear to be offline. Please check your internet connection and try again.');
  }

  // Check if Cloudinary is configured
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
    console.error('Cloudinary configuration missing:', { 
      cloudName: !!cloudinaryConfig.cloudName, 
      uploadPreset: !!cloudinaryConfig.uploadPreset 
    });
    throw new Error('Cloudinary is not properly configured. Please check your environment variables.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset!);
  formData.append('cloud_name', cloudinaryConfig.cloudName!);

  try {
    // Add timeout of 60 seconds using AbortController (increased from 30)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    console.log('Uploading to Cloudinary:', { 
      cloudName: cloudinaryConfig.cloudName,
      fileSize: file.size,
      fileType: file.type 
    });

    // Use a different approach for larger files (over 1MB)
    let response;
    if (file.size > 1024 * 1024) {
      // For larger files, use the direct upload endpoint with fetch
      response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        }
      );
    } else {
      // For smaller files, use the standard approach
      response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        }
      );
    }

    // Clear the timeout
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary API error:', errorText);
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Cloudinary upload successful:', { 
      publicId: data.public_id,
      format: data.format,
      size: `${data.width}x${data.height}` 
    });
    
    return {
      public_id: data.public_id,
      secure_url: data.secure_url,
      width: data.width,
      height: data.height,
      format: data.format,
      resource_type: data.resource_type,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Cloudinary upload timed out after 60 seconds');
      throw new Error('Upload timed out. The image may be too large or your connection is slow. Please try compressing the image or using a better network connection.');
    }
    console.error('Cloudinary upload error:', error);
    throw new Error(error.message || 'Failed to upload to Cloudinary');
  }
};

export const getCloudinaryUrl = (publicId: string, options: {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale';
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  fetchFormat?: 'auto' | 'webp' | 'jpg' | 'png';
} = {}) => {
  try {
    // Validate publicId
    if (!publicId || typeof publicId !== 'string') {
      console.error('Invalid publicId provided to getCloudinaryUrl:', publicId);
      return '';
    }
    
    const { 
      width, 
      height, 
      crop = 'fill', 
      quality = 80,
      format = 'auto',
      fetchFormat = 'auto'
    } = options;

    const transformations = [
      crop && `c_${crop}`,
      width && `w_${width}`,
      height && `h_${height}`,
      quality && `q_${quality}`,
      format && `f_${format}`,
      fetchFormat && `fl_fetch_format:${fetchFormat}`,
      'fl_progressive',
      'fl_force_strip',
      'dpr_auto',
      'fl_attachment:inline',
    ].filter(Boolean).join(',');

    // Ensure publicId doesn't have any leading/trailing spaces
    const cleanPublicId = publicId.trim();
    
    // Validate cloudName
    if (!cloudinaryConfig.cloudName) {
      console.error('Missing Cloudinary cloud name in configuration');
      return '';
    }
    
    // Construct the URL with proper encoding
    const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;
    const transformationPath = transformations ? `/${transformations}` : '';
    
    const finalUrl = `${baseUrl}${transformationPath}/${cleanPublicId}`;
    
    return finalUrl;
  } catch (error) {
    console.error('Error generating Cloudinary URL:', error, 'for publicId:', publicId);
    return '';
  }
};

// Helper function to get optimized image URLs for different sizes
export const getOptimizedImageUrls = (publicId: string) => {
  return {
    original: getCloudinaryUrl(publicId, { 
      quality: 80, 
      format: 'auto',
      fetchFormat: 'webp'
    }),
    display: getCloudinaryUrl(publicId, { 
      width: 800, 
      quality: 80, 
      format: 'auto',
      fetchFormat: 'webp'
    }),
    medium: getCloudinaryUrl(publicId, { 
      width: 400, 
      quality: 80, 
      format: 'auto',
      fetchFormat: 'webp'
    }),
    thumb: getCloudinaryUrl(publicId, { 
      width: 200, 
      quality: 80, 
      format: 'auto',
      fetchFormat: 'webp'
    })
  };
};

// Fungsi untuk migrasi gambar dari URL eksternal ke Cloudinary
export const migrateImageToCloudinary = async (imageUrl: string): Promise<CloudinaryUploadResult> => {
  try {
    console.log(`Starting migration of image: ${imageUrl}`);
    
    // Jika sudah URL Cloudinary, tidak perlu migrasi
    if (imageUrl.includes('res.cloudinary.com')) {
      console.log('URL already from Cloudinary, no migration needed');
      throw new Error('URL already from Cloudinary, no migration needed');
    }
    
    // Cek apakah URL valid
    try {
      new URL(imageUrl);
    } catch (error) {
      console.error('Invalid URL format:', imageUrl);
      throw new Error('Invalid URL format');
    }
    
    // Tambahkan header untuk menghindari CORS issues
    const headers = new Headers();
    headers.append('Accept', 'image/*');
    
    // Download gambar dari URL
    console.log('Downloading image from URL...');
    const response = await fetch(imageUrl, { 
      headers,
      mode: 'cors',
      cache: 'no-cache',
    });
    
    if (!response.ok) {
      console.error(`Failed to download image: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    
    // Cek content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      console.error(`Invalid content type: ${contentType}`);
      throw new Error(`Invalid content type: ${contentType}`);
    }
    
    // Convert ke blob
    const blob = await response.blob();
    console.log(`Downloaded image: ${blob.size} bytes, type: ${blob.type}`);
    
    // Jika blob kosong atau terlalu kecil, kemungkinan error
    if (blob.size < 100) {
      console.error('Downloaded image is too small or empty');
      throw new Error('Downloaded image is too small or empty');
    }
    
    // Extract filename from URL
    let filename = 'migrated-image';
    try {
      const urlPath = new URL(imageUrl).pathname;
      const pathSegments = urlPath.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (lastSegment && lastSegment.includes('.')) {
        filename = lastSegment;
      }
    } catch (e) {
      // Fallback to default name
    }
    
    // Convert ke File
    const file = new File([blob], filename, { type: blob.type });
    
    // Upload ke Cloudinary menggunakan smart upload
    console.log('Uploading to Cloudinary...');
    const result = await smartUploadToCloudinary(file);
    
    console.log('Migration successful:', result);
    return result;
  } catch (error) {
    console.error('Migration error:', error);
    throw new Error(`Failed to migrate image: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Fungsi untuk mendapatkan URL yang dioptimasi dari Cloudinary
export const getOptimizedUrl = (url: string, options: {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale';
  quality?: number;
} = {}) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'res.cloudinary.com') {
      // Jika sudah URL Cloudinary, tambahkan transformasi
      const pathParts = parsedUrl.pathname.split('/');
      const uploadIndex = pathParts.indexOf('upload');
      if (uploadIndex !== -1) {
        const { width, height, crop = 'fill', quality = 'auto' } = options;
        const transformations = [
          crop && `c_${crop}`,
          width && `w_${width}`,
          height && `h_${height}`,
          quality && `q_${quality}`,
        ].filter(Boolean).join(',');

        pathParts.splice(uploadIndex + 1, 0, transformations);
        parsedUrl.pathname = pathParts.join('/');
      }
    }
    return parsedUrl.toString();
  } catch {
    return url;
  }
};

// Fungsi untuk menghapus gambar dari Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await generateSignature(publicId, timestamp);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
          timestamp: timestamp,
          signature: signature,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete image from Cloudinary');
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

// Helper function untuk generate signature
const generateSignature = async (publicId: string, timestamp: number): Promise<string> => {
  const message = `public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Helper function untuk mendapatkan public_id dari URL Cloudinary
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'res.cloudinary.com') {
      const pathParts = parsedUrl.pathname.split('/');
      const uploadIndex = pathParts.indexOf('upload');
      if (uploadIndex !== -1) {
        // Get everything after 'upload' and before any transformations
        const publicIdWithExtension = pathParts.slice(uploadIndex + 2).join('/');
        // Remove file extension
        return publicIdWithExtension.replace(/\.[^/.]+$/, '');
      }
    }
    return null;
  } catch {
    return null;
  }
};

// Function to upload via server-side endpoint for large files
export const uploadToCloudinaryViaServer = async (file: File): Promise<CloudinaryUploadResult> => {
  // Create form data for the server endpoint
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    console.log('Using server-side upload for large file:', { 
      fileSize: file.size,
      fileType: file.type 
    });
    
    // Set a timeout of 2 minutes for the server request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);
    
    const response = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || `Server upload failed: ${response.status} ${response.statusText}`;
      console.error('Server upload error:', errorData || response.statusText);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (!data.success || !data.result) {
      throw new Error('Server returned success: false or missing result');
    }
    
    return data.result;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Server upload timed out after 120 seconds');
      throw new Error('Upload timed out. The server took too long to process your request.');
    }
    console.error('Server upload error:', error);
    throw new Error(error.message || 'Failed to upload to Cloudinary via server');
  }
};

// Helper function to choose the best upload method based on file size
export const smartUploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  // If file is larger than 2MB, use server-side upload
  if (file.size > 2 * 1024 * 1024) {
    return uploadToCloudinaryViaServer(file);
  } else {
    return uploadToCloudinary(file);
  }
};

// Helper function to validate Cloudinary URLs
export const isValidCloudinaryUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    // Trim the URL
    const trimmedUrl = url.trim();
    
    // Parse the URL
    const parsedUrl = new URL(trimmedUrl);
    
    // Check if it's a Cloudinary URL
    const isCloudinaryUrl = parsedUrl.hostname === 'res.cloudinary.com';
    
    // Check if it has a valid protocol
    const hasValidProtocol = parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    
    return isCloudinaryUrl && hasValidProtocol;
  } catch (error) {
    console.error('Error validating Cloudinary URL:', error, 'for URL:', url);
    return false;
  }
};

// Helper function to validate any image URL
export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // Handle relative URLs (starting with /)
  if (url.startsWith('/')) {
    return true;
  }
  
  // Handle URLs that start with @ (special case for our app)
  if (url.startsWith('@')) {
    // Remove the @ prefix and validate the remaining URL
    const cleanUrl = url.substring(1);
    try {
      new URL(cleanUrl);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  try {
    // Trim the URL
    const trimmedUrl = url.trim();
    
    // Parse the URL
    const parsedUrl = new URL(trimmedUrl);
    
    // Check if it has a valid protocol
    const hasValidProtocol = parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    
    if (!hasValidProtocol) {
      return false;
    }
    
    // Check if it's from a known image hosting service
    const knownImageHosts = [
      'res.cloudinary.com',
      'i.ibb.co',
      'ibb.co',
      'images.unsplash.com',
      'img.youtube.com',
      'i.imgur.com',
      'imgur.com',
      'localhost',
      'ftcctrtnvcytcuuljjik.supabase.co'
    ];
    
    const isKnownHost = knownImageHosts.includes(parsedUrl.hostname);
    
    // Check if it has a common image extension
    const path = parsedUrl.pathname.toLowerCase();
    const hasImageExtension = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'].some(ext => 
      path.endsWith(ext)
    );
    
    // For Cloudinary URLs, they don't always have an extension
    const isCloudinaryUrl = parsedUrl.hostname === 'res.cloudinary.com';
    
    // Always accept Cloudinary URLs as they're our primary image host
    if (isCloudinaryUrl) {
      return true;
    }
    
    // Either it should have an image extension or be from a known host
    return hasValidProtocol && (hasImageExtension || isKnownHost);
  } catch (error) {
    return false;
  }
};