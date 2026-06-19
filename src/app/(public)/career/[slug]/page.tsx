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
    title: `${job.title} | QSA Apparels Careers`,
    description: `Join QSA Apparels as ${job.title} in our ${job.location || "Dhaka"} branch. Read job responsibilities and B2B requirements.`,
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
      "name": "QSA Apparels",
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
    <div className="bg-white min-h-screen pt-40 pb-20">
      {/* Schema.org JobPosting structured JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs Strip */}
      <section className="max-w-[95%] mx-auto px-6 mb-16 border-b border-gray-100 pb-8">
        <div className="flex items-center flex-wrap gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
          <Link href="/" className="hover:text-[#212529] flex items-center gap-1 transition-colors">
            <Home className="w-3 h-3" /> Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/career" className="hover:text-[#212529] transition-colors">
            Careers
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#212529] font-bold truncate max-w-[200px]">{job.title}</span>
        </div>
      </section>

      {/* Job Header & Metadata */}
      <section className="max-w-4xl mx-auto px-6 space-y-10">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
              {job.department || "Corporate"}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-200" />
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> {job.type || "Full-time"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-light text-[#212529] font-heading tracking-[0.1em] leading-[1.3] uppercase">
            {job.title}
          </h1>

          <div className="flex items-center gap-6 text-[10px] font-medium uppercase tracking-widest text-gray-400 border-y border-gray-100 py-4 mt-6">
            <span className="flex items-center gap-2">
              <MapPin className="w-3 h-3" /> {job.location || "Dhaka Office"}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Posted {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </section>

      {/* Job Details & Apply Section */}
      <section className="max-w-4xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 items-start pt-16">
        {/* Main Details Pane */}
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <h3 className="text-[#212529] font-heading font-light tracking-[0.1em] text-lg uppercase border-b border-gray-100 pb-4">
              Position Overview
            </h3>
            <article className="prose max-w-none text-gray-600 text-base leading-[2] font-light prose-headings:font-light prose-headings:text-[#212529] prose-headings:tracking-[0.1em] prose-a:text-[#d12026]">
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
            </article>
          </div>

          {job.requirements && (
            <div className="space-y-6">
              <h3 className="text-[#212529] font-heading font-light tracking-[0.1em] text-lg uppercase border-b border-gray-100 pb-4">
                Requirements
              </h3>
              <article className="prose max-w-none text-gray-600 text-base leading-[2] font-light prose-headings:font-light prose-headings:text-[#212529] prose-headings:tracking-[0.1em] prose-a:text-[#d12026]">
                <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
              </article>
            </div>
          )}
        </div>

        {/* Apply Sidebar Drawer card */}
        <aside className="lg:sticky lg:top-32 bg-[#f8f9fa] p-8">
          <h4 className="text-[#212529] font-heading font-light tracking-[0.1em] text-sm uppercase border-b border-gray-200 pb-4 mb-6">
            Apply Now
          </h4>

          <div className="space-y-6">
            <p className="text-xs text-gray-500 font-light leading-[1.8]">
              Please send your resume, CV, and custom sourcing portfolio directly to our HR team:
            </p>
            <div className="bg-white border border-gray-200 p-4 text-center select-all font-mono font-medium text-[#d12026] text-xs">
              hr@qsaapparels.com
            </div>
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest block">Instructions:</p>
              <ul className="space-y-2 text-xs text-gray-500 font-light leading-[1.8]">
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#d12026] mt-2 shrink-0" />
                  <span>Subject: <span className="font-medium text-[#212529]">"Application: {job.title}"</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#d12026] mt-2 shrink-0" />
                  <span>Attach CV and cover letter in PDF format</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#d12026] mt-2 shrink-0" />
                  <span>State notice period and salary expectations</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
