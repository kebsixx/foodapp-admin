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

  const { data, error } = await supabase
    .from("product")
    .select("*");

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
      throw new Error(
        `Error Fetching products with categories: ${error.message}`
      );
    }

    return data || [];
  };

export const createProduct = async (product: {
    title: string;
    category: number;
    price: number;
    maxQuantity: number;
    heroImage: string;
    variants?: { 
      id: string;
      name: string; 
      price: number;
      available: boolean;
    }[];
  }) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("product")
      .insert([
        {
          title: product.title,
          category: product.category,
          price: product.price,
          maxQuantity: product.maxQuantity,
          heroImage: product.heroImage,
          slug: slugify(product.title, { lower: true }),
          variants: product.variants 
          ? product.variants.map(v => ({
              ...v,
              available: v.available ?? true // Ensure available is set
            }))
          : null,
        },
      ])
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
    heroImage: string;
    slug: string;
    variants?: {
      id: string;
      name: string; 
      price: number;
      available: boolean;
    }[];
  }) => {
    const supabase = createClient();
    
    // Pastikan variants tidak undefined
    const variants = product.variants 
      ? product.variants.map(v => ({
          ...v,
          available: v.available ?? true // Ensure available is set
        }))
      : null;
  
    const { data, error } = await supabase
      .from("product")
      .update({
        title: product.title,
        category: product.category,
        price: product.price,
        maxQuantity: product.maxQuantity,
        heroImage: product.heroImage,
        variants
      })
      .eq("slug", product.slug)
      .select();
  
    if (error) throw new Error(`Error updating product: ${error.message}`);
    return data;
  };

export const deleteProduct = async (slug: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.from("product").delete().match({
    slug,
  });

  if (error) {
    throw new Error(`Error deleting product: ${error.message}`);
  }

  return data;
};
