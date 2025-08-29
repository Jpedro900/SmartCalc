import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "SmartCalc — Calculadoras Online",
  description: "IMC, porcentagem, juros, regra de 3, conversores e mais.",
  metadataBase: new URL("https://smartcalc.com.br"),
  openGraph: {
    title: "SmartCalc — Calculadoras Online",
    description: "Ferramentas rápidas e confiáveis para o dia a dia.",
    url: "https://smartcalc.com.br",
    siteName: "SmartCalc",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
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
