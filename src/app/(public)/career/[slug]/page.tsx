import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ChevronRight, Home, Briefcase, MapPin, Clock, Calendar, CheckCircle, Mail } from "lucide-react";

interface JobDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = await prisma.job.findUnique({
    where: { slug },
  });

  if (!job || !job.isActive) return {};

  return {
    title: `${job.title} | Texasia International Careers`,
    description: `Join Texasia as ${job.title} in our ${job.location || "Dhaka"} branch. Read job responsibilities and B2B requirements.`,
  };
}

export default async function PublicJobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;

  // Fetch job details
  const job = await prisma.job.findUnique({
    where: { slug },
  });

  if (!job || !job.isActive) {
    notFound();
  }

  // Schema.org JobPosting structured JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.createdAt,
    "validThrough": new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(), // Valid for 3 months from view
    "employmentType": job.type === "Full-time" ? "FULL_TIME" : job.type === "Part-time" ? "PART_TIME" : "CONTRACTOR",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Texasia International Fashion Co., Ltd.",
      "sameAs": "http://localhost:3000"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dhaka",
        "addressRegion": "Dhaka Division",
        "addressCountry": "BD"
      }
    }
  };

  // Convert requirements and description (rich text) safely.
  // Note: Since this is rich text populated by the admin Tiptap editor, we render it using dangerouslySetInnerHTML.

  return (
    <div className="pt-28 pb-20 space-y-12">
      {/* Schema.org JobPosting structured JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs Strip */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/career" className="hover:text-white">
            Careers
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#d4a574] font-bold truncate max-w-[200px]">{job.title}</span>
        </div>
      </section>

      {/* Job Header & Metadata */}
      <section className="max-w-4xl mx-auto px-6 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-xs font-bold text-[#d4a574] tracking-widest uppercase bg-[#d4a574]/10 border border-[#d4a574]/30 px-3 py-1 rounded-full">
              {job.department || "Garment Sourcing"}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
              <Clock className="w-4 h-4 text-slate-500" /> {job.type || "Full-time"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-semibold border-y border-[#0f2545]/40 py-4 mt-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4.5 h-4.5 text-slate-600" /> {job.location || "Dhaka Office"}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-slate-600" /> Posted on {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </section>

      {/* Job Details & Apply Section */}
      <section className="max-w-4xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Main Details Pane */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-heading border-b border-[#0f2545] pb-2 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#d4a574]" /> Position Overview
            </h3>
            <article className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
            </article>
          </div>

          {job.requirements && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-heading border-b border-[#0f2545] pb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#d4a574]" /> Requirements & Experience
              </h3>
              <article className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
              </article>
            </div>
          )}
        </div>

        {/* Apply Sidebar Drawer card */}
        <aside className="lg:sticky lg:top-24 bg-[#081a33]/40 border border-[#0f2545]/60 rounded-2xl p-6 space-y-6">
          <h4 className="text-white font-heading font-extrabold text-sm border-b border-[#0f2545]/50 pb-3 flex items-center gap-2">
            <Mail className="w-4.5 h-4.5 text-[#d4a574]" /> Apply for this position
          </h4>

          <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
            <p>
              Please send your resume, CV, and custom sourcing portfolio directly to our HR team:
            </p>
            <div className="bg-[#0b2545]/60 border border-[#0f2545] p-3.5 rounded-xl text-center select-all cursor-pointer hover:border-slate-500 font-mono font-bold text-[#d4a574] text-xs">
              hr@texasiabd.com
            </div>
            <div className="space-y-2 border-t border-[#0f2545]/30 pt-4">
              <p className="font-semibold text-white text-xs">Application Instructions:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
                <li>Include position title in email subject: <span className="text-[#d4a574]">"Application: {job.title}"</span></li>
                <li>Attach CV and cover letter in PDF format</li>
                <li>State notice period and salary expectations</li>
              </ul>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
