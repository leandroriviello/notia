import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/Navbar";
import "./globals.css";
import { roboto } from "@/styles/fonts";

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
      <body
        className={`${roboto.className} min-h-screen bg-[#0d0d0d] text-zinc-100 transition-colors`}
      >
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
