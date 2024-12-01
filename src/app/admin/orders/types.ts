import { createClient } from "@/supabase/server";
import { QueryData } from "@supabase/supabase-js";

const supabase = createClient();

const odersWithProductsQuery = supabase
    .from('order')
    .select('*, order_items:order_item(*, product(*)), user(*)')
    .order('created_at', {ascending: true});

export type OrdersWithProducts = QueryData<typeof odersWithProductsQuery>;
