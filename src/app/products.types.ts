export type Products = {
  id: number;
  category: number;
  heroImage: string;
  imagesUrl: string[];
  maxQuantity: number;
  price: number;
  slug: string;
  title: string;
  created_at: string;
}

export type ProductsResponse = Products[];
