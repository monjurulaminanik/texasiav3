import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import IncrementViews from "@/components/public/IncrementViews";
import ShareButtons from "@/components/public/ShareButtons";
import { format } from "date-fns";
import { ChevronRight, Home, Calendar, Eye, ArrowRight } from "lucide-react";

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
    title: post.metaTitle || `${post.title} | QSA Apparels Insights`,
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
      "name": "Wasi Alave"
    },
    "publisher": {
      "@type": "Organization",
      "name": "QSA Apparels",
      "logo": {
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=80&fit=crop"
      }
    },
    "description": post.excerpt || post.title
  };

  const shareUrl = `http://localhost:3000/news/${post.slug}`;

  return (
    <div className="bg-white min-h-screen pt-40 pb-20">
      {/* Schema.org Article structured JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Views count trigger helper */}
      <IncrementViews slug={post.slug} />

      {/* BREADCRUMBS STRIP */}
      <section className="max-w-[95%] mx-auto px-6 mb-16 border-b border-gray-100 pb-8">
        <div className="flex items-center flex-wrap gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
          <Link href="/" className="hover:text-[#212529] flex items-center gap-1 transition-colors">
            <Home className="w-3 h-3" /> Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/news" className="hover:text-[#212529] transition-colors">
            Insights
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#212529] font-bold truncate max-w-[200px]">{post.title}</span>
        </div>
      </section>

      {/* ARTICLE COVER & HEADER */}
      <section className="max-w-4xl mx-auto px-6 space-y-10">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-light text-[#212529] font-heading tracking-[0.1em] leading-[1.3] uppercase">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-[10px] font-medium uppercase tracking-widest text-gray-400 border-y border-gray-100 py-4 mt-6">
            <span className="text-[#212529]">By Wasi Alave — Founder, QSA Apparels (Quadra Source Apparals) | 10+ years RMG industry experience.</span>
            <span className="flex items-center gap-2">
              <Calendar className="w-3 h-3" /> {format(new Date(post.createdAt), "yyyy-MM-dd")}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-3 h-3" /> {post.views} views
            </span>
          </div>
        </div>

        <div className="relative aspect-[21/9] bg-[#f8f9fa] mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ARTICLE CONTENT READ-PANE */}
      <section className="max-w-3xl mx-auto px-6 pt-16">
        <article className="prose max-w-none text-gray-600 text-base leading-[2] font-light prose-headings:font-light prose-headings:text-[#212529] prose-headings:tracking-[0.1em] prose-a:text-[#d12026]">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* SOCIAL SHARE STRIP */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gray-100 pt-8 mt-16">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Share Insights</span>
          <ShareButtons shareUrl={shareUrl} title={post.title} />
        </div>
      </section>

      {/* RELATED POSTS SECTION */}
      {relatedPosts.length > 0 && (
        <section className="max-w-[95%] mx-auto px-6 border-t border-gray-100 pt-24 mt-24 space-y-12">
          <h3 className="text-xl font-light text-[#212529] font-heading tracking-[0.2em] uppercase">
            Other Garment Sourcing Guides
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.id}
                href={`/news/${rPost.slug}`}
                className="group flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#f8f9fa] mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rPost.coverImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop"}
                    alt={rPost.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest block">
                    {format(new Date(rPost.createdAt), "MMM dd, yyyy")}
                  </span>
                  <h4 className="text-sm font-light text-[#212529] font-heading uppercase tracking-[0.1em] line-clamp-2 group-hover:text-[#d12026] transition-colors leading-[1.6]">
                    {rPost.title}
                  </h4>
                  <div className="pt-2 text-[10px] font-medium uppercase tracking-widest text-[#212529] group-hover:text-[#d12026] transition-colors inline-flex items-center gap-2">
                    Read Article <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
