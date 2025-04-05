import { Category } from "@/app/admin/categories/categories.types";

export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  available: boolean;
};

export type ProductBase = {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  price: number | null;
  maxQuantity: number;
  heroImage: string;
  category: number;
};

export type ProductWithVariants = ProductBase & {
  variants: ProductVariant[] | null;
};

export type ProductWithCategory = ProductWithVariants & {
  category: Category;
};

export type FormProductVariant = {
  id?: string; // Optional for new variants
  name: string;
  price: string; // Different type for form
  available?: boolean;
};

export type FormProductValues = {
  title: string;
  price: string;
  maxQuantity: string;
  category: string;
  heroImage: any;
  variants?: FormProductVariant[];
  slug?: string;
  intent?: "create" | "update";
};

export type ProductsResponse = ProductWithVariants[];
export type ProductsWithCategoriesResponse = ProductWithCategory[];

export type UpdateProductSchema = {
  category: number;
  heroImage: string;
  maxQuantity: number;
  price: number | null;
  slug: string;
  title: string;
};
