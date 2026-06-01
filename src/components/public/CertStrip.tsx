import React from "react";

export default function CertStrip() {
  const certifications = [
    { name: "BSCI", desc: "Social Compliance Certified" },
    { name: "SEDEX", desc: "SMETA 4-Pillar Audited" },
    { name: "WRAP", desc: "Gold Responsible Production" },
    { name: "OEKO-TEX", desc: "Standard 100 Safety Dyes" },
    { name: "ISO 9001", desc: "Quality Management Certified" },
    { name: "LEED Gold", desc: "Eco-Friendly Green Facility" },
  ];

  return (
    <section className="bg-slate-50 dark:bg-[#081a33]/40 border-y border-slate-100 dark:border-[#0f2545] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-bold text-[#d4a574] tracking-widest uppercase mb-6">
          Globally Audited & Certified B2B RMG Operations
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="flex flex-col items-center text-center p-4 rounded-xl border border-slate-100 dark:border-[#0f2545]/50 bg-white dark:bg-[#040d1a]/80 shadow-sm w-full max-w-[160px] group hover:border-[#d4a574]/40 hover:-translate-y-1 transition-premium"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#0b2545] flex items-center justify-center mb-2 group-hover:bg-[#d4a574]/10 transition-premium">
                <span className="text-xs font-black text-slate-800 dark:text-white group-hover:text-[#d4a574] font-heading tracking-tighter">
                  {cert.name}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                {cert.name}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">
                {cert.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
