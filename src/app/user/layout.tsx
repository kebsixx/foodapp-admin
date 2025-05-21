"use client";

import { Toaster } from "react-hot-toast";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {children}
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
