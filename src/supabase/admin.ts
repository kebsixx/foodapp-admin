// supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

export const createServiceRoleClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Gunakan SERVICE ROLE KEY bukan ANON KEY
  );
};