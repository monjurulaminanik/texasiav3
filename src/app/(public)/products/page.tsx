export const dynamic = 'force-dynamic'

import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ArrowRight, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "Apparel Categories & Garment Catalogs",
  description: "Browse our 23 readymade garment manufacturing catalogs, including Knits, Polos, Denim, Sweaters, Workwear, Outerwear, and Uniforms. Sourced ethically in Bangladesh.",
};

export default async function PublicCategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="pt-28 pb-20 space-y-16">
      {/* Intro banner */}
      <section className="max-w-7xl mx-auto px-6 space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#d4a574]/10 border border-[#d4a574]/30 px-3 py-1 rounded-full text-[10px] font-bold text-[#d4a574] uppercase tracking-wider">
          👚 Massive Sourcing Directory
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
          Our Garment Catalogs
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">
          Explore our extensive readymade garment (RMG) manufacturing capabilities. As a fully vertically integrated manufacturer in Dhaka, we build premium products matching strict social compliance across 23 distinct apparel sectors.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.length === 0 ? (
          <p className="col-span-full text-slate-500 text-sm py-12">No categories are currently active in our catalog.</p>
        ) : (
          categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className="bg-[#081a33]/20 border border-[#0f2545]/60 hover:border-[#d4a574]/40 rounded-2xl overflow-hidden group shadow-lg transition-premium block"
            >
              {/* Category hero image wrapper */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#040d1a] border-b border-[#0f2545]/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.heroImage || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=250&fit=crop"}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-premium"
                />
              </div>

              {/* Card body */}
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-white font-heading group-hover:text-[#d4a574] transition-premium">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {cat.description ? cat.description.replace(/<[^>]*>/g, '') : "Ethically manufactured sourcing solutions."}
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-[#0f2545]/30 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-600" /> Professional Spec
                  </span>
                  <span className="text-[#d4a574] flex items-center gap-0.5 group-hover:translate-x-1 transition-premium">
                    View Catalog <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}

