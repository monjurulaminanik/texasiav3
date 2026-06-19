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
      {/* SECTION 1: HERO CONTAINER (Centro Minimalist) */}
      <section className="relative pt-40 pb-20 bg-white border-b border-[#e9ecef]">
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <h1 className="text-3xl md:text-5xl font-heading font-light tracking-[0.2em] uppercase text-[#212529] text-center pb-8">
            OUR GARMENT <span className="text-[#d12026]">CATALOGS</span>
          </h1>
          <p className="text-[#6c757d] text-sm text-center max-w-2xl mx-auto font-light leading-[1.8]">
            Explore our extensive readymade garment (RMG) manufacturing capabilities. As a fully vertically integrated manufacturer in Dhaka, we build premium products matching strict social compliance across 23 distinct apparel sectors.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-[95%] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <p className="col-span-full text-gray-400 text-sm py-12 text-center font-light uppercase tracking-widest">No catalogs available.</p>
        ) : (
          categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className="group block relative aspect-[4/5] overflow-hidden bg-[#f8f9fa]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.heroImage || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop"}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h4 className="text-white text-lg font-light tracking-[0.2em] uppercase text-center px-4">
                  {cat.name}
                </h4>
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}

