import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "notia — AI news dashboard",
  description:
    "Aggregated artificial intelligence news inspired by CryptoPanic."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900 transition-colors dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:text-zinc-100">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
