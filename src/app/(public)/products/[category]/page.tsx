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
    <div className="bg-white min-h-screen pt-40 pb-20">
      {/* BREADCRUMB STRIP */}
      <section className="max-w-[95%] mx-auto px-6 mb-12">
        <div className="flex items-center flex-wrap gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
          <Link href="/" className="hover:text-[#212529] flex items-center gap-1 transition-colors">
            <Home className="w-3 h-3" /> Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-[#212529] transition-colors">
            Catalogs
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#212529] font-bold">{category.name}</span>
        </div>
      </section>

      {/* CATEGORY HERO DESCRIPTION */}
      <section className="max-w-[95%] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border-b border-gray-100 pb-20 mb-20">
        <div className="space-y-8">
          <h1 className="text-3xl md:text-5xl font-light text-[#212529] font-heading tracking-[0.2em] uppercase">
            {category.name}
          </h1>
          {category.description && (
            <div className="text-gray-500 text-sm leading-[1.8] font-light max-w-xl">
              {category.description}
            </div>
          )}
          <div className="pt-4">
            <Link
              href="/request-for-quotation"
              className="inline-flex items-center gap-2 text-[11px] font-medium tracking-widest uppercase text-[#212529] hover:text-[#d12026] transition-colors pb-1 border-b border-transparent hover:border-[#d12026]"
            >
              Request Quote <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] bg-[#f8f9fa]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={category.heroImage || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=600&fit=crop"}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* PRODUCTS CATALOG LISTING GRID */}
      <section className="max-w-[95%] mx-auto px-6 space-y-12">
        <h2 className="text-xl md:text-2xl font-light text-[#212529] font-heading tracking-[0.2em] uppercase text-center mb-16">
          Products
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm font-light uppercase tracking-widest">No products listed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((prod) => {
              const cover = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=500&fit=crop";
              return (
                <Link
                  key={prod.id}
                  href={`/products/${category.slug}/${prod.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f8f9fa] mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2 text-center">
                    <h4 className="font-light text-[#212529] font-heading text-sm uppercase tracking-[0.1em] group-hover:text-[#d12026] transition-colors">
                      {prod.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                      MOQ: {prod.moq || "500 pcs"}
                    </p>
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
