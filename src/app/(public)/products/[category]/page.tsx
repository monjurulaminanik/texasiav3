import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ChevronRight, Home, ShoppingBag, ArrowRight } from "lucide-react";

interface CategoryPageProps {
  params: {
    category: string; // The category slug
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const cat = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!cat) return {};

  return {
    title: cat.metaTitle || `${cat.name} Manufacturer & Sourcing Bangladesh`,
    description: cat.metaDesc || `Supplier of premium ${cat.name}. Low MOQ, green LEED facility.`,
  };
}

export default async function PublicCategoryProductsPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;

  // Query category details
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category || !category.isActive) {
    notFound();
  }

  // Query products in this category
  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return (
    <div className="pt-28 pb-20 space-y-16">
      {/* BREADCRUMB STRIP */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-white">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#d4a574] font-bold">{category.name}</span>
        </div>
      </section>

      {/* CATEGORY HERO DESCRIPTION */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-b border-[#0f2545]/40 pb-12">
        <div className="space-y-6">
          <span className="text-xs font-bold text-[#d4a574] tracking-widest uppercase block">
            B2B Garment Catalog
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
            Wholesale {category.name}
          </h1>
          {category.description && (
            <div className="text-slate-400 text-sm leading-relaxed prose prose-invert max-w-none">
              {category.description}
            </div>
          )}
          <div className="pt-2">
            <Link
              href="/request-for-quotation"
              className="inline-flex bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl items-center justify-center gap-2 shadow-lg transition-premium cursor-pointer"
            >
              Request Quote for {category.name} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#0f2545] bg-[#081a33] shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={category.heroImage || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=500&fit=crop"}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* PRODUCTS CATALOG LISTING GRID */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <h2 className="text-xl md:text-2xl font-bold text-white font-heading flex items-center gap-2 border-b border-[#0f2545]/40 pb-3">
          <ShoppingBag className="w-5 h-5 text-[#d4a574]" /> Custom Product silhouettes
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-[#081a33]/10 border border-[#0f2545]/40 rounded-2xl">
            <p className="text-slate-500 text-sm">No standard product specs listed under this catalog yet.</p>
            <Link href="/request-for-quotation" className="text-xs text-[#d4a574] hover:underline mt-2 inline-block">
              Send us custom blueprints to begin custom sampling →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((prod) => {
              const cover = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&h=375&fit=crop";
              return (
                <Link
                  key={prod.id}
                  href={`/products/${category.slug}/${prod.slug}`}
                  className="bg-[#081a33]/20 border border-[#0f2545]/50 hover:border-[#d4a574]/40 rounded-2xl overflow-hidden group shadow-md transition-premium block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#040d1a]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-premium"
                    />
                  </div>
                  <div className="p-5 space-y-2 bg-[#081a33]/10">
                    <h4 className="font-bold text-white font-heading text-sm line-clamp-1 group-hover:text-[#d4a574] transition-premium">
                      {prod.name}
                    </h4>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                      <span>MOQ: {prod.moq || "500 pcs"}</span>
                      <span className="text-[#d4a574]">Inspect Specs →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
