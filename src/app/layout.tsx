import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Cerita Senja",
  description: "Cerita Senja Coffee Shop",
  verification: {
    google: "kEObDc_TDYI0z1RCEhAr26RSNQFdca1t5lb8ocUZ3CY",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
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
