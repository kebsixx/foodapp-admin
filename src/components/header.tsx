"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CircleUser, Menu, Package2, Bell } from "lucide-react"; // Import icon Bell
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { createClient } from "@/supabase/client";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
];

const StoreToggle = () => {
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
        .eq("id", settings.id) // Use the UUID instead of numeric ID
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

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchOrderCount = async () => {
      const { data, error } = await supabase
        .from("order")
        .select("id", { count: "exact" })
        .eq("status", "Pending");

      if (!error && data) {
        setOrderCount(data.length);
      }
    };

    fetchOrderCount();

    const orderChannel = supabase
      .channel("order-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order" },
        (payload) => {
          if (payload.new.status === "Pending") {
            setOrderCount((prevCount) => prevCount + 1);
            new Audio("/notification.mp3").play(); // Play notification sound
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Package2 className="h-6 w-6" />
        </Link>
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "hover:text-foreground text-muted-foreground flex items-center",
              {
                "text-foreground font-bold": pathname === href,
              }
            )}>
            {label}
            {href === "/admin/orders" && orderCount > 0 && (
              <div className="relative ml-6">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {orderCount}
                </span>
              </div>
            )}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold">
              <Package2 className="h-6 w-6" />
            </Link>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn("hover:text-foreground text-muted-foreground", {
                  "text-foreground font-bold": pathname === href,
                })}>
                {label}
                {href === "/admin/orders" && orderCount > 0 && (
                  <div className="relative ml-6">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {orderCount}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <StoreToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
