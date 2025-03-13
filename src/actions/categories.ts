"use server";

import slugify from "slugify";

import { CategoriesWithProductsResponse } from "@/app/admin/categories/categories.types";
import {
  CreateCategorySchemaServer,
  UpdateCategorySchema,
  updateCategorySchema,
} from "@/app/admin/categories/create-category.schema";
import { createClient } from "@/supabase/server";

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

const getCategoryImagePath = async (slug: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("category")
    .select("imageUrl")
    .eq("slug", slug)
    .single();

  if (error) throw new Error(`Error fetching category: ${error.message}`);
  return data?.imageUrl;
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

export const createCategory = async ({
  imageUrl,
  name,
}: CreateCategorySchemaServer) => {
  const supabase = createClient();

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
}: {
  imageUrl: string;
  name: string;
  slug: string;
}) => {
  const supabase = createClient();
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
  const supabase = createClient();

  // Ambil path gambar sebelum menghapus kategori
  const { data: category, error: fetchError } = await supabase
    .from("category")
    .select("imageUrl")
    .eq("id", id)
    .single();

  if (fetchError) throw new Error(`Error fetching category: ${fetchError.message}`);

  // Hapus gambar dari bucket jika ada
  if (category?.imageUrl) {
    await deleteImageFromBucket(category.imageUrl);
  }

  // Hapus kategori dari database
  const { error } = await supabase.from("category").delete().match({ id });

  if (error) throw new Error(`Error deleting category: ${error.message}`);
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
