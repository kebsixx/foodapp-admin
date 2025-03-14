"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";
import { Switch } from "@/components/ui/switch";

export const StoreToggle = () => {
  const [isOpen, setIsOpen] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getStoreStatus = async () => {
      const { data } = await supabase
        .from("store_settings")
        .select("is_open")
        .single();

      console.log("Initial store status:", data);
      if (data) setIsOpen(data.is_open!);
    };
    getStoreStatus();
  }, [supabase]);

  const toggleStore = async () => {
    console.log("Toggling store to:", !isOpen);

    const { data: settings } = await supabase
      .from("store_settings")
      .select("id")
      .not("id", "is", null)
      .single();

    if (settings) {
      const { error } = await supabase
        .from("store_settings")
        .update({ is_open: !isOpen })
        .eq("id", settings.id)
        .select();

      if (!error) setIsOpen(!isOpen);
    }

    const { data, error } = await supabase
      .from("store_settings")
      .update({ is_open: !isOpen })
      .eq("id", "1")
      .select();

    console.log("Toggle response:", data, error);
    if (!error) setIsOpen(!isOpen);
  };

  return (
    <div className="flex items-center gap-2 ml-auto">
      <div className="flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full ${
            isOpen ? "bg-green-500 animate-pulse" : "bg-red-500 animate-pulse"
          }`}
        />
        <span
          className={`font-medium ${
            isOpen ? "text-green-500" : "text-red-500"
          }`}>
          {isOpen ? "Open" : "Closed"}
        </span>
      </div>
      <Switch checked={isOpen} onCheckedChange={toggleStore} />
    </div>
  );
};
