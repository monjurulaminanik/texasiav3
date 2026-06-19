export const dynamic = 'force-dynamic'

import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Careers & Job Openings | QSA Apparels",
  description: "Join the leading B2B apparel manufacturer and global sourcing agency in Dhaka. Explore our latest jobs in QC, merchandising, design, and supply chain.",
};

interface CareerPageProps {
  searchParams: Promise<{
    type?: string;
    department?: string;
  }>;
}

export default async function PublicCareerListingPage({ searchParams }: CareerPageProps) {
  const params = await searchParams;
  const selectedType = params.type || "";
  const selectedDept = params.department || "";

  // Query published active jobs
  const jobs = await prisma.job.findMany({
    where: {
      isActive: true,
      ...(selectedType ? { type: selectedType } : {}),
      ...(selectedDept ? { department: selectedDept } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  // Extract unique departments for filtering
  const allActiveJobs = await prisma.job.findMany({
    where: { isActive: true },
    select: { department: true, type: true },
  });

  const uniqueDepartments = Array.from(new Set(allActiveJobs.map((j) => j.department).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(allActiveJobs.map((j) => j.type).filter(Boolean)));

  return (
    <div className="bg-white min-h-screen pt-40 pb-20">
      {/* SECTION 1: HERO CONTAINER (Centro Minimalist) */}
      <section className="relative max-w-[95%] mx-auto px-6 border-b border-gray-100 pb-16 mb-16">
        <h1 className="text-3xl md:text-5xl font-light text-[#212529] font-heading tracking-[0.2em] uppercase text-center mb-6">
          CAREERS
        </h1>
        <p className="text-gray-500 text-sm text-center max-w-2xl mx-auto font-light leading-[1.8]">
          At QSA Apparels, we blend cutting-edge merchandising technology with green compliance principles. Join our office in Dhaka and collaborate with premium retail brands globally.
        </p>
      </section>

      {/* Filters Strip */}
      <section className="max-w-[95%] mx-auto px-6 mb-12">
        <div className="flex flex-wrap gap-4 items-center justify-center border-b border-gray-100 pb-8">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mr-2">Roles:</span>
          
          {/* All Roles Reset Button */}
          <Link
            href="/career"
            className={`text-[10px] font-medium uppercase tracking-widest px-4 py-2 transition-colors ${
              !selectedType && !selectedDept
                ? "bg-[#212529] text-white"
                : "bg-[#f8f9fa] text-gray-500 hover:bg-[#e9ecef]"
            }`}
          >
            All Openings
          </Link>

          {/* Department Filters */}
          {uniqueDepartments.map((dept) => {
            const isSelected = selectedDept === dept;
            const newParams = new URLSearchParams();
            if (selectedType) newParams.set("type", selectedType);
            newParams.set("department", dept || "");
            return (
              <Link
                key={dept}
                href={`/career?${newParams.toString()}`}
                className={`text-[10px] font-medium uppercase tracking-widest px-4 py-2 transition-colors ${
                  isSelected
                    ? "bg-[#212529] text-white"
                    : "bg-[#f8f9fa] text-gray-500 hover:bg-[#e9ecef]"
                }`}
              >
                {dept}
              </Link>
            );
          })}

          {/* Job Type Filters */}
          {uniqueTypes.map((type) => {
            const isSelected = selectedType === type;
            const newParams = new URLSearchParams();
            if (selectedDept) newParams.set("department", selectedDept);
            newParams.set("type", type || "");
            return (
              <Link
                key={type}
                href={`/career?${newParams.toString()}`}
                className={`text-[10px] font-medium uppercase tracking-widest px-4 py-2 transition-colors ${
                  isSelected
                    ? "bg-[#212529] text-white"
                    : "bg-[#f8f9fa] text-gray-500 hover:bg-[#e9ecef]"
                }`}
              >
                {type}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Openings Listing Grid */}
      <section className="max-w-4xl mx-auto px-6 space-y-6">
        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-[#f8f9fa]">
            <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-sm font-light uppercase tracking-widest mb-2">No positions match your filter.</p>
            <p className="text-[11px] text-gray-400">
              Submit an open application via email to{" "}
              <span className="text-[#212529]">hr@qsaapparels.com</span>
            </p>
            <Link href="/career" className="text-[10px] font-medium tracking-widest uppercase text-[#d12026] hover:text-[#a5191f] mt-6 inline-block">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/career/${job.slug}`}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-gray-100 hover:border-gray-300 p-8 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
                      {job.department || "Corporate"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-200" />
                    <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {job.type || "Full-time"}
                    </span>
                  </div>
                  <h3 className="text-xl font-light text-[#212529] font-heading tracking-[0.1em] uppercase group-hover:text-[#d12026] transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-light text-gray-500 uppercase tracking-widest">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location || "Dhaka Office"}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-medium text-[#212529] uppercase tracking-widest group-hover:text-[#d12026] transition-colors shrink-0">
                  View Position <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Culture Sourcing Strip */}
      <section className="max-w-4xl mx-auto px-6 pt-24 mt-24 border-t border-gray-100">
        <div className="bg-[#f8f9fa] p-12 text-center space-y-8">
          <h3 className="text-lg md:text-xl font-light text-[#212529] font-heading tracking-[0.1em] uppercase">
            Not Finding the Perfect Fit?
          </h3>
          <p className="text-sm text-gray-500 max-w-xl mx-auto font-light leading-[1.8]">
            We are always searching for experienced apparel merchandisers, textile engineers, and strict QA/QC controllers. Submit your portfolio and CV to our talent database.
          </p>
          <a
            href="mailto:hr@qsaapparels.com"
            className="inline-block bg-[#212529] text-white font-medium text-[10px] uppercase tracking-widest px-8 py-4 hover:bg-[#d12026] transition-colors mt-4"
          >
            Submit Application
          </a>
        </div>
      </section>
    </div>
  );
}

