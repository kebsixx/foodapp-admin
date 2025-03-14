"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CircleUser, Menu, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { createClient } from "@/supabase/client";
import { useEffect, useState, useTransition } from "react"; // Impor useTransition
import { StoreToggle } from "./store-toggle"; // Pastikan path-nya sesuai
import { Progress } from "@/components/ui/progress";
import ThemeToggle from "./theme-toggle";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
];

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [orderCount, setOrderCount] = useState(0);
  const [isPending, startTransition] = useTransition(); // Gunakan useTransition
  const [progress, setProgress] = useState(0); // State untuk progress bar

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
            new Audio("/notification.mp3").play();
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

  // Fungsi untuk menangani navigasi dengan progress bar
  const handleNavigation = (href: string) => {
    setProgress(0); // Reset progress ke 0
    startTransition(() => {
      // Mulai navigasi
      router.push(href);

      // Update progress secara bertahap
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval); // Hentikan interval saat progress mencapai 100
            return 100;
          }
          return prevProgress + 10; // Tambahkan 10 setiap interval
        });
      }, 100); // Update setiap 100ms
    });
  };

  return (
    <>
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
              onClick={(e) => {
                e.preventDefault(); // Mencegah navigasi default
                handleNavigation(href); // Gunakan handleNavigation
              }}
              className={cn(
                "hover:text-foreground text-muted-foreground flex items-center",
                {
                  "text-foreground font-bold": pathname === href,
                }
              )}>
              <div className="flex items-center gap-2">
                {label}
                {href === "/admin/orders" && orderCount > 0 && (
                  <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                )}
              </div>
            </Link>
          ))}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden">
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
                  onClick={(e) => {
                    e.preventDefault(); // Mencegah navigasi default
                    handleNavigation(href); // Gunakan handleNavigation
                  }}
                  className={cn("hover:text-foreground text-muted-foreground", {
                    "text-foreground font-bold": pathname === href,
                  })}>
                  <div className="flex items-center gap-2">
                    {label}
                    {href === "/admin/orders" && orderCount > 0 && (
                      <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    )}
                  </div>
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
              <ThemeToggle className="w-full" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {/* Progress Bar di bawah header */}
      {isPending && (
        <Progress value={progress} className="h-1 w-full rounded-none" />
      )}
    </>
  );
};
