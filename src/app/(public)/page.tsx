export const dynamic = 'force-dynamic'

import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ArrowRight } from "lucide-react";

export default async function PublicHomePage() {
  // Check if there is a customized visual page designed for the homepage
  const homePage = await prisma.page.findUnique({
    where: { slug: "home" },
  });


  // By default, we use the hardcoded minimal theme.
  // If the user wants to use the visual builder again, they can rebuild it from scratch.

  const [categories] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 6,
    })
  ]);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* SECTION 1: HERO CONTAINER (Centro Minimalist Theme) */}
      <section className="relative min-h-[95vh] flex flex-col justify-between pt-32 bg-white overflow-hidden">
        
        {/* Centered Thin Tagline */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-6">
          <h1 className="text-xl md:text-3xl font-heading font-light tracking-[0.2em] md:tracking-[0.3em] uppercase text-[#212529] text-center">
            WORLD-CLASS GARMENT <span className="text-gray-300 mx-2 md:mx-4">|</span> MANUFACTURING EXCELLENCE
          </h1>
        </div>

        {/* Bottom Image Gallery Strip (5 Columns, No Gap) */}
        <div className="grid grid-cols-2 md:grid-cols-5 h-[40vh] md:h-[55vh] w-full">
          <div className="relative h-full w-full bg-[#f8f9fa] overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=800&fit=crop&q=80')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
          </div>
          <div className="relative h-full w-full bg-[#f1f3f5] overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=600&h=800&fit=crop&q=80')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
          </div>
          <div className="relative h-full w-full bg-[#e9ecef] overflow-hidden group hidden md:block">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop&q=80')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
          </div>
          <div className="relative h-full w-full bg-[#dee2e6] overflow-hidden group hidden md:block">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop&q=80')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
          </div>
          <div className="relative h-full w-full bg-[#ced4da] overflow-hidden group hidden md:block">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489987707023-afc827081fac?w=600&h=800&fit=crop&q=80')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
          </div>
        </div>
      </section>

      {/* SECTION 2: STORY SNIPPET */}
      <section className="max-w-[80%] mx-auto px-6 py-32 text-center space-y-10 border-b border-gray-100">
        <h2 className="text-2xl md:text-4xl font-light text-[#212529] font-heading tracking-[0.2em] uppercase">
          Our Story
        </h2>
        <p className="text-[#6c757d] text-sm md:text-base leading-[2] font-light max-w-3xl mx-auto">
          Established in Dhaka, QSA Apparels has evolved into one of Southeast Asia's most trusted vertical RMG supply partners. We bridge design vision with responsible garment assembly, delivering flawless wholesale finishes.
        </p>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-[11px] font-medium tracking-widest uppercase text-[#212529] hover:text-[#d12026] transition-colors pb-1 border-b border-transparent hover:border-[#d12026]"
        >
          Read Full Profile <ArrowRight className="w-3 h-3" />
        </Link>
      </section>

      {/* SECTION 3: CATEGORIES */}
      {categories.length > 0 && (
        <section className="max-w-[95%] mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-2xl font-light text-[#212529] font-heading tracking-[0.2em] uppercase">
              Directories
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
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
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
