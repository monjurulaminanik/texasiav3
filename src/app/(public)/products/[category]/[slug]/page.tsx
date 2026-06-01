import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductGallery from "@/components/public/ProductGallery";
import { ChevronRight, Home, ShieldCheck, Clock, Layers, Star, Inbox } from "lucide-react";

interface ProductPageProps {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) return {};

  return {
    title: product.metaTitle || `${product.name} Wholesale Sourcing | Texasia`,
    description: product.metaDesc || product.shortDesc || `Wholesale certified ${product.name}.`,
  };
}

export default async function PublicProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Query product details with images & category details
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Parse features JSON string
  let features: string[] = [];
  try {
    if (product.features) {
      features = JSON.parse(product.features as string);
    }
  } catch (err) {
    console.error("Features JSON parse error:", err);
  }

  // Fetch related products in the same category (excludes current product)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    include: { images: { orderBy: { order: "asc" } } },
  });

  // Compile Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images.map((img) => img.url),
    "description": product.shortDesc || product.name,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Texasia International Fashion Co., Ltd."
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "Negotiable",
      "offerCount": "1",
      "price": "Negotiable",
      "priceValidUntil": "2027-12-31"
    }
  };

  if (product.isBuilderPage && product.gjsHtml) {
    return (
      <div className="pt-28 pb-10 min-h-screen bg-[#040d1a]">
        {/* JSON-LD Structured Data Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <style dangerouslySetInnerHTML={{ __html: product.gjsCss || "" }} />
        <div dangerouslySetInnerHTML={{ __html: product.gjsHtml }} />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 space-y-12">
      {/* JSON-LD Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BREADCRUMBS STRIP */}
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
          <Link href={`/products/${product.category.slug}`} className="hover:text-white">
            {product.category.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#d4a574] font-bold">{product.name}</span>
        </div>
      </section>

      {/* TWO-COLUMN DETAILS LAYOUT */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Product Interactive Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Right Column: Spec & CTA details */}
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#d4a574] tracking-widest uppercase block">
              Certified Premium Spec
            </span>
            <h1 className="text-3xl font-extrabold text-white font-heading tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              {product.shortDesc || "Premium readymade garment compiled to precise international compliance safety standards."}
            </p>
          </div>

          {/* Quick specs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#081a33]/40 border border-[#0f2545]/60 rounded-xl p-4">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#d4a574] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Min Order (MOQ)</span>
                <span className="text-xs text-slate-200 font-semibold">{product.moq || "500 pieces"}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 border-t sm:border-t-0 sm:border-l border-[#0f2545]/50 pt-3 sm:pt-0 sm:pl-4">
              <Clock className="w-5 h-5 text-[#d4a574] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Est. Lead Time</span>
                <span className="text-xs text-slate-200 font-semibold">{product.leadTime || "30-45 Days"}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 border-t sm:border-t-0 sm:border-l border-[#0f2545]/50 pt-3 sm:pt-0 sm:pl-4">
              <Layers className="w-5 h-5 text-[#d4a574] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Fabric Details</span>
                <span className="text-xs text-slate-200 font-semibold truncate block max-w-[120px]">{product.fabric || "Cotton Knit"}</span>
              </div>
            </div>
          </div>

          {/* Bullet features list */}
          {features.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Specification Highlights
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Star className="w-3.5 h-3.5 text-[#d4a574] shrink-0 fill-[#d4a574] mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sizes & Colors tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#0f2545]/40">
            {product.sizes && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Standard Sizes</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.split(",").map((s) => (
                    <span key={s} className="bg-[#0b2545]/40 border border-[#0f2545]/60 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.colors && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Standard Colorways</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.colors.split(",").map((c) => (
                    <span key={c} className="bg-[#0b2545]/40 border border-[#0f2545]/60 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {c.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Quote Request redirect button */}
          <div className="pt-4">
            <Link
              href={`/request-for-quotation?productId=${product.id}&productType=${encodeURIComponent(product.name)}`}
              className="w-full bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-bold uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-[#d4a574]/20 transition-premium cursor-pointer text-xs"
            >
              <Inbox className="w-4.5 h-4.5" /> Request Quote for {product.name}
            </Link>
          </div>
        </div>
      </section>

      {/* BOTTOM TABS / SPECIFICATIONS */}
      <section className="max-w-7xl mx-auto px-6 border-t border-[#0f2545]/40 pt-12 space-y-6">
        <h3 className="text-xl font-bold text-white font-heading border-b border-[#0f2545]/40 pb-3">
          Manufacturing Specifications
        </h3>
        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 border-t border-[#0f2545]/40 pt-16 space-y-10">
          <h3 className="text-xl font-bold text-white font-heading">
            Related Garment Options
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((prod) => {
              const cover = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&h=375&fit=crop";
              return (
                <Link
                  key={prod.id}
                  href={`/products/${prod.categoryId}/${prod.slug}`}
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
                  <div className="p-4 space-y-2 bg-[#081a33]/10">
                    <h4 className="font-bold text-white font-heading text-xs truncate group-hover:text-[#d4a574] transition-premium">
                      {prod.name}
                    </h4>
                    <div className="flex items-center justify-between text-[8px] text-slate-500 font-semibold uppercase tracking-wider">
                      <span>MOQ: {prod.moq || "500 pcs"}</span>
                      <span className="text-[#d4a574]">Inspect →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
