// actions/delete-account.ts
"use server";

import { createClient } from "@/supabase/server";
import { createServiceRoleClient } from "@/supabase/admin";

export const deleteUserAccount = async (email: string, password: string) => {
  const supabase = createClient();
  
  // 1. Verifikasi user
  const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.error("Authentication failed:", authError.message);
    throw new Error("Email atau password salah");
  }

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  // 2. Gunakan Service Role Client untuk penghapusan
  const supabaseAdmin = createServiceRoleClient();
  
  // 3. Hapus user dari auth
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
  
  if (deleteError) {
    console.error("Failed to delete auth user:", deleteError.message);
    throw new Error("Gagal menghapus akun: " + deleteError.message);
  }

  // 4. Hapus data terkait di database (opsional)
  const { error: dbError } = await supabaseAdmin
    .from("users")
    .delete()
    .eq("id", user.id);

  if (dbError) {
    console.error("Failed to delete user data:", dbError.message);
    // Tidak throw error karena auth user sudah terhapus
  }

  // 5. Sign out user setelah penghapusan
  await supabase.auth.signOut();

  return { success: true };
};