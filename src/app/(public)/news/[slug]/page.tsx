import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import IncrementViews from "@/components/public/IncrementViews";
import ShareButtons from "@/components/public/ShareButtons";
import { format } from "date-fns";
import { ChevronRight, Home, Calendar, Eye } from "lucide-react";

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) return {};

  return {
    title: post.metaTitle || `${post.title} | Texasia Insights`,
    description: post.metaDesc || post.excerpt || `Read our latest RMG sourcing article: ${post.title}`,
  };
}

export default async function PublicNewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;

  // Fetch blog post details with author included
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true, email: true } } },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  // Fetch 3 other latest published posts for related insights
  const relatedPosts = await prisma.blogPost.findMany({
    where: { isPublished: true, id: { not: post.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  // Schema.org Article structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": post.coverImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop",
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "Texasia International Fashion Co., Ltd.",
      "logo": {
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=80&fit=crop"
      }
    },
    "description": post.excerpt || post.title
  };

  const shareUrl = `http://localhost:3000/news/${post.slug}`;

  return (
    <div className="pt-28 pb-20 space-y-12">
      {/* Schema.org Article structured JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Views count trigger helper */}
      <IncrementViews slug={post.slug} />

      {/* BREADCRUMBS STRIP */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/news" className="hover:text-white">
            Insights
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#d4a574] font-bold truncate max-w-[200px]">{post.title}</span>
        </div>
      </section>

      {/* ARTICLE COVER & HEADER */}
      <section className="max-w-4xl mx-auto px-6 space-y-6">
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#d4a574] tracking-widest uppercase block">
            RMG Industry Insights
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium border-y border-[#0f2545]/40 py-3 mt-4">
            <span>By {post.author.name}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {format(new Date(post.createdAt), "yyyy-MM-dd")}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {post.views} views
            </span>
          </div>
        </div>

        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-[#0f2545] bg-[#081a33] shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ARTICLE CONTENT READ-PANE */}
      <section className="max-w-3xl mx-auto px-6">
        <article className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed space-y-6">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* SOCIAL SHARE STRIP */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#0f2545]/40 pt-6 mt-12">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Share Sourcing Insights:</span>
          <ShareButtons shareUrl={shareUrl} title={post.title} />
        </div>
      </section>

      {/* RELATED POSTS SECTION */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 border-t border-[#0f2545]/40 pt-16 space-y-10">
          <h3 className="text-xl font-bold text-white font-heading text-center">
            Other Garment Sourcing Guides
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.id}
                href={`/news/${rPost.slug}`}
                className="bg-[#081a33]/20 border border-[#0f2545]/50 hover:border-[#d4a574]/30 rounded-2xl overflow-hidden group shadow-md transition-premium flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#040d1a]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rPost.coverImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop"}
                      alt={rPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[9px] font-bold text-[#d4a574] uppercase tracking-widest block">Sourcing</span>
                    <h4 className="font-bold text-white font-heading text-sm line-clamp-2 group-hover:text-[#d4a574] transition-premium">
                      {rPost.title}
                    </h4>
                  </div>
                </div>
                <div className="p-5 pt-0 border-t border-[#0f2545]/30 mt-4 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase">
                  <span>{format(new Date(rPost.createdAt), "yyyy-MM-dd")}</span>
                  <span className="text-[#d4a574]">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
