'use server';

import { createClient } from "@/supabase/client";

const supabase = createClient();

export const getOrdersWithProducts = async () => {
    const {data, error} = await supabase
    .from('order')
    .select('*, order_item:order_item(*, product(*)), user(*)')
    .order('created_at', {ascending: true});

    if(error) throw new Error(error.message);
    
    return data;
}
