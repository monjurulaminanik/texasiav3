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
  title: "QSA Apparels Insights | Garment Sourcing Industry News",
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
    <div className="bg-white min-h-screen pt-40 pb-20">
      {/* SECTION 1: HERO CONTAINER (Centro Minimalist) */}
      <section className="relative max-w-[95%] mx-auto px-6 border-b border-gray-100 pb-16 mb-16">
        <h1 className="text-3xl md:text-5xl font-light text-[#212529] font-heading tracking-[0.2em] uppercase text-center mb-6">
          INDUSTRY INSIGHTS
        </h1>
        <p className="text-gray-500 text-sm text-center max-w-2xl mx-auto font-light leading-[1.8]">
          Stay informed on trade duty changes, sustainable organic dye breakthroughs, and strategic sourcing comparisons from Dhaka, Bangladesh.
        </p>
      </section>

      {/* Tag filters strip */}
      {tagsList.length > 0 && (
        <section className="max-w-[95%] mx-auto px-6 mb-12">
          <div className="flex flex-wrap gap-4 items-center justify-center border-b border-gray-100 pb-8">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mr-2">Filter:</span>
            <Link
              href="/news"
              className={`text-[10px] font-medium uppercase tracking-widest px-4 py-2 transition-colors ${
                !selectedTag
                  ? "bg-[#212529] text-white"
                  : "bg-[#f8f9fa] text-gray-500 hover:bg-[#e9ecef]"
              }`}
            >
              All Topics
            </Link>
            {tagsList.map((tag) => (
              <Link
                key={tag}
                href={`/news?tag=${encodeURIComponent(tag)}`}
                className={`text-[10px] font-medium uppercase tracking-widest px-4 py-2 transition-colors ${
                  selectedTag === tag
                    ? "bg-[#212529] text-white"
                    : "bg-[#f8f9fa] text-gray-500 hover:bg-[#e9ecef]"
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* News grid */}
      <section className="max-w-[95%] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-gray-400 text-sm font-light uppercase tracking-widest">No articles match the selected topic.</p>
            <Link href="/news" className="text-[11px] font-medium tracking-widest uppercase text-[#d12026] hover:text-[#a5191f] mt-6 inline-block">
              Clear filters
            </Link>
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#f8f9fa] mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 space-y-4">
                <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest block">
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <h3 className="text-lg font-light text-[#212529] font-heading line-clamp-2 uppercase tracking-[0.1em] group-hover:text-[#d12026] transition-colors leading-[1.4]">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 font-light leading-[1.8] line-clamp-3">
                  {post.excerpt || "Teaser details regarding current apparel industry trends."}
                </p>
                <div className="pt-4 inline-flex items-center gap-2 text-[10px] font-medium tracking-widest uppercase text-[#212529] group-hover:text-[#d12026] transition-colors">
                  Read Article <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}

