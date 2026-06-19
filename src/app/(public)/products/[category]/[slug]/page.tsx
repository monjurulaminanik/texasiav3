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
    title: product.metaTitle || `${product.name} Wholesale Sourcing | QSA Apparels`,
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
      "name": "QSA Apparels"
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
      <div className="pt-28 pb-10 min-h-screen bg-white">
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
    <div className="bg-white min-h-screen pt-40 pb-20">
      {/* JSON-LD Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BREADCRUMBS STRIP */}
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
          <Link href={`/products/${product.category.slug}`} className="hover:text-[#212529] transition-colors">
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#212529] font-bold">{product.name}</span>
        </div>
      </section>

      {/* TWO-COLUMN DETAILS LAYOUT */}
      <section className="max-w-[95%] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left Column: Product Interactive Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Right Column: Spec & CTA details */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="text-3xl font-light text-[#212529] font-heading tracking-[0.2em] uppercase">
              {product.name}
            </h1>
            <p className="text-gray-500 text-sm leading-[1.8] font-light max-w-xl">
              {product.shortDesc || "Premium readymade garment compiled to precise international compliance safety standards."}
            </p>
          </div>

          {/* Quick specs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Min Order (MOQ)</span>
              <span className="text-xs text-[#212529]">{product.moq || "500 pieces"}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Est. Lead Time</span>
              <span className="text-xs text-[#212529]">{product.leadTime || "30-45 Days"}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Fabric</span>
              <span className="text-xs text-[#212529] truncate">{product.fabric || "Cotton Knit"}</span>
            </div>
          </div>

          {/* Bullet features list */}
          {features.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <span className="text-[10px] text-[#212529] font-medium uppercase tracking-widest block">
                Highlights
              </span>
              <ul className="space-y-3 text-xs text-gray-500 font-light leading-[1.8]">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d12026] mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sizes & Colors tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
            {product.sizes && (
              <div className="space-y-3">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest block">Sizes</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.split(",").map((s) => (
                    <span key={s} className="border border-gray-200 text-gray-500 px-3 py-1 text-[10px] uppercase tracking-widest">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.colors && (
              <div className="space-y-3">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest block">Colors</span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.split(",").map((c) => (
                    <span key={c} className="border border-gray-200 text-gray-500 px-3 py-1 text-[10px] uppercase tracking-widest">
                      {c.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Quote Request redirect button */}
          <div className="pt-8">
            <Link
              href={`/request-for-quotation?productId=${product.id}&productType=${encodeURIComponent(product.name)}`}
              className="inline-flex items-center gap-3 text-[11px] font-medium tracking-[0.2em] uppercase text-[#ffffff] bg-[#d12026] hover:bg-[#a5191f] transition-colors px-8 py-4"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </section>

      {/* BOTTOM TABS / SPECIFICATIONS */}
      {product.description && product.description.trim() !== "" && (
        <section className="max-w-[95%] mx-auto px-6 pt-24 mt-24 border-t border-gray-100 space-y-8">
          <h3 className="text-lg font-light text-[#212529] font-heading tracking-[0.2em] uppercase">
            Specifications
          </h3>
          <div className="prose max-w-none text-gray-500 text-sm leading-[2] font-light prose-headings:font-light prose-headings:text-[#212529] prose-headings:tracking-[0.1em] prose-a:text-[#d12026]">
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        </section>
      )}

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[95%] mx-auto px-6 pt-24 mt-24 border-t border-gray-100 space-y-12">
          <h3 className="text-lg font-light text-[#212529] font-heading tracking-[0.2em] uppercase">
            Related
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map((prod) => {
              const cover = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=500&fit=crop";
              return (
                <Link
                  key={prod.id}
                  href={`/products/${product.category.slug}/${prod.slug}`}
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
                    <h4 className="font-light text-[#212529] font-heading text-xs uppercase tracking-[0.1em] group-hover:text-[#d12026] transition-colors truncate">
                      {prod.name}
                    </h4>
                    <p className="text-[9px] text-gray-500 font-medium uppercase tracking-widest">
                      MOQ: {prod.moq || "500 pcs"}
                    </p>
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
