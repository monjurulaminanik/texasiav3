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
    { name: "Sustainability", href: "/sustainability" },
    { name: "Accreditation", href: "/accreditation" },
    { name: "Careers", href: "/career" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer ref={footerRef} className="bg-white border-t border-gray-200 text-[#6c757d] pt-20 pb-10">
      <div className="max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        {/* Column 1: About */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#d12026] flex items-center justify-center text-white font-heading font-light text-lg">
              T
            </div>
            <span className="font-heading font-light text-[#212529] text-xs tracking-[0.3em] uppercase">
              QSA Apparels
            </span>
          </Link>
          <p className="text-xs leading-[1.8] font-light">
            {settings?.tagline || "World-class readymade garment manufacturer and sourcing partner based in Dhaka, Bangladesh."}
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-6">
          <h4 className="text-[#212529] font-heading font-light text-[10px] uppercase tracking-[0.2em]">
            Quick Links
          </h4>
          <ul className="space-y-3 text-[11px] font-medium tracking-widest uppercase">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[#d12026] transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Catalogs */}
        <div className="space-y-6">
          <h4 className="text-[#212529] font-heading font-light text-[10px] uppercase tracking-[0.2em]">
            Catalogs
          </h4>
          <ul className="space-y-3 text-[11px] font-medium tracking-widest uppercase">
            <li><Link href="/products/polos" className="hover:text-[#d12026] transition-colors">Polos</Link></li>
            <li><Link href="/products/hoodies-sweatshirts" className="hover:text-[#d12026] transition-colors">Sweatshirts</Link></li>
            <li><Link href="/products/denim-jeans" className="hover:text-[#d12026] transition-colors">Denim</Link></li>
            <li><Link href="/products/workwear" className="hover:text-[#d12026] transition-colors">Workwear</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="space-y-6">
          <h4 className="text-[#212529] font-heading font-light text-[10px] uppercase tracking-[0.2em]">
            Contact
          </h4>
          <ul className="space-y-4 text-[11px] leading-[1.6] font-medium uppercase tracking-widest">
            <li className="flex flex-col gap-1">
              <span className="text-[#212529]">Address</span>
              <span className="text-gray-500 font-light lowercase normal-case tracking-normal text-xs">{settings?.address || "Mirpur DOHS, Dhaka, Bangladesh"}</span>
            </li>
            {settings?.email && (
              <li className="flex flex-col gap-1">
                <span className="text-[#212529]">Email</span>
                <a href={`mailto:${settings.email}`} className="text-gray-500 font-light lowercase tracking-normal text-xs hover:text-[#d12026] transition-colors">
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.phone && (
              <li className="flex flex-col gap-1">
                <span className="text-[#212529]">Phone</span>
                <span className="text-gray-500 font-light tracking-normal text-xs">{settings.phone}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-[95%] mx-auto border-t border-gray-100 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-medium uppercase tracking-widest text-gray-400">
        <div>
          <span>{settings?.footerText || `© ${year} QSA Apparels. All rights reserved.`}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/profile" className="hover:text-[#212529] transition-colors">Privacy</Link>
          <Link href="/why-choose-us" className="hover:text-[#212529] transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
