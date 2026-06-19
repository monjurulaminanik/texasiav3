import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "QSA Apparels | Garment Manufacturer Bangladesh",
    template: "%s | QSA Apparels"
  },
  description: "QSA Apparels is a world-class, certified readymade garment manufacturer and sourcing partner in Dhaka, Bangladesh. Offering OEM, ODM, private label, and sourcing solutions with low MOQ.",
  metadataBase: new URL("http://localhost:3000"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "QSA Apparels",
    description: "World-Class Garment Manufacturing & Sourcing from Bangladesh.",
    url: "http://localhost:3000",
    siteName: "QSA Apparels",
    locale: "en_US",
    type: "website",
  },
};

import AppProviders from "@/components/providers/AppProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-[#ffffff] text-[#212529]`}
        suppressHydrationWarning
      >
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
