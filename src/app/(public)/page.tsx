export const dynamic = 'force-dynamic'

import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
// import { format } from "date-fns";
import CertStrip from "@/components/public/CertStrip";
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CheckCircle,
  Truck,
  Sparkles,
  Search,
} from "lucide-react";

export default async function PublicHomePage() {
  // Query featured products, active categories, and latest published blogs in parallel
  const [categories, featuredProducts, latestNews] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 6, // Show top 6 categories in home page grid
    }),
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: 4,
      include: { images: { orderBy: { order: "asc" } } },
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const capabilities = [
    { title: "OEM Sourcing", desc: "Build custom garments according to your precise CAD tech blueprints.", icon: ShieldCheck },
    { title: "ODM Solutions", desc: "Adapt our pre-designed, trend-aligned patterns with your logos.", icon: Sparkles },
    { title: "Private Label", desc: "Elevate premium blank apparel with custom tags and retail trims.", icon: ShoppingBag },
    { title: "Rapid Prototyping", desc: "Physically inspect fabric and stitch quality in 7-10 working days.", icon: TrendingUp },
    { title: "Rigorous IQC", desc: "Triple-audit inline & final inspections based on international standards.", icon: CheckCircle },
    { title: "Global Logistics", desc: "Seamless FOB, CIF, or DDP door-to-door shipping directly to warehouses.", icon: Truck },
  ];

  const stats = [
    { value: "15+ Years", label: "Global Exporting Experience" },
    { value: "2M Pcs", label: "Monthly Output Capacity" },
    { value: "500 Pcs", label: "Flexible Low MOQs" },
    { value: "50+ Countries", label: "Global Shipping Destinations" },
  ];

  const coreStrengths = [
    { title: "LEED Gold Green Facility", desc: "Operated with 30% solar grids and Biological Water Effluent Treatment plants." },
    { title: "BSCI & WRAP Audited", desc: "Social safety standards guaranteeing legal compensation and humane working environments." },
    { title: "Local Vertical Integration", desc: "Spun, knitted, and dyed in-house to reduce transit lead times by up to 3 weeks." },
    { title: "Committed QA Teams", desc: "QA experts testing raw tensile strength, laundry shrinkage, and color fasting." },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* SECTION 1: HERO CONTAINER */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 bg-[#040d1a] overflow-hidden">
        {/* Modern dark graphic vectors */}
        <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] rounded-full bg-[#0b2545]/20 blur-[130px] z-0" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] rounded-full bg-[#d4a574]/10 blur-[130px] z-0" />
        
        {/* Dynamic factory background image overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&h=900&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-[#d4a574]/10 border border-[#d4a574]/30 px-4 py-1.5 rounded-full text-xs font-bold text-[#d4a574] uppercase tracking-wider animate-pulse">
            🌍 Certified B2B Sourcing Partner
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white font-heading tracking-tight max-w-4xl mx-auto leading-tight md:leading-none">
            World-Class Garment Manufacturing from <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a574] to-[#f1f5f9]">Bangladesh</span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Texasia International Fashion Co., Ltd. builds premium knit, woven, and denim apparel for global brands, wholesalers, and e-commerce labels with flexible low MOQs starting at 500 pcs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/request-for-quotation"
              className="w-full sm:w-auto bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-[#d4a574]/20 transition-premium cursor-pointer text-sm"
            >
              Request Bulk Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto bg-[#0b2545]/60 hover:bg-[#0b2545] border border-[#0f2545] text-white font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-premium cursor-pointer text-sm"
            >
              Explore Products Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRUST STRIP */}
      <CertStrip />

      {/* SECTION 3: ABOUT SNIPPET */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#0f2545] bg-[#081a33] shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80"
            alt="Texasia Industrial Facility"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <span className="text-xs font-bold text-[#d4a574] tracking-widest uppercase block">
            Who We Are
          </span>
          <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight leading-snug">
            Bridging Design Vision with Responsible Garment Assembly
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Established in 2010 in Mirpur DOHS, Dhaka, Texasia International has evolved into one of Southeast Asia's most trusted vertical RMG supply partners. We leverage advanced machinery and local supply networks to control yarn quality, knitting weights, and customized chemical dyes, delivering flawless wholesale finishes.
          </p>
          <div className="pt-2">
            <Link
              href="/profile"
              className="text-[#d4a574] hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 group transition-premium"
            >
              Read Company Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-premium" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: CAPABILITIES GRID */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#d4a574] tracking-widest uppercase block">
            Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight">
            Vertical Sourcing Infrastructure
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="bg-[#081a33]/20 border border-[#0f2545]/50 hover:border-[#d4a574]/30 rounded-2xl p-6 transition-premium group hover:bg-[#081a33]/40"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0b2545]/60 flex items-center justify-center text-[#d4a574] mb-4 group-hover:bg-[#0b2545] transition-premium">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white font-heading text-base mb-2">{cap.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#0f2545] pb-4">
          <div>
            <span className="text-xs font-bold text-[#d4a574] tracking-widest uppercase block">
              Catalogs
            </span>
            <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight mt-1">
              Garment Directories
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs text-[#d4a574] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            All 23 Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#0f2545]/60 group hover:border-[#d4a574]/40 bg-[#081a33] shadow-lg transition-premium block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.heroImage || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop"}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-premium"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040d1a] to-transparent opacity-80 z-10" />
              <div className="absolute bottom-6 left-6 right-6 z-20 space-y-1">
                <h4 className="font-bold text-white text-lg font-heading group-hover:text-[#d4a574] transition-premium">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">
                  Organic dyes · ISO quality controlled
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 6: WHY CHOOSE US & STATS */}
      <section className="bg-[#081a33]/20 border-y border-[#0f2545]/50 py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {/* Stats strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-1">
                <span className="text-3xl md:text-4xl font-extrabold text-[#d4a574] font-heading block">
                  {stat.value}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* 2-Column features list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-[#0f2545]/50">
            <div className="space-y-6">
              <span className="text-xs font-bold text-[#d4a574] tracking-widest uppercase block">
                Compliance & Trust
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-heading tracking-tight leading-snug">
                Why International Apparel Buyers Partner With Texasia
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Operating a sustainable supply chain requires continuous investment in clean industrial tech, socially responsible workspaces, and strict quality control checklists. We manage the entire sourcing pipeline under one unified banner, eliminating broker markups.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {coreStrengths.map((str) => (
                <div key={str.title} className="space-y-2">
                  <h4 className="font-bold text-white font-heading text-sm">{str.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{str.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FEATURED PRODUCTS CAROUSEL */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-2 border-b border-[#0f2545] pb-4">
            <span className="text-xs font-bold text-[#d4a574] tracking-widest uppercase block">
              Featured Items
            </span>
            <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight">
              Premium Spec Garments
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((prod) => {
              const cover = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&h=375&fit=crop";
              return (
                <Link
                  key={prod.id}
                  href={`/products/${prod.categoryId}/${prod.slug}`} // In NextJS, path resolved nicely
                  className="bg-[#081a33]/20 border border-[#0f2545]/50 hover:border-[#d4a574]/40 rounded-2xl overflow-hidden group shadow-md transition-premium block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#040d1a]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-premium"
                    />
                    <span className="absolute top-3 left-3 bg-[#d4a574] text-[#040d1a] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Premium Spec
                    </span>
                  </div>
                  <div className="p-5 space-y-2 bg-[#081a33]/10">
                    <h4 className="font-bold text-white font-heading text-sm line-clamp-1 group-hover:text-[#d4a574] transition-premium">
                      {prod.name}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase">
                      <span>MOQ: {prod.moq || "500 pcs"}</span>
                      <span className="text-[#d4a574]">View Details →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 8: LATEST NEWS */}
      {latestNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#0f2545] pb-4">
            <div>
              <span className="text-xs font-bold text-[#d4a574] tracking-widest uppercase block">
                Blog Insights
              </span>
              <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight mt-1">
                Latest RMG Industry News
              </h2>
            </div>
            <Link
              href="/news"
              className="text-xs text-[#d4a574] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              All Articles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="bg-[#081a33]/20 border border-[#0f2545]/50 hover:border-[#d4a574]/30 rounded-2xl overflow-hidden group shadow-md transition-premium flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#040d1a]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-premium"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <span className="text-[9px] font-bold text-[#d4a574] uppercase tracking-widest">
                      Industry Insights
                    </span>
                    <h4 className="font-bold text-white font-heading text-base line-clamp-2 group-hover:text-[#d4a574] transition-premium">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {post.excerpt || "Teaser details regarding current global fashion dynamics."}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0 flex items-center justify-between text-[10px] text-slate-500 font-semibold border-t border-[#0f2545]/30 mt-4 pt-4">
                  <span>{new Date(post.createdAt).toISOString().split('T')[0]}</span>
                  <span className="text-[#d4a574] flex items-center gap-0.5 group-hover:translate-x-1 transition-premium">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 9: CTA BANNER */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-[#081a33] to-[#0b2545] border border-[#0f2545] rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-[#d4a574]/5 blur-2xl" />
          
          <span className="text-xs font-bold text-[#d4a574] tracking-widest uppercase block">
            Start Your Sourcing Project
          </span>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight max-w-2xl mx-auto">
            Ready to Partner with Bangladesh's Premier Garment Factory?
          </h2>
          
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Fill out our comprehensive multi-step B2B RFQ form with your quantity requirements, fabric GSM, and target pricing. Our merchandisers will reply within 24 hours.
          </p>

          <div className="pt-4">
            <Link
              href="/request-for-quotation"
              className="inline-flex bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-bold px-8 py-3 rounded-xl items-center justify-center gap-2 shadow-lg hover:shadow-[#d4a574]/20 transition-premium cursor-pointer text-sm"
            >
              Get Free Quotation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

