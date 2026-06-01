export const dynamic = 'force-dynamic'

import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
// removed format import
import { Calendar, Eye, ArrowRight, Clock } from "lucide-react";

interface NewsPageProps {
  searchParams: Promise<{
    tag?: string;
  }>;
}

export const metadata = {
  title: "Texasia Insights | Garment Sourcing Industry News",
  description: "Read the latest news, B2B trends, low MOQ guidelines, and ecological breakthroughs inside the Bangladesh RMG manufacturing sector.",
};

export default async function PublicNewsListingPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const selectedTag = params.tag || "";

  // Query all published blog posts
  const posts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      ...(selectedTag
        ? {
            tags: {
              contains: selectedTag,
            },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  // Extract all unique tags across all posts for filter buttons
  const allPosts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { tags: true },
  });

  const uniqueTagsSet = new Set<string>();
  allPosts.forEach((p) => {
    if (p.tags) {
      p.tags.split(",").forEach((t) => uniqueTagsSet.add(t.trim()));
    }
  });
  const tagsList = Array.from(uniqueTagsSet).slice(0, 8); // Top 8 tags

  return (
    <div className="pt-28 pb-20 space-y-12">
      {/* Intro banner */}
      <section className="max-w-7xl mx-auto px-6 space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#d4a574]/10 border border-[#d4a574]/30 px-3 py-1 rounded-full text-[10px] font-bold text-[#d4a574] uppercase tracking-wider">
          📰 B2B Garment Market Insights
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
          Industry Insights & Guides
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">
          Stay informed on trade duty changes, sustainable organic dye breakthroughs, and strategic sourcing comparisons from Dhaka, Bangladesh.
        </p>
      </section>

      {/* Tag filters strip */}
      {tagsList.length > 0 && (
        <section className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2 items-center border-b border-[#0f2545]/40 pb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">Filter by Topic:</span>
            <Link
              href="/news"
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-premium ${
                !selectedTag
                  ? "bg-[#d4a574] text-[#040d1a] border-[#d4a574]"
                  : "border-[#0f2545] text-slate-400 hover:text-white hover:border-slate-500"
              }`}
            >
              All Topics
            </Link>
            {tagsList.map((tag) => (
              <Link
                key={tag}
                href={`/news?tag=${encodeURIComponent(tag)}`}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-premium ${
                  selectedTag === tag
                    ? "bg-[#d4a574] text-[#040d1a] border-[#d4a574]"
                    : "border-[#0f2545] text-slate-400 hover:text-white hover:border-slate-500"
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* News grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-[#081a33]/10 border border-[#0f2545]/40 rounded-2xl">
            <p className="text-slate-500 text-sm">No articles match the selected topic yet.</p>
            <Link href="/news" className="text-xs text-[#d4a574] hover:underline mt-2 inline-block">
              Clear filters and view all insights →
            </Link>
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="bg-[#081a33]/20 border border-[#0f2545]/50 hover:border-[#d4a574]/30 rounded-2xl overflow-hidden group shadow-md transition-premium flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#040d1a] border-b border-[#0f2545]/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-premium"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-[9px] font-bold text-[#d4a574] uppercase tracking-widest">
                    Garment Sourcing
                  </span>
                  <h3 className="text-base font-extrabold text-white font-heading line-clamp-2 group-hover:text-[#d4a574] transition-premium leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {post.excerpt || "Teaser details regarding current apparel industry trends."}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 mt-4">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold border-t border-[#0f2545]/30 pt-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" /> {new Date(post.createdAt).toISOString().split('T')[0]}
                  </span>
                  <span className="text-[#d4a574] flex items-center gap-0.5 group-hover:translate-x-1 transition-premium">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}

