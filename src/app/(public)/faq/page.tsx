export const dynamic = 'force-dynamic'

import React from "react";
import prisma from "@/lib/prisma";
import FaqListContainer from "@/components/public/FaqListContainer";

export const metadata = {
  title: "B2B Sourcing FAQ | Texasia International",
  description: "Find professional answers on custom apparel manufacturing MOQ thresholds, L/C payment methods, sampling timelines, and garment compliance audits.",
};

export default async function PublicFaqPage() {
  // Query all active FAQs ordered by sorting index
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  // Schema.org FAQPage structured JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>/g, ""), // strip HTML tags for schema text
      },
    })),
  };

  return (
    <div className="pt-28 pb-20 space-y-12">
      {/* Schema.org FAQPage structured JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Intro Header Banner */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#d4a574]/10 border border-[#d4a574]/30 px-3 py-1 rounded-full text-[10px] font-bold text-[#d4a574] uppercase tracking-wider">
          💬 B2B Sourcing Support Center
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Clear, professional advice on production capabilities, green chemical treatments, custom sample approvals, and global bulk logistics pathways.
        </p>
      </section>

      {/* Interactive FAQ component */}
      <FaqListContainer initialFaqs={faqs} />
    </div>
  );
}

