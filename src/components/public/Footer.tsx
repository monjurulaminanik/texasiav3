"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Mail, MessageSquare, Facebook, Linkedin, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          window.dispatchEvent(new Event("openRfqPopup"));
        }
      },
      { threshold: 0.1 }
    );
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Fetch global settings dynamically
  const { data: settings } = useQuery<any>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const year = new Date().getFullYear();

  const quickLinks = [
    { name: "Company Profile", href: "/profile" },
    { name: "Sustainability & Green", href: "/sustainability" },
    { name: "Accreditation & Audits", href: "/accreditation" },
    { name: "Open Careers", href: "/career" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact Sourcing", href: "/contact" },
  ];

  return (
    <footer ref={footerRef} className="bg-[#040d1a] border-t border-[#0f2545]/60 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: About */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0b2545] to-[#d4a574] p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-[#040d1a] rounded-[7px] flex items-center justify-center">
                <span className="text-[#d4a574] text-xs font-black font-heading tracking-tighter">TX</span>
              </div>
            </div>
            <span className="font-bold text-white font-heading text-sm tracking-tight leading-none">
              {settings?.siteName || "Texasia International"}
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-500">
            {settings?.tagline || "World-class readymade garment manufacturer and sourcing partner based in Dhaka, Bangladesh. WRAP, BSCI, SEDEX, and OEKO-TEX certified green facility."}
          </p>
          {/* Certification badges small row */}
          <div className="flex flex-wrap gap-2 text-[9px] font-bold text-slate-600">
            <span className="bg-[#0b2545]/30 border border-[#0f2545]/30 px-1.5 py-0.5 rounded">BSCI</span>
            <span className="bg-[#0b2545]/30 border border-[#0f2545]/30 px-1.5 py-0.5 rounded">SEDEX</span>
            <span className="bg-[#0b2545]/30 border border-[#0f2545]/30 px-1.5 py-0.5 rounded">WRAP</span>
            <span className="bg-[#0b2545]/30 border border-[#0f2545]/30 px-1.5 py-0.5 rounded">LEED GOLD</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white font-heading font-bold text-xs uppercase tracking-widest border-b border-[#0f2545] pb-2">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[#d4a574] transition-premium">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Seeded Categories preview */}
        <div className="space-y-4">
          <h4 className="text-white font-heading font-bold text-xs uppercase tracking-widest border-b border-[#0f2545] pb-2">
            Catalog Directory
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <Link href="/products/polos" className="hover:text-[#d4a574] transition-premium">Polos & Knits</Link>
            </li>
            <li>
              <Link href="/products/hoodies-sweatshirts" className="hover:text-[#d4a574] transition-premium">Sweatshirts & Hoodies</Link>
            </li>
            <li>
              <Link href="/products/denim-jeans" className="hover:text-[#d4a574] transition-premium">Denim & Jeans</Link>
            </li>
            <li>
              <Link href="/products/workwear" className="hover:text-[#d4a574] transition-premium">Industrial Workwear</Link>
            </li>
            <li>
              <Link href="/products/circular-knit-jersey" className="hover:text-[#d4a574] transition-premium">Circular Knit Jerseys</Link>
            </li>
            <li>
              <Link href="/products/jute-textile" className="hover:text-[#d4a574] transition-premium">Jute Textiles</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Social */}
        <div className="space-y-4">
          <h4 className="text-white font-heading font-bold text-xs uppercase tracking-widest border-b border-[#0f2545] pb-2">
            Dhaka Headquarters
          </h4>
          <ul className="space-y-3 text-xs leading-relaxed text-slate-500">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#d4a574] shrink-0 mt-0.5" />
              <span>{settings?.address || "House 45, Road 12, Mirpur DOHS, Dhaka, Bangladesh"}</span>
            </li>
            {settings?.phone && (
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4a574] shrink-0" />
                <span className="text-slate-400 font-semibold">{settings.phone}</span>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d4a574] shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-slate-400 font-semibold hover:text-[#d4a574] transition-premium">
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.whatsapp && (
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 font-semibold hover:text-emerald-400 transition-premium">
                  WhatsApp Direct Sourcing
                </a>
              </li>
            )}
          </ul>

          {/* Social Icons row */}
          <div className="flex items-center gap-3 pt-2">
            {settings?.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#d4a574] transition-premium">
                <Facebook className="w-4.5 h-4.5" />
              </a>
            )}
            {settings?.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#d4a574] transition-premium">
                <Linkedin className="w-4.5 h-4.5" />
              </a>
            )}
            {settings?.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#d4a574] transition-premium">
                <Instagram className="w-4.5 h-4.5" />
              </a>
            )}
            {settings?.youtube && (
              <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#d4a574] transition-premium">
                <Youtube className="w-4.5 h-4.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom strips */}
      <div className="max-w-7xl mx-auto px-6 border-t border-[#0f2545]/40 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-600 font-semibold">
        <div>
          <span>{settings?.footerText || `© ${year} Texasia International Fashion Co., Ltd. All rights reserved.`}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/profile" className="hover:text-white transition-premium">Privacy Policy</Link>
          <Link href="/why-choose-us" className="hover:text-white transition-premium">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
