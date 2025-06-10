"use server";

import slugify from "slugify";
import { createClient } from "@/supabase/server";
import {
  ProductsWithCategoriesResponse,
  UpdateProductSchema,
} from "@/app/admin/products/products.types";
import { ProductsResponse } from "@/app/products.types";
import { deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/cloudinary";

export const getProducts = async (): Promise<ProductsResponse> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("product").select("*");
  if (error) {
    throw new Error(`Error Fetching products: ${error.message}`);
  }
  
  // Filter out products with obviously broken URLs
  const validProducts = (data || []).filter(product => {
    if (!product.heroImage) return true; // Allow products without images
    
    // Check for common broken URL patterns
    const brokenPatterns = [
      'adaptive-icon',
      'undefined',
      'null',
      'localhost',
      'file://',
    ];
    
    return !brokenPatterns.some(pattern => 
      product.heroImage?.toLowerCase().includes(pattern)
    );
  });
  
  return validProducts;
};

export const getProductsWithCategories = 
  async (): Promise<ProductsWithCategoriesResponse> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("product")
      .select("*, category:category(*)")
      .returns<ProductsWithCategoriesResponse>();
    if (error) {
      throw new Error(`Error Fetching products with categories: ${error.message}`);
    }
    
    // Filter out products with obviously broken URLs
    const validProducts = (data || []).filter(product => {
      if (!product.heroImage) return true; // Allow products without images
      
      // Check for common broken URL patterns
      const brokenPatterns = [
        'adaptive-icon',
        'undefined',
        'null',
        'localhost',
        'file://',
      ];
      
      return !brokenPatterns.some(pattern => 
        product.heroImage?.toLowerCase().includes(pattern)
      );
    });
    
    return validProducts;
  };

export const createProduct = async (product: {
  title: string;
  category: number;
  price: number;
  maxQuantity: number;
  heroImage?: string;
  heroImageUrls?: {
    original?: string;
    display?: string;
    medium?: string;
    thumb?: string;
  };
  variants?: { 
    id: string;
    name: string; 
    price: number;
    available: boolean;
  }[];
}) => {
  // Validate image URL if provided
  if (product.heroImage && product.heroImage.trim() !== "") {
    try {
      const url = new URL(product.heroImage);
      if (!url.protocol.startsWith('http')) {
        throw new Error("Invalid image URL protocol");
      }
    } catch {
      throw new Error("Invalid image URL");
    }
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("product")
    .insert([{
      title: product.title,
      category: product.category,
      price: product.price,
      maxQuantity: product.maxQuantity,
      heroImage: product.heroImage || null,
      heroImageUrls: product.heroImageUrls || null,
      slug: slugify(product.title, { lower: true }),
      variants: product.variants 
        ? product.variants.map(v => ({
            ...v,
            available: v.available ?? true
          }))
        : null,
    }])
    .select();
  
  if (error) {
    throw new Error(`Error creating product: ${error.message}`);
  }
  return data;
};

export const updateProduct = async (product: {
  title: string;
  category: number;
  price: number;
  maxQuantity: number;
  heroImage?: string;
  heroImageUrls?: {
    original?: string;
    display?: string;
    medium?: string;
    thumb?: string;
  };
  slug: string;
  variants?: {
    id: string;
    name: string; 
    price: number;
    available: boolean;
  }[];
}) => {
  const supabase = createClient();

  try {
    // Get the current product to check for old image
    const { data: currentProduct, error: fetchError } = await supabase
      .from("product")
      .select("heroImage")
      .eq("slug", product.slug)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching current product: ${fetchError.message}`);
    }

    const variants = product.variants 
      ? product.variants.map(v => ({
          ...v,
          available: v.available ?? true
        }))
      : null;

    const updateData: any = {
      title: product.title,
      category: product.category,
      price: product.price,
      maxQuantity: product.maxQuantity,
      variants,
    };

    // Only update heroImage if provided and valid
    if (product.heroImage && product.heroImage.trim() !== "") {
      try {
        const url = new URL(product.heroImage);
        if (!url.protocol.startsWith('http')) {
          throw new Error("Invalid image URL protocol");
        }
        updateData.heroImage = product.heroImage;
        
        // Delete old image if it exists and is from Cloudinary
        if (currentProduct?.heroImage) {
          const oldPublicId = getPublicIdFromUrl(currentProduct.heroImage);
          if (oldPublicId) {
            try {
              await deleteFromCloudinary(oldPublicId);
            } catch (deleteError) {
              console.error('Error deleting old image:', deleteError);
              // Continue with update even if image deletion fails
            }
          }
        }
      } catch (urlError) {
        throw new Error("Invalid image URL");
      }
    }

    const { data, error } = await supabase
      .from("product")
      .update(updateData)
      .eq("slug", product.slug)
      .select();

    if (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error("Product not found");
    }

    return data;
  } catch (error) {
    console.error('Update product error:', error);
    throw error;
  }
};

export const deleteProduct = async (slug: string, heroImage?: string) => {
  const supabase = createClient();
  
  // Delete image from Cloudinary if it exists
  if (heroImage) {
    const publicId = getPublicIdFromUrl(heroImage);
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Continue with product deletion even if image deletion fails
      }
    }
  }

  const { data, error } = await supabase
    .from("product")
    .delete()
    .match({ slug });

  if (error) {
    throw new Error(`Error deleting product: ${error.message}`);
  }
  return data;
};

// Helper function untuk upload gambar ke ImgBB
export const uploadImageToImgBB = async (formData: FormData): Promise<{
  url: string;
  urls: {
    original: string;
    display: string;
    medium: string;
    thumb: string;
  };
}> => {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    // Convert file to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
    });

    // Upload to ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', base64);
    imgbbFormData.append('key', process.env.IMGBB_API_KEY!);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imgbbFormData,
    });

    const result = await response.json();

    if (result.success) {
      const data = result.data;
      
      // Validate ImgBB URLs
      const validateUrl = (url: string) => {
        if (!url) return false;
        try {
          const parsedUrl = new URL(url);
          return parsedUrl.hostname === 'i.ibb.co' || parsedUrl.hostname === 'ibb.co';
        } catch {
          return false;
        }
      };

      // Validate all URLs
      const urls = {
        original: data.url,
        display: data.display_url || data.url,
        medium: data.medium?.url || data.url,
        thumb: data.thumb?.url || data.url,
      };

      // Check if all URLs are valid
      const allUrlsValid = Object.values(urls).every(validateUrl);
      if (!allUrlsValid) {
        console.error('Invalid ImgBB URLs received:', urls);
        throw new Error('Received invalid image URLs from ImgBB');
      }

      return {
        url: data.url,
        urls
      };
    } else {
      throw new Error(result.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw new Error('Failed to upload image to ImgBB');
  }
};

// Fungsi untuk memperbarui URL gambar produk
export const updateProductImage = async (slug: string, newImageUrl: string, newImageUrls?: {
  original?: string;
  display?: string;
  medium?: string;
  thumb?: string;
}) => {
  const supabase = createClient();

  const updateData = {
    heroImage: newImageUrl,
    // Remove heroImageUrls from the update
    // heroImageUrls: newImageUrls || null,
  };

  const { data, error } = await supabase
    .from("product")
    .update(updateData)
    .eq("slug", slug)
    .select();

  if (error) {
    throw new Error(`Error updating product image: ${error.message}`);
  }

  return data;
};