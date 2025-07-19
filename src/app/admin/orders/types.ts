import { createClient } from "@/supabase/server";
import { QueryData } from "@supabase/supabase-js";

// Define base types matching your database schema
export type User = {
  id: string;
  email: string;
  type: 'USER' | 'ADMIN';
  create_at: string;
  expo_notification_token: string | null;
  address: string | null;
  name: string | null;
  phone: string | null;
  gender: boolean | null;
  updated_at: string | null;
  username: string | null;
};

export type Order = {
  id: number;
  created_at: string;
  status: string;
  description: string | null;
  user: string; // Foreign key to users table
  slug: string;
  totalPrice: number;
  pickup_method: 'pickup' | 'delivery' | null;
  payment_proof: string | null;
  order_items: OrderItem[];
  users: User | null; // Joined user data
};

export type OrderItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    price: number | null;
    heroImage: string;
    maxQuantity: number;
    category: number;
    slug: string;
    variants?: any;
  };
};

const supabase = createClient();

const ordersWithProductsQuery = supabase
  .from('order')
  .select(`
    *,
    user:users(*),
    order_items:order_item(
      *,
      product(*)
    )
  `)
  .order('created_at', { ascending: false });

export type OrdersWithProducts = QueryData<typeof ordersWithProductsQuery>;
