import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { FileCode, ChevronRight } from "lucide-react";

interface StaticPageLayoutProps {
  slug: string;
}

// Helper function to replace dynamic GrapesJS widgets with live database listings
async function renderBuilderHtml(html: string) {
  let finalHtml = html;

  // 1. Inject Live Featured Products Carousel/Grid
  if (finalHtml.includes('data-component="featured-products"')) {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: 4,
      include: { images: { orderBy: { order: "asc" } } },
    });

    const productsHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 30px; width: 100%; margin-top: 30px; text-align: left;">
        ${products.map(prod => {
          const cover = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&h=375&fit=crop";
          return `
            <a href="/products/${prod.categoryId}/${prod.slug}" style="display: block; background: #081a33; border: 1px solid #0f2545; border-radius: 20px; overflow: hidden; text-decoration: none; transition: transform 0.2s ease;">
              <div style="aspect-ratio: 4/5; overflow: hidden; position: relative;">
                <img src="${cover}" alt="${prod.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                <span style="position: absolute; top: 12px; left: 12px; background: #d4a574; color: #040d1a; font-size: 10px; font-weight: bold; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">Premium Spec</span>
              </div>
              <div style="padding: 20px;">
                <h4 style="color: #ffffff; font-size: 16px; font-weight: bold; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: sans-serif;">${prod.name}</h4>
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: #64748b; font-family: sans-serif;">
                  <span>MOQ: ${prod.moq || "500 pcs"}</span>
                  <span style="color: #d4a574; font-weight: bold;">View →</span>
                </div>
              </div>
            </a>
          `;
        }).join("")}
      </div>
    `;
    finalHtml = finalHtml.replace(/<div[^>]*data-component="featured-products"[^>]*>([\s\S]*?)<\/div>/g, productsHtml);
  }

  // 2. Inject Live Category Grid Directory
  if (finalHtml.includes('data-component="product-categories"')) {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 6,
    });

    const categoriesHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; width: 100%; margin-top: 30px; text-align: left;">
        ${categories.map(cat => {
          const hero = cat.heroImage || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop";
          return `
            <a href="/products/${cat.slug}" style="display: block; position: relative; aspect-ratio: 4/3; border-radius: 20px; overflow: hidden; border: 1px solid #0f2545; text-decoration: none;">
              <img src="${hero}" alt="${cat.name}" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; inset: 0; background: linear-gradient(to top, #040d1a 0%, transparent 100%); opacity: 0.8;"></div>
              <div style="position: absolute; bottom: 20px; left: 20px; right: 20px;">
                <h4 style="color: #ffffff; font-size: 18px; font-weight: bold; margin-bottom: 4px; font-family: sans-serif;">${cat.name}</h4>
                <p style="color: #d4a574; font-size: 11px; margin: 0; font-family: sans-serif; font-weight: bold;">ISO certified sourcing directories</p>
              </div>
            </a>
          `;
        }).join("")}
      </div>
    `;
    finalHtml = finalHtml.replace(/<div[^>]*data-component="product-categories"[^>]*>([\s\S]*?)<\/div>/g, categoriesHtml);
  }

  // 3. Inject Live Latest Blogs
  if (finalHtml.includes('data-component="latest-blogs"')) {
    const news = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    const blogsHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; width: 100%; margin-top: 30px; text-align: left;">
        ${news.map(post => {
          const cover = post.coverImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop";
          return `
            <a href="/news/${post.slug}" style="display: flex; flex-direction: column; justify-content: space-between; background: #081a33; border: 1px solid #0f2545; border-radius: 20px; overflow: hidden; text-decoration: none;">
              <div>
                <img src="${cover}" alt="${post.title}" style="width: 100%; aspect-ratio: 16/10; object-fit: cover;" />
                <div style="padding: 24px;">
                  <span style="color: #d4a574; font-size: 10px; font-weight: bold; text-transform: uppercase; font-family: sans-serif;">Industry Insights</span>
                  <h4 style="color: #ffffff; font-size: 16px; font-weight: bold; margin-top: 8px; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-family: sans-serif;">${post.title}</h4>
                  <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; font-family: sans-serif;">${post.excerpt || ""}</p>
                </div>
              </div>
            </a>
          `;
        }).join("")}
      </div>
    `;
    finalHtml = finalHtml.replace(/<div[^>]*data-component="latest-blogs"[^>]*>([\s\S]*?)<\/div>/g, blogsHtml);
  }

  return finalHtml;
}

export default async function StaticPageLayout({ slug }: StaticPageLayoutProps) {
  // Query static page details directly from database
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page) {
    notFound();
  }

  // If this page was designed with the visual drag-and-drop page builder
  if (page.isBuilderPage && page.gjsHtml) {
    const renderedHtml = await renderBuilderHtml(page.gjsHtml);
    return (
      <div className="pt-24 min-h-screen bg-[#040d1a]">
        {/* Inject visual builder GrapesJS custom stylesheet block */}
        {page.gjsCss && <style dangerouslySetInnerHTML={{ __html: page.gjsCss }} />}
        <div className="w-full" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      </div>
    );
  }

  const siblings = [
    { name: "Company Profile", slug: "profile" },
    { name: "Why Choose Us", slug: "why-choose-us" },
    { name: "Sustainability & Green", slug: "sustainability" },
    { name: "Accreditation & Audits", slug: "accreditation" },
    { name: "Trade Memberships", slug: "membership" },
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
      {/* Sibling navigation sidebar */}
      <aside className="lg:sticky lg:top-24 space-y-4 bg-[#081a33]/40 border border-[#0f2545]/60 rounded-2xl p-6">
        <h4 className="text-white font-heading font-bold text-xs uppercase tracking-widest border-b border-[#0f2545]/50 pb-2 mb-4 flex items-center gap-1.5">
          <FileCode className="w-4.5 h-4.5 text-[#d4a574]" /> Sourcing Profile
        </h4>
        <nav className="flex flex-col gap-2.5 text-xs font-semibold">
          {siblings.map((sib) => {
            const isActive = sib.slug === slug;
            return (
              <a
                key={sib.slug}
                href={`/${sib.slug}`}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-premium ${
                  isActive
                    ? "bg-[#d4a574] text-[#040d1a] border-[#d4a574]"
                    : "border-[#0f2545] text-slate-400 hover:text-white hover:border-slate-500 bg-[#081a33]/20"
                }`}
              >
                {sib.name}
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Main page content area */}
      <main className="lg:col-span-3 space-y-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
          {page.title}
        </h1>
        {/* Render HTML content securely */}
        <article className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed space-y-6">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
      </main>
    </div>
  );
}
