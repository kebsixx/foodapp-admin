'use server';

import { createClient } from "@/supabase/server";

export const authenticate = async (email: string, password: string) => {
  const supabase = createClient();

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('type')
      .eq('id', authData.user?.id)
      .single();

    if (userError) throw userError;

    if (userData.type !== 'ADMIN') {
      // Sign out if not admin
      await supabase.auth.signOut();
      throw new Error('Access denied. Admin privileges required.');
    }

  } catch (error) {
    console.log("AUTHENTICATION ERROR", error);
    throw error;
  }
};

export const getLatestUsers = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select('id, email, create_at')
    .order('create_at', { ascending: false })
    .limit(5);

  if (error) throw new Error(`Error fetching latest users: ${error.message}`);

  return data.map(
    (user: { id: string; email: string; create_at: string | null }) => ({
      id: user.id,
      email: user.email,
      date: user.create_at,
    })
  );
};
