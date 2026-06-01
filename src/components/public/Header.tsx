"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Menu, X, ChevronDown, ShoppingBag, Globe, ArrowRight } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Monitor scroll for header background opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page transition
  useEffect(() => {
    setIsOpen(false);
    setAboutDropdownOpen(false);
    setProductsDropdownOpen(false);
  }, [pathname]);

  // Fetch active categories for megamenu
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["publicCategories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) return [];
      const data = await res.json();
      return data.filter((c: any) => c.isActive);
    },
  });

  const aboutLinks = [
    { name: "Company Profile", href: "/profile" },
    { name: "Why Choose Us", href: "/why-choose-us" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Accreditation", href: "/accreditation" },
    { name: "Memberships", href: "/membership" },
  ];

  const isHome = pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-premium ${
        isScrolled
          ? "bg-[#040d1a] border-b border-[#0f2545]/50 shadow-lg py-3"
          : isHome
          ? "bg-transparent py-5"
          : "bg-[#040d1a] border-b border-[#0f2545]/50 py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0b2545] to-[#d4a574] p-[1px] flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-[#040d1a] rounded-[10px] flex items-center justify-center">
              <span className="text-[#d4a574] text-sm font-black font-heading tracking-tighter">TX</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white font-heading text-sm tracking-tight leading-none">Texasia</span>
            <span className="text-[9px] text-[#d4a574] tracking-widest font-black uppercase mt-0.5">International</span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-semibold transition-premium hover:text-[#d4a574] ${
              pathname === "/" ? "text-[#d4a574]" : "text-slate-200"
            }`}
          >
            Home
          </Link>

          {/* About Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
              className="flex items-center gap-1 text-sm font-semibold text-slate-200 hover:text-[#d4a574] transition-premium focus:outline-none cursor-pointer"
            >
              About Us <ChevronDown className="w-4 h-4" />
            </button>
            {aboutDropdownOpen && (
              <div
                onMouseLeave={() => setAboutDropdownOpen(false)}
                className="absolute top-full left-0 mt-2 w-52 bg-[#081a33] border border-[#0f2545] rounded-xl overflow-hidden shadow-2xl p-2 animate-in fade-in duration-200"
              >
                {aboutLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2 text-xs font-semibold rounded-lg hover:bg-[#d4a574] hover:text-[#040d1a] transition-premium ${
                      pathname === link.href ? "bg-[#d4a574] text-[#040d1a]" : "text-slate-300"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Products mega menu dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setProductsDropdownOpen(true)}
              onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
              className="flex items-center gap-1 text-sm font-semibold text-slate-200 hover:text-[#d4a574] transition-premium focus:outline-none cursor-pointer"
            >
              PRODUCTS <ChevronDown className="w-4 h-4" />
            </button>
            {productsDropdownOpen && (
              <div
                onMouseLeave={() => {
                  setProductsDropdownOpen(false);
                  setActiveCategoryId(null);
                }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[800px] bg-white text-[#040d1a] border border-gray-200 shadow-2xl flex animate-in fade-in duration-200"
              >
                {/* Left Sidebar: Main Categories */}
                <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col py-2">
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/products/${cat.slug}`}
                      onMouseEnter={() => setActiveCategoryId(cat.id)}
                      className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between group ${
                        activeCategoryId === cat.id ? "bg-[#fdeaea] text-[#e63946]" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.name}
                      {cat.children && cat.children.length > 0 && (
                        <ArrowRight className={`w-3 h-3 ${activeCategoryId === cat.id ? "text-[#e63946]" : "text-gray-400 group-hover:text-gray-700"}`} />
                      )}
                    </Link>
                  ))}
                </div>
                
                {/* Right Pane: Subcategories */}
                <div className="w-2/3 p-6 bg-white min-h-[300px]">
                  {categories.find((c: any) => c.id === activeCategoryId)?.children?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                      {categories.find((c: any) => c.id === activeCategoryId)?.children?.map((subCat: any) => (
                        <Link
                          key={subCat.id}
                          href={`/products/${subCat.slug}`}
                          className="text-sm font-medium text-gray-600 hover:text-[#e63946] transition-colors"
                        >
                          {subCat.name}
                        </Link>
                      ))}
                    </div>
                  ) : activeCategoryId ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <ShoppingBag className="w-10 h-10 mb-2 opacity-50" />
                      <p className="text-sm font-medium">Click to view all {categories.find((c: any) => c.id === activeCategoryId)?.name}</p>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <p className="text-sm font-medium">Hover over a category to see more</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/news"
            className={`text-sm font-semibold transition-premium hover:text-[#d4a574] ${
              pathname.startsWith("/news") ? "text-[#d4a574]" : "text-slate-200"
            }`}
          >
            Insights
          </Link>

          <Link
            href="/career"
            className={`text-sm font-semibold transition-premium hover:text-[#d4a574] ${
              pathname.startsWith("/career") ? "text-[#d4a574]" : "text-slate-200"
            }`}
          >
            Careers
          </Link>

          <Link
            href="/contact"
            className={`text-sm font-semibold transition-premium hover:text-[#d4a574] ${
              pathname === "/contact" ? "text-[#d4a574]" : "text-slate-200"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* CTA Get Quote button */}
        <div className="hidden lg:block">
          <Link
            href="/request-for-quotation"
            className="bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg transition-premium cursor-pointer"
          >
            <Globe className="w-4 h-4" /> Get Quote
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-slate-300 hover:text-white p-1 rounded-lg hover:bg-[#0b2545] cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-64 bg-[#081a33] border-l border-[#0f2545] z-50 p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200 lg:hidden">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#0f2545] pb-4">
              <span className="font-bold text-white font-heading">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-4 text-sm font-semibold text-slate-300">
              <Link href="/" className="hover:text-[#d4a574] transition-premium">Home</Link>
              
              {/* Mobile About links */}
              <div className="space-y-2 border-y border-[#0f2545] py-2">
                <span className="text-[10px] uppercase tracking-wider text-[#d4a574] font-bold">About Us</span>
                {aboutLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block pl-3 text-xs font-medium hover:text-white transition-premium">
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Products links */}
              <Link href="/products" className="hover:text-[#d4a574] transition-premium">Products</Link>
              <Link href="/news" className="hover:text-[#d4a574] transition-premium">Insights</Link>
              <Link href="/career" className="hover:text-[#d4a574] transition-premium">Careers</Link>
              <Link href="/contact" className="hover:text-[#d4a574] transition-premium">Contact</Link>
            </nav>
          </div>

          <div>
            <Link
              href="/request-for-quotation"
              className="w-full bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-premium cursor-pointer"
            >
              <Globe className="w-4 h-4" /> Get Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
