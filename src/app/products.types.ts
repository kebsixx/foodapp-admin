export type Products = {
  id: number;
  category: number;
  heroImage: string;
  maxQuantity: number;
  price: number | null;
  slug: string;
  title: string;
  created_at: string;
}

export type ProductsResponse = Products[];
