'use server';

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { sendOrderNotification } from "./notifications";

export const getOrdersWithProducts = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('order')
        .select(`
            *,
            order_items:order_item(
                *,
                product(*)
            ),
            users(
                id, 
                name,
                phone,
                email,
                address
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Failed to fetch orders: ' + error.message);
    }
    
    // Map the data to ensure user info is available
    const mappedData = data?.map(order => ({
        ...order,
        user: order.users || { name: 'No Name', phone: '-' }
    }));
    
    return mappedData;
}

export const updateOrderStatus = async (orderId: number, status: string) => {
  const supabase = createClient();
  
  // Update status
  const { error } = await supabase
    .from('order')
    .update({ status })
    .eq('id', orderId);

  if (error) throw new Error(error.message);

  // Kirim notifikasi ke pemilik order
  await sendOrderNotification(orderId, status);

  revalidatePath('/admin/orders');
};

export const getMonthlyOrders = async () => {
    const supabase = createClient();
    const {data, error} = await supabase.from('order').select('created_at');

    if (error) throw new Error(error.message);

    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    const ordersByMonth = data.reduce(
        (acc: Record<string, number>, order: {created_at: string}) => {
            const date = new Date(order.created_at);
            const month = monthNames[date.getUTCMonth()];

            if (!acc[month]) acc[month] = 0;
            acc[month]++;

            return acc;
        },
        {}
    );

    return Object.keys(ordersByMonth).map((month) => ({
        name: month,
        orders: ordersByMonth[month],
    }));
}
