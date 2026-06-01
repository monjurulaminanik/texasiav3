export const dynamic = 'force-dynamic'

import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Careers & Job Openings | Texasia International",
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
    <div className="pt-28 pb-20 space-y-12">
      {/* Intro Hero Banner */}
      <section className="max-w-7xl mx-auto px-6 space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#d4a574]/10 border border-[#d4a574]/30 px-3 py-1 rounded-full text-[10px] font-bold text-[#d4a574] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Shape the Future of Apparel Sourcing
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
          Join the Texasia Team
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">
          At Texasia International, we blend cutting-edge merchandising technology with green compliance principles. Join our office in Dhaka and collaborate with premium retail brands globally.
        </p>
      </section>

      {/* Filters Strip */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-[#081a33]/30 border border-[#0f2545]/60 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center w-full">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">Filter Roles:</span>
            
            {/* All Roles Reset Button */}
            <Link
              href="/career"
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-premium ${
                !selectedType && !selectedDept
                  ? "bg-[#d4a574] text-[#040d1a] border-[#d4a574]"
                  : "border-[#0f2545] text-slate-400 hover:text-white hover:border-slate-500 bg-[#081a33]/20"
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
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-premium ${
                    isSelected
                      ? "bg-[#d4a574] text-[#040d1a] border-[#d4a574]"
                      : "border-[#0f2545] text-slate-400 hover:text-white hover:border-slate-500 bg-[#081a33]/20"
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
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-premium ${
                    isSelected
                      ? "bg-[#d4a574] text-[#040d1a] border-[#d4a574]"
                      : "border-[#0f2545] text-slate-400 hover:text-white hover:border-slate-500 bg-[#081a33]/20"
                  }`}
                >
                  {type}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Openings Listing Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-6">
        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-[#081a33]/10 border border-[#0f2545]/40 rounded-2xl max-w-4xl mx-auto space-y-4">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm font-medium">No open positions currently match your filter selections.</p>
            <div className="text-xs text-slate-500">
              Please check back later or submit an open application directly via email to{" "}
              <span className="text-[#d4a574]">hr@texasiabd.com</span>
            </div>
            <Link href="/career" className="text-xs text-[#d4a574] hover:underline block pt-2">
              Reset Filters →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/career/${job.slug}`}
                className="bg-[#081a33]/20 border border-[#0f2545]/50 hover:border-[#d4a574]/30 rounded-2xl p-6 md:p-8 group shadow-md transition-premium flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-bold text-[#d4a574] uppercase tracking-wider bg-[#d4a574]/10 border border-[#d4a574]/20 px-2.5 py-0.5 rounded-full">
                      {job.department || "Corporate"}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {job.type || "Full-time"}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold text-white font-heading group-hover:text-[#d4a574] transition-premium">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-500" /> {job.location || "Dhaka Office"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-[#d4a574] group-hover:translate-x-1 transition-premium bg-[#d4a574]/5 border border-[#d4a574]/20 px-4 py-2 rounded-xl">
                  View Position details <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Culture Sourcing Strip */}
      <section className="max-w-4xl mx-auto px-6 pt-12 border-t border-[#0f2545]/30">
        <div className="bg-[#0b2545]/30 border border-[#0f2545] rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4a574]/5 via-transparent to-transparent pointer-events-none" />
          <h3 className="text-xl md:text-2xl font-extrabold text-white font-heading">
            Not Finding the Perfect Fit?
          </h3>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            We are always searching for experienced apparel merchandisers, textile engineers, and strict QA/QC controllers. Submit your portfolio and CV to our talent database.
          </p>
          <a
            href="mailto:hr@texasiabd.com"
            className="inline-block bg-[#d4a574] text-[#040d1a] font-bold text-xs md:text-sm px-6 py-3 rounded-xl hover:bg-[#c39463] hover:scale-102 transition-premium"
          >
            Submit Open Application
          </a>
        </div>
      </section>
    </div>
  );
}

