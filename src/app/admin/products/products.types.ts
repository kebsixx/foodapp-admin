import { Category } from "@/app/admin/categories/categories.types";

export type ProductWithCategory = {
    category: Category;
    created_at: string;
    heroImage: string;
    id: number;
    imageUrl: string[];
    maxQuantity: number;
    price: number | null;
    title: string;
    slug: string;
};

export type ProductWithCategoriesResponse = ProductWithCategory[];

export type UpdateProductSchema = {
    category: number;
    heroImage: string;
    imagesUrl: string[];
    maxQuantity: number;
    price: number;
    slug: string;
    title: string;
}