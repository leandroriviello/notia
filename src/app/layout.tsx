import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/Navbar";
import "./globals.css";
import { roboto } from "@/styles/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://notia.info"),
  title: {
    default: "Notia — Noticias de Inteligencia Artificial",
    template: "%s | Notia AI News"
  },
  description:
    "Noticias, investigación, lanzamientos y regulaciones sobre inteligencia artificial en español e inglés, actualizadas a partir de múltiples fuentes RSS.",
  keywords: [
    "inteligencia artificial",
    "ai news",
    "noticias IA",
    "machine learning",
    "regulación IA",
    "productos IA",
    "investigación IA",
    "herramientas IA"
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["en_US"],
    url: "https://notia.info",
    siteName: "Notia AI News",
    title: "Notia — Noticias de Inteligencia Artificial",
    description:
      "Agregador de noticias de IA con resúmenes curados de investigación, productos, negocios, regulaciones y herramientas.",
    images: [
      {
        url: "https://notia.info/og-image.png",
        width: 1200,
        height: 630,
        alt: "Notia — Noticias de Inteligencia Artificial"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Notia — Noticias de Inteligencia Artificial",
    description:
      "Descubre lo último en IA: investigación, lanzamientos, regulación y herramientas en un solo panel.",
    images: ["https://notia.info/og-image.png"]
  },
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  }
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
