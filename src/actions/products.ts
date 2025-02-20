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

export const createProduct = async ({
  category,
  heroImage,
  images,
  maxQuantity,
  price,
  title,
}: CreateProductSchemaServer) => {
  const supabase = createClient();
  const slug = slugify(title, { lower: true });

  const { data, error } = await supabase.from("product").insert({
    category,
    heroImage,
    imagesUrl: images,
    maxQuantity,
    price,
    slug,
    title,
  });

  if (error) {
    throw new Error(`Error creating product: ${error.message}`);
  }

  return data;
};

export const updateProduct = async ({
  category,
  heroImage,
  maxQuantity,
  price,
  slug,
  title,
}: UpdateProductSchema) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("product")
    .update({
      category,
      heroImage,
      maxQuantity,
      price,
      title,
    })
    .match({
      slug,
    });

  if (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }

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
