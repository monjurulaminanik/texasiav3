import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Our Portfolio | QSA Apparels",
  description: "Explore the manufacturing portfolio of QSA Apparels.",
};

export default function PortfolioPage() {
  return (
    <div className="pt-28 pb-20 min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
      <div className="inline-flex items-center gap-2 bg-[#d4a574]/10 border border-[#d4a574]/30 px-3 py-1 rounded-full text-[10px] font-bold text-[#d4a574] uppercase tracking-wider">
        Portfolio
      </div>
      <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
        Our Manufacturing Portfolio
      </h1>
      <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
        We are currently updating our digital portfolio with our latest premium garment manufacturing projects. Please check back soon or contact us for a direct showcase.
      </p>
      <Link
        href="/request-for-quotation"
        className="mt-6 inline-flex bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-bold px-8 py-3 rounded-xl items-center justify-center gap-2 shadow-lg hover:shadow-[#d4a574]/20 transition-premium cursor-pointer text-sm"
      >
        Request a Custom Quote <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
