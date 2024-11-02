'use server';

import slugify from "slugify";

import { createClient } from "@/supabase/client";
import {
    ProductWithCategoriesResponse,
    UpdateProductSchema,
} from "@/app/admin/products/products.types";
import { CreateProductSchemaServer } from "@/app/admin/products/schema";

const supabase = createClient();

export const getProductsWithCategories = 
    async (): Promise<ProductWithCategoriesResponse> => {
        const { data, error } = await supabase
            .from("product")
            .select('*, category:category(*)')
            .returns<ProductWithCategoriesResponse>();

        if (error) {
            throw new Error(`Error Fetching products with categories: ${error.message}`);
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
    const slug = slugify(title, { lower: true });

    const { data, error } = await supabase
        .from("product")
        .insert({
            category,
            heroImage,
            imageUrl: images,
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
    imagesUrl,
    maxQuantity,
    price,
    slug,
    title,
}: UpdateProductSchema) => {
    const { data, error } = await supabase
        .from("product")
        .update({
            category,
            heroImage,
            imageUrl: imagesUrl,
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
    const { data, error } = await supabase
        .from("product")
        .delete()
        .match({
            slug,
        });

    if (error) {
        throw new Error(`Error deleting product: ${error.message}`);
    }

    return data;
};
