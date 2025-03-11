import { Category } from "@/app/admin/categories/categories.types";

export type ProductWithCategory = {
  category: Category;
  created_at: string;
  heroImage: string;
  id: number;
  maxQuantity: number;
  price: number | null;
  title: string;
  slug: string;
  variants: {
    id: number;
    name: string;
    price: number;
  }[];
};

export type ProductsWithCategoriesResponse = ProductWithCategory[];

export type UpdateProductSchema = {
  category: number;
  heroImage: string;
  maxQuantity: number;
  price: number | null;
  slug: string;
  title: string;
};
