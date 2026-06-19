import React from "react";
import Link from "next/link";
import { ArrowRight, Globe, TrendingUp, Award, Users } from "lucide-react";

export const metadata = {
  title: "CEO Profile | Wasi Alave - Quadra Source Apparels",
  description: "Meet Wasi Alave, the Founder & CEO of QSA Apparels. A veteran RMG merchandiser providing global consultation and end-to-end procurement.",
};

export default function CeoProfilePage() {
  return (
    <div className="bg-white min-h-screen pt-40 pb-20">
      {/* HERO SECTION */}
      <section className="relative max-w-[95%] mx-auto px-6 border-b border-gray-100 pb-16 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-[10px] font-medium text-[#d12026] uppercase tracking-widest">
              Founder & CEO
            </span>
            <h1 className="text-4xl md:text-6xl font-light text-[#212529] font-heading tracking-[0.1em] leading-[1.2] uppercase">
              Wasi Alave
            </h1>
            <p className="text-gray-500 text-base md:text-lg font-light leading-[1.8] max-w-xl">
              A visionary leader and veteran merchandiser in Bangladesh's RMG sector. 
              Bridging the gap between world-class manufacturing and global retail brands through strategic sourcing, 
              end-to-end procurement, and lifetime dedication to the apparel industry.
            </p>
            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-[#212529] text-white hover:bg-[#d12026] px-8 py-4 transition-colors text-[11px] font-medium tracking-[0.2em] uppercase"
              >
                Consult With Wasi <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="relative aspect-[4/5] bg-[#f8f9fa] overflow-hidden group">
            {/* Using a placeholder aesthetic image representing a business professional in textile/manufacturing */}
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=1000&fit=crop" 
              alt="Wasi Alave"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
        </div>
      </section>

      {/* THE JOURNEY */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-[#212529] font-heading tracking-[0.2em] uppercase">
            A Lifetime in Merchandising
          </h2>
          <div className="w-12 h-px bg-[#d12026] mx-auto"></div>
        </div>
        
        <div className="prose max-w-none text-gray-500 text-base leading-[2] font-light text-center">
          <p className="mb-6">
            Wasi Alave's journey is a testament to dedication and an unrelenting pursuit of excellence in the 
            Ready-Made Garment (RMG) industry. Starting his career from the ground up at QSA Apparels, he dedicated his 
            lifetime to mastering the complexities of the merchandising line. From understanding the nuanced weaves of 
            raw fabrics to managing high-stakes international shipments, his hands-on experience forms the backbone of 
            Quadra Source Apparels (QSA).
          </p>
          <p>
            Today, as a well-established and highly respected merchandiser located in Bangladesh, he serves as a pivotal 
            bridge for the global apparel market. Buyers from across the world—spanning North America, Europe, and beyond—rely 
            on his deep industry insights. He provides holistic consultation, seamless shipment logistics, and comprehensive 
            supply procurement strategies that ensure quality, compliance, and timely delivery.
          </p>
        </div>
      </section>

      {/* EXPERTISE GRID */}
      <section className="max-w-[95%] mx-auto px-6 py-20 bg-[#f8f9fa] mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="space-y-6 bg-white p-8 border border-transparent hover:border-gray-200 transition-colors">
            <Globe className="w-8 h-8 text-[#d12026]" strokeWidth={1} />
            <h3 className="text-sm font-medium text-[#212529] uppercase tracking-widest">Global Network</h3>
            <p className="text-gray-500 text-xs font-light leading-[1.8]">
              Connecting international buyers with top-tier, compliant manufacturing facilities across Bangladesh.
            </p>
          </div>

          <div className="space-y-6 bg-white p-8 border border-transparent hover:border-gray-200 transition-colors">
            <TrendingUp className="w-8 h-8 text-[#d12026]" strokeWidth={1} />
            <h3 className="text-sm font-medium text-[#212529] uppercase tracking-widest">Strategic Consultation</h3>
            <p className="text-gray-500 text-xs font-light leading-[1.8]">
              Advising brands on market trends, sustainable fabric sourcing, and cost-effective production scaling.
            </p>
          </div>

          <div className="space-y-6 bg-white p-8 border border-transparent hover:border-gray-200 transition-colors">
            <Users className="w-8 h-8 text-[#d12026]" strokeWidth={1} />
            <h3 className="text-sm font-medium text-[#212529] uppercase tracking-widest">Supply Procurement</h3>
            <p className="text-gray-500 text-xs font-light leading-[1.8]">
              End-to-end supply chain management ensuring raw materials meet strict international quality standards.
            </p>
          </div>

          <div className="space-y-6 bg-white p-8 border border-transparent hover:border-gray-200 transition-colors">
            <Award className="w-8 h-8 text-[#d12026]" strokeWidth={1} />
            <h3 className="text-sm font-medium text-[#212529] uppercase tracking-widest">Flawless Shipments</h3>
            <p className="text-gray-500 text-xs font-light leading-[1.8]">
              Decades of experience guaranteeing smooth logistics, compliance auditing, and on-time international delivery.
            </p>
          </div>

        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center space-y-8">
        <h2 className="text-2xl md:text-4xl font-light text-[#212529] font-heading tracking-[0.1em] uppercase">
          Ready to Elevate Your Sourcing?
        </h2>
        <p className="text-gray-500 text-sm font-light leading-[1.8] max-w-2xl mx-auto">
          Partner with an industry veteran who understands the pulse of global apparel manufacturing. Let's discuss your next collection.
        </p>
        <div className="pt-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-[#212529] text-[#212529] hover:bg-[#212529] hover:text-white px-8 py-4 transition-colors text-[11px] font-medium tracking-[0.2em] uppercase"
          >
            Get In Touch
          </Link>
        </div>
      </section>

    </div>
  );
}
