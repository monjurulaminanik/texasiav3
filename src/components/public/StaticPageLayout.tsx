import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { FileCode, ChevronRight } from "lucide-react";

interface StaticPageLayoutProps {
  slug: string;
}

export default async function StaticPageLayout({ slug }: StaticPageLayoutProps) {
  // Query static page details directly from database
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page) {
    notFound();
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
