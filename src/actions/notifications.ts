'use server';

import { createClient } from "@/supabase/server";

async function sendPushNotification({
  expoPushToken, 
  title, 
  body,
  data
}: {
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, any>
}) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data: data || {},
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    return await response.json();
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

export const getUserNotificationToken = async (userId: string) => {
    const supabase = createClient();  
    const {data, error} = await supabase
        .from('users')
        .select('expo_notification_token')
        .eq('id', userId)
        .single();
    
    if(error) throw new Error(error.message);

    return data;
}

export const sendOrderNotification = async (orderId: number, status: string) => {
  const supabase = createClient();
  
  // 1. Get order and user info
  const { data: order, error: orderError } = await supabase
    .from('order')
    .select(`
      id,
      slug,
      user,
      status,
      users:users!order_user_fkey(id, expo_notification_token)
    `)
    .eq('id', orderId)
    .single();

  if (orderError) {
    console.error('Error fetching order:', orderError);
    throw new Error('Failed to fetch order data');
  }

  // 2. Verify notification token
  if (!order.users?.expo_notification_token) {
    console.warn(`User ${order.user} has no notification token`);
    return;
  }

  // 3. Send notification
  await sendPushNotification({
    expoPushToken: order.users.expo_notification_token,
    title: `Order #${order.slug} Update`,
    body: `Status changed to: ${status}`,
    data: {
      type: 'order-status-update',
      orderId: order.id,
    }
  });
};
