"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Search, MessageSquare, Ship, Scale, DollarSign, Layers } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order: number;
}

interface FaqListContainerProps {
  initialFaqs: FAQ[];
}

export default function FaqListContainer({ initialFaqs }: FaqListContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Extract unique categories (e.g. Production, Shipping, MOQ, Quality, General)
  const categories = ["All", "Production", "Shipping", "MOQ", "Quality", "General"];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter FAQs based on query and selected category
  const filteredFaqs = initialFaqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case "Production":
        return <Layers className="w-4 h-4 text-[#d4a574]" />;
      case "Shipping":
        return <Ship className="w-4 h-4 text-[#d4a574]" />;
      case "Quality":
        return <Scale className="w-4 h-4 text-[#d4a574]" />;
      case "MOQ":
        return <DollarSign className="w-4 h-4 text-[#d4a574]" />;
      default:
        return <MessageSquare className="w-4 h-4 text-[#d4a574]" />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Search and Category Filter Controls */}
      <section className="max-w-4xl mx-auto px-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search B2B sourcing FAQs, MOQ rules, compliance audits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-[#081a33]/30 border border-[#0f2545]/60 rounded-xl text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#d4a574]/60 transition-premium"
          />
        </div>

        {/* Category filters strip */}
        <div className="flex flex-wrap gap-2 items-center justify-center border-b border-[#0f2545]/40 pb-4">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setExpandedId(null); // Collapse when switching categories
                }}
                className={`text-xs font-semibold px-4 py-2 rounded-lg border cursor-pointer transition-premium ${
                  isActive
                    ? "bg-[#d4a574] text-[#040d1a] border-[#d4a574]"
                    : "border-[#0f2545] text-slate-400 hover:text-white hover:border-slate-500 bg-[#081a33]/20"
                }`}
              >
                {cat} FAQs
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQs List Accordion */}
      <section className="max-w-4xl mx-auto px-6 space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-[#081a33]/10 border border-[#0f2545]/40 rounded-2xl">
            <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm font-medium">No sourcing answers match your current query.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-xs text-[#d4a574] hover:underline mt-2 cursor-pointer"
            >
              Reset Search & Filters →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-[#081a33]/20 border rounded-2xl overflow-hidden transition-premium ${
                    isExpanded ? "border-[#d4a574]/40 bg-[#0b2545]/10" : "border-[#0f2545]/50 hover:border-slate-500"
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-[#0b2545]/50 border border-[#0f2545]/40">
                        {getCategoryIcon(faq.category)}
                      </span>
                      <h3 className="text-xs md:text-sm font-bold text-white font-heading">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#d4a574] transition-premium flex-shrink-0 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded ? "max-h-[500px] opacity-100 border-t border-[#0f2545]/30" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-5 md:p-6 text-slate-300 text-xs md:text-sm leading-relaxed space-y-3 bg-[#040d1a]/20">
                      <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Sourcing CTA Strip */}
      <section className="max-w-3xl mx-auto px-6 pt-8 text-center space-y-4">
        <p className="text-xs text-slate-500">
          Have an inquiry regarding specific custom fabric blends, certification auditing, or port of landing clearances not listed here?
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#d4a574] hover:underline"
        >
          Contact Our B2B Support Desk →
        </a>
      </section>
    </div>
  );
}
