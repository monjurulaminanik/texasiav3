import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Texasia International Fashion Co., Ltd. | Garment Manufacturer Bangladesh",
    template: "%s | Texasia International Fashion Co., Ltd."
  },
  description: "Texasia International Fashion Co., Ltd. is a world-class, certified readymade garment manufacturer and sourcing partner in Dhaka, Bangladesh. Offering OEM, ODM, private label, and sourcing solutions with low MOQ.",
  metadataBase: new URL("http://localhost:3000"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Texasia International Fashion Co., Ltd.",
    description: "World-Class Garment Manufacturing & Sourcing from Bangladesh.",
    url: "http://localhost:3000",
    siteName: "Texasia International Fashion Co., Ltd.",
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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
