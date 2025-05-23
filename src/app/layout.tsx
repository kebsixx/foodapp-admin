import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cerita Senja",
  description: "Cerita Senja Coffee Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="ligth"
          enableSystem
          disableTransitionOnChange>
          <main>
            {children}
            <Analytics />
          </main>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
