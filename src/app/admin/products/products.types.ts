import { Category } from "@/app/admin/categories/categories.types";

export type ProductImageUrls = {
  original?: string;
  display?: string;
  medium?: string;
  thumb?: string;
};

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
  heroImage: string | null;
  heroImageUrls?: ProductImageUrls;
  category: number;
};

export type ProductWithVariants = ProductBase & {
  variants: ProductVariant[] | null;
};

export type ProductWithCategory = {
  id: number;
  title: string;
  slug: string;
  price: number | null;
  maxQuantity: number;
  heroImage: string | null;
  heroImageUrls?: ProductImageUrls;
  created_at: string;
  category: {
    id: number;
    name: string;
  };
  variants?: ProductVariant[];
};

export type FormProductVariant = {
  id?: string; 
  name: string;
  price: string; 
  available: boolean;
};

export type FormProductValues = {
  title: string;
  category: string;
  price: string;
  maxQuantity: string;
  heroImage: string;
  heroImageUrls?: ProductImageUrls;
  variants?: {
    id: string;
    name: string;
    price: string;
    available: boolean;
  }[];
  intent?: "create" | "update";
  slug?: string;
};

export type ProductsResponse = ProductWithVariants[];
export type ProductsWithCategoriesResponse = ProductWithCategory[];

export type UpdateProductSchema = {
  category: number;
  heroImage?: string;
  heroImageUrls?: ProductImageUrls;
  maxQuantity: number;
  price: number | null;
  slug: string;
  title: string;
  variants?: ProductVariant[];
};