import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CurrencyProvider } from "@/lib/CurrencyContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Artisanat Maroc - L'authenticite du savoir-faire marocain",
  description: "Des artisans passionnes, des creations uniques, des histoires a chaque piece.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <CurrencyProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
