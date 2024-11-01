export type Product = {
    id: number;
    title: string;
    slug: string;
    imageUrl: string[];
    price: number;
    heroImage: string;
    category: number;
    maxQuantity: number;
};

export type CategoryWithProducts = {
    created_at: string;
    id: number;
    imageUrl: string;
    name: string;
    products: Product[];
    slug: string;
};

export type CategoriesWithProductsResponse = CategoryWithProducts[];

