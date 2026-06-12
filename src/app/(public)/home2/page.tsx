export const dynamic = 'force-dynamic'

import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ArrowRight, ShoppingBag, ShieldCheck, Mail, Play, Sparkles } from "lucide-react";

export const metadata = {
  title: "Home | QSA Apparels",
  description: "QSA Apparels - Premium Garment Manufacturer",
};

export default async function Home2Page() {
  // Fetch active categories for the products section
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    take: 6,
  });

  return (
    <div className="bg-[#0f1115] min-h-screen text-slate-300 font-sans pb-20 pt-20">
      {/* 1. HERO SECTION (Centro Style) */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0a0c10]">
        {/* Background Image overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&h=900&fit=crop" 
            alt="Manufacturing Facility" 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10] via-[#0a0c10]/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-3xl space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[2px] bg-[#e63946]"></div>
              <span className="text-[#e63946] font-bold tracking-widest uppercase text-sm">
                QSA Apparels
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] uppercase tracking-tight">
              Crafting <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Excellence</span> <br />
              In Apparel
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed border-l-2 border-slate-700 pl-6">
              Empowering global brands with premium manufacturing, innovative design, and sustainable sourcing solutions. Your vision, engineered to perfection.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-6">
              <Link
                href="/request-for-quotation"
                className="bg-[#e63946] hover:bg-[#c1121f] text-white font-bold px-8 py-4 uppercase tracking-wider text-sm transition-all flex items-center gap-3 group"
              >
                Get a Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/portfolio"
                className="bg-transparent border border-white hover:bg-white hover:text-black text-white font-bold px-8 py-4 uppercase tracking-wider text-sm transition-all flex items-center gap-3"
              >
                <Play className="w-4 h-4" /> View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-[2px] bg-[#e63946]"></div>
            <span className="text-[#e63946] font-bold tracking-widest uppercase text-xs">About Us</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tight">
            Leading the Future of Manufacturing
          </h2>
          <p className="text-slate-400 leading-relaxed">
            QSA Apparels is a globally recognized garment manufacturing hub dedicated to producing high-quality apparel for top international brands. We blend cutting-edge technology with artisanal craftsmanship to deliver unparalleled quality.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-6">
            <div className="border-l-2 border-[#e63946] pl-4">
              <h4 className="text-3xl font-black text-white">15+</h4>
              <span className="text-xs text-slate-500 uppercase font-bold">Years Experience</span>
            </div>
            <div className="border-l-2 border-[#e63946] pl-4">
              <h4 className="text-3xl font-black text-white">2M+</h4>
              <span className="text-xs text-slate-500 uppercase font-bold">Monthly Capacity</span>
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/5] lg:aspect-square group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=800&fit=crop" 
            alt="About QSA Apparels" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute -bottom-8 -left-8 bg-[#1a1d24] p-8 border-l-4 border-[#e63946] max-w-[250px]">
            <ShieldCheck className="w-10 h-10 text-[#e63946] mb-4" />
            <p className="text-white font-bold text-sm uppercase">BSCI & SEDEX Certified Facility</p>
          </div>
        </div>
      </section>

      {/* 3. PORTFOLIO SECTION */}
      <section className="py-24 bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-[2px] bg-[#e63946]"></div>
                <span className="text-[#e63946] font-bold tracking-widest uppercase text-xs">Featured Work</span>
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tight">Our Portfolio</h2>
            </div>
            <Link href="/portfolio" className="text-white uppercase font-bold text-xs hover:text-[#e63946] transition-colors flex items-center gap-2 border-b border-[#e63946] pb-1">
              View Complete Portfolio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group relative overflow-hidden aspect-[3/4] bg-slate-900 cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={`https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=800&fit=crop&sig=${item}`} 
                  alt="Portfolio Item" 
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 p-8 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                  <span className="text-[#e63946] text-xs font-bold uppercase tracking-widest block mb-2">Project 0{item}</span>
                  <h3 className="text-xl font-bold text-white uppercase">Premium Collection</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OUR PRODUCTS SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[#e63946] font-bold tracking-widest uppercase text-xs">Manufacturing Lines</span>
          <h2 className="text-4xl font-black text-white uppercase tracking-tight">Our Products</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className="group block bg-[#1a1d24] overflow-hidden"
            >
              <div className="relative aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.heroImage || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop"}
                  alt={cat.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-[#e63946]/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-full group-hover:translate-y-0">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="p-6 text-center border-t-2 border-transparent group-hover:border-[#e63946] transition-colors">
                <h4 className="font-bold text-white uppercase tracking-wider">
                  {cat.name}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. ENQUIRY SECTION */}
      <section className="py-24 bg-[#1a1d24] border-t border-[#2a2d35]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <Sparkles className="w-12 h-12 text-[#e63946] mx-auto" />
          <h2 className="text-4xl font-black text-white uppercase tracking-tight">
            Ready to Start Production?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Contact us today to discuss your manufacturing requirements, request a sample, or get a comprehensive quotation for your next apparel collection.
          </p>
          <div className="pt-8">
            <Link
              href="/request-for-quotation"
              className="inline-flex items-center gap-3 bg-white text-black hover:bg-[#e63946] hover:text-white font-black px-10 py-5 uppercase tracking-widest text-sm transition-colors"
            >
              <Mail className="w-5 h-5" /> Send Enquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
