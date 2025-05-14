"use server";

import slugify from "slugify";
import { createClient } from "@/supabase/server";
import {
  ProductsWithCategoriesResponse,
  UpdateProductSchema,
} from "@/app/admin/products/products.types";
import { ProductsResponse } from "@/app/products.types";
import { CreateProductSchemaServer } from "@/app/admin/products/schema";

export const getProducts = async (): Promise<ProductsResponse> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("product").select("*");
  if (error) {
    throw new Error(`Error Fetching products: ${error.message}`);
  }
  return data || [];
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
    return data || [];
  };

export const createProduct = async (product: {
  title: string;
  category: number;
  price: number;
  maxQuantity: number;
  heroImage?: string;
  variants?: { 
    id: string;
    name: string; 
    price: number;
    available: boolean;
  }[];
}) => {
  if (!product.heroImage) {
    throw new Error("Hero image is required");
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("product")
    .insert([{
      title: product.title,
      category: product.category,
      price: product.price,
      maxQuantity: product.maxQuantity,
      heroImage: product.heroImage,
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
  slug: string;
  oldHeroImage?: string;
  variants?: {
    id: string;
    name: string; 
    price: number;
    available: boolean;
  }[];
}) => {
  const supabase = createClient();
  
  // Hapus gambar lama jika ada dan berbeda dengan yang baru
  if (product.oldHeroImage && product.oldHeroImage !== product.heroImage) {
    try {
      // Ekstrak nama file dari URL gambar lama
      const oldImagePath = product.oldHeroImage.split('/').pop();
      if (oldImagePath) {
        await supabase
          .storage
          .from('product-images') // Sesuaikan dengan nama bucket Anda
          .remove([oldImagePath]);
      }
    } catch (error) {
      console.error('Error deleting old image:', error);
      // Lanjutkan proses update meskipun gagal menghapus gambar lama
    }
  }

  const variants = product.variants 
    ? product.variants.map(v => ({
        ...v,
        available: v.available ?? true
      }))
    : null;

  const updateData = {
    title: product.title,
    category: product.category,
    price: product.price,
    maxQuantity: product.maxQuantity,
    variants,
    ...product.heroImage && { heroImage: product.heroImage },
  }

  const { data, error } = await supabase
    .from("product")
    .update(updateData)
    .eq("slug", product.slug)
    .select();

  if (error) throw new Error(`Error updating product: ${error.message}`);
  return data;
};

export const deleteProduct = async (slug: string, heroImage?: string) => {
  const supabase = createClient();
  
  // Hapus gambar produk jika ada
  if (heroImage) {
    try {
      const imagePath = heroImage.split('/').pop();
      if (imagePath) {
        await supabase
          .storage
          .from('product-images')
          .remove([imagePath]);
      }
    } catch (error) {
      console.error('Error deleting product image:', error);
      // Lanjutkan proses delete meskipun gagal menghapus gambar
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