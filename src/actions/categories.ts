"use server";

import slugify from "slugify";

import { CategoriesWithProductsResponse } from "@/app/admin/categories/categories.types";
import {
  CreateCategorySchemaServer,
  UpdateCategorySchema,
  updateCategorySchema,
} from "@/app/admin/categories/create-category.schema";
import { createClient } from "@/supabase/server";

const supabase = createClient();

export const getCategoriesWithProducts =
  async (): Promise<CategoriesWithProductsResponse> => {
    const { data, error } = await supabase
      .from("category")
      .select("*, products:product(*)")
      .returns<CategoriesWithProductsResponse>();

    if (error) throw new Error(`Error fetching categories: ${error.message}`);

    return data || [];
  };

export const imageUploadHandler = async (formData: FormData) => {
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

export const createCategory = async ({
  imageUrl,
  name,
}: CreateCategorySchemaServer) => {
  const slug = slugify(name, { lower: true });

  const { data, error } = await supabase.from("category").insert({
    name,
    imageUrl,
    slug,
  });

  if (error) throw new Error(`Error creating category: ${error.message}`);

  return data;
};

export const updateCategory = async ({
  imageUrl,
  name,
  slug,
}: UpdateCategorySchema) => {
  const { data, error } = await supabase
    .from("category")
    .update({
      name,
      imageUrl,
    })
    .match({ slug });

  if (error) throw new Error(`Error updating category: ${error.message}`);

  return data;
};

export const deleteCategory = async (id: number) => {
  const { error } = await supabase.from("category").delete().match({ id });

  if (error) throw new Error(`Error deleting category: ${error.message}`);
};
