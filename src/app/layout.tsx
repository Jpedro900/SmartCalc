import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://smartcalc.com.br"),
  title: {
    default: "SmartCalc — Calculadoras Online",
    template: "%s — SmartCalc",
  },
  description: "IMC, porcentagem, juros, regra de 3, conversores e mais.",
  keywords: [
    "calculadora online",
    "conversor de unidades",
    "IMC",
    "porcentagem",
    "regra de 3",
    "juros compostos",
    "moedas",
  ],
  authors: [{ name: "SmartCalc" }],
  alternates: { canonical: "https://smartcalc.com.br" },
  openGraph: {
    title: "SmartCalc — Calculadoras Online",
    description: "Ferramentas rápidas e confiáveis para o dia a dia.",
    url: "https://smartcalc.com.br",
    siteName: "SmartCalc",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartCalc — Calculadoras Online",
    description: "Ferramentas rápidas e confiáveis para o dia a dia.",
    images: ["/og.png"],
  },
  icons: {
    // favicons modernos
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      // opcional: deixe o .ico se quiser compat extra
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4f46e5" },
    { media: "(prefers-color-scheme: dark)", color: "#4f46e5" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
