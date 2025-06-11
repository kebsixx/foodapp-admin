"use server";

import slugify from "slugify";

import { CategoriesWithProductsResponse, Category } from "@/app/admin/categories/categories.types";
import {
  CreateCategorySchemaServer,
} from "@/app/admin/categories/create-category.schema";
import { createClient } from "@/supabase/server";
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/cloudinary";

export const getCategoriesWithProducts =
  async (): Promise<CategoriesWithProductsResponse> => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("category")
      .select("*, products:product(*)")
      .returns<CategoriesWithProductsResponse>();

    if (error) throw new Error(`Error fetching categories: ${error.message}`);

    return data || [];
  };

export const imageUploadHandler = async (formData: FormData) => {
  const supabase = createClient();

  if (!formData) return;

  const fileEntry = formData.get("file");

  if (!(fileEntry instanceof File)) throw new Error("Expected a file");

  const fileName = fileEntry.name;

  try {
    const { data, error } = await supabase.storage
      .from("app-images")
      .upload(fileName, fileEntry, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.log("Error uploading Image", error);
      throw new Error("Error uploading Image");
    }

    const {
      data: { publicUrl },
    } = await supabase.storage.from("app-images").getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.log("Error uploading Image", error);
    throw new Error("Error uploading Image");
  }
};

const deleteImageFromBucket = async (imageUrl: string) => {
  const supabase = createClient();
  const fileName = imageUrl.split("/").pop(); // Ambil nama file dari URL
  if (!fileName) return;

  const { error } = await supabase.storage
    .from("app-images")
    .remove([fileName]);

  if (error) throw new Error(`Error deleting image: ${error.message}`);
};

export const getCategories = async (): Promise<Category[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("category").select("*");
  if (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
  return data;
};

export const createCategory = async (category: {
  name: string;
  imageUrl?: string;
}) => {
  const supabase = createClient();
  const slug = slugify(category.name, { lower: true });
  
  // Jika imageUrl tidak ada, gunakan string kosong
  const imageUrl = category.imageUrl || "";
  
  const { data, error } = await supabase
    .from("category")
    .insert({
      name: category.name,
      imageUrl: imageUrl,
      slug,
    })
    .select();

  if (error) {
    throw new Error(`Error creating category: ${error.message}`);
  }
  return data;
};

export const updateCategory = async (category: {
  id: number;
  name: string;
  imageUrl?: string;
}) => {
  const supabase = createClient();

  try {
    // Get the current category to check for old image
    const { data: currentCategory, error: fetchError } = await supabase
    .from("category")
    .select("imageUrl")
      .eq("id", category.id)
    .single();

    if (fetchError) {
      throw new Error(`Error fetching current category: ${fetchError.message}`);
    }

    // Delete old image if it exists and is from Cloudinary
    if (currentCategory?.imageUrl && category.imageUrl && currentCategory.imageUrl !== category.imageUrl) {
      const oldPublicId = getPublicIdFromUrl(currentCategory.imageUrl);
      if (oldPublicId) {
        try {
          await deleteFromCloudinary(oldPublicId);
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
          // Continue with update even if image deletion fails
        }
      }
    }

    // Jika imageUrl tidak ada, gunakan string kosong atau nilai sebelumnya
    const imageUrl = category.imageUrl || currentCategory?.imageUrl || "";

    const { data, error } = await supabase
      .from("category")
      .update({
        name: category.name,
        imageUrl: imageUrl,
      })
      .eq("id", category.id)
      .select();

    if (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error("Category not found");
    }

    return data;
  } catch (error) {
    console.error('Update category error:', error);
    throw error;
  }
};

export const deleteCategory = async (id: number, imageUrl?: string) => {
  const supabase = createClient();
  
  // Delete image from Cloudinary if it exists
  if (imageUrl) {
    const publicId = getPublicIdFromUrl(imageUrl);
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Continue with category deletion even if image deletion fails
      }
    }
  }

  const { data, error } = await supabase
    .from("category")
    .delete()
    .match({ id });

  if (error) {
    throw new Error(`Error deleting category: ${error.message}`);
  }
  return data;
};

export const getCategoryData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("category").select("name, products:product(id)");

  if (error) throw new Error(`Error fetching category data: ${error.message}`);

  const categoryData = data.map(
    (category: {name: string; products: { id: number }[] }) => ({
      name: category.name,
      products: category.products.length,
    })
  );

  return categoryData;
}
