"use server";

import { createClient } from "@/supabase/server";

export type CustomerFeedback = {
  id: string;
  user_email: string | null;
  name: string | null;
  status: string | null;
  feedback: string;
  created_at: string;
  user_id: string | null;
};

export const getCustomerFeedbacks = async (): Promise<CustomerFeedback[]> => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("feedbacks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  }

  return data || [];
};