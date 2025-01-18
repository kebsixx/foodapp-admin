"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CircleUser, Menu, Moon, Package2, Sun } from "lucide-react";

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
      .eq("id", 1)
      .select();

    console.log("Toggle response:", data, error);
    if (!error) setIsOpen(!isOpen);
  };

  return (
    <div className="flex items-center gap-2 ml-auto">
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${
          isOpen 
            ? 'bg-green-500 animate-pulse' 
            : 'bg-red-500 animate-pulse'
        }`} />
        <span className={`font-medium ${
          isOpen 
            ? 'text-green-500' 
            : 'text-red-500'
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
  const { setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();

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
              "transition-colors hover:text-foreground text-muted-foreground",
              {
                "text-foreground font-bold": pathname === href,
              }
            )}>
            {label}
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
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full" variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
