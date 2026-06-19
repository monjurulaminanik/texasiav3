"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Menu, X, ShoppingBag, ArrowRight } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setAboutDropdownOpen(false);
    setProductsDropdownOpen(false);
  }, [pathname]);

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["publicCategories"],
    queryFn: async () => {
      const res = await fetch("/api/categories?include=products");
      if (!res.ok) return [];
      const data = await res.json();
      return data.filter((c: any) => c.isActive);
    },
  });

  const aboutLinks = [
    { name: "COMPANY PROFILE", href: "/profile" },
    { name: "WHY TEXASIA", href: "/why-choose-us" },
    { name: "SUSTAINABILITY", href: "/sustainability" },
    { name: "ACCREDITATION", href: "/accreditation" },
    { name: "MEMBERSHIPS", href: "/membership" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-4"
          : "bg-white/95 backdrop-blur-md py-6"
      }`}
    >
      <div className="max-w-[95%] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#d12026] flex items-center justify-center text-white font-heading font-light text-xl">
            T
          </div>
          <span className="hidden sm:block font-heading text-[#212529] text-xs tracking-[0.3em] uppercase">QSA Apparels</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link href="/" className="text-[11px] font-medium text-[#212529] hover:text-[#d12026] uppercase tracking-widest transition-colors">
            HOME
          </Link>
          <Link href="/ceo-profile" className="text-[11px] font-medium text-[#212529] hover:text-[#d12026] uppercase tracking-widest transition-colors">
            CEO PROFILE
          </Link>
          <div 
            className="relative"
            onMouseEnter={() => setAboutDropdownOpen(true)}
            onMouseLeave={() => setAboutDropdownOpen(false)}
          >
            <button
              className="text-[11px] font-medium text-[#212529] hover:text-[#d12026] uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer py-6"
            >
              ABOUT
            </button>
            {aboutDropdownOpen && (
              <div className="absolute top-[calc(100%-15px)] left-0 pt-4 w-56 animate-in fade-in duration-200">
                <div className="bg-white border border-[#e9ecef] shadow-lg p-2">
                  {aboutLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-3 text-[10px] font-medium tracking-widest text-[#212529] hover:bg-[#f8f9fa] hover:text-[#d12026] transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div 
            className="relative" 
            onMouseEnter={() => setProductsDropdownOpen(true)}
            onMouseLeave={() => {
              setProductsDropdownOpen(false);
              setActiveCategoryId(null);
            }}
          >
            <Link
              href="/products"
              className="text-[11px] font-medium text-[#212529] hover:text-[#d12026] uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer py-6"
            >
              PRODUCT
            </Link>
            {/* Products Dropdown (Minimal light version) */}
            {productsDropdownOpen && (
              <div className="absolute top-[calc(100%-15px)] left-1/2 -translate-x-1/2 pt-4 w-[600px] animate-in fade-in duration-200">
                <div className="bg-white border border-[#e9ecef] shadow-xl flex">
                  <div className="w-1/3 border-r border-[#e9ecef] bg-[#f8f9fa] flex flex-col py-2">
                    {categories.map((cat: any) => (
                      <Link
                        key={cat.id}
                        href={`/products/${cat.slug}`}
                        onMouseEnter={() => setActiveCategoryId(cat.id)}
                        className={`px-6 py-3 text-[10px] font-medium uppercase tracking-widest transition-colors flex items-center justify-between ${
                          activeCategoryId === cat.id ? "bg-white text-[#d12026]" : "text-[#212529] hover:bg-white"
                        }`}
                      >
                        {cat.name}
                        {(cat.children?.length > 0 || cat.products?.length > 0) && (
                          <ArrowRight className={`w-3 h-3 ${activeCategoryId === cat.id ? "text-[#d12026]" : "text-gray-300"}`} />
                        )}
                      </Link>
                    ))}
                  </div>
                  <div className="w-2/3 p-6 bg-white max-h-[400px] overflow-y-auto">
                    {(() => {
                      const activeCat = categories.find((c: any) => c.id === activeCategoryId);
                      if (!activeCat) {
                        return (
                          <div className="h-full flex items-center justify-center text-[#6c757d]">
                            <p className="text-[10px] tracking-widest uppercase">Select a category</p>
                          </div>
                        );
                      }

                      if (activeCat.products?.length > 0) {
                        return (
                          <div className="grid grid-cols-2 gap-4">
                            {activeCat.products.map((product: any) => (
                              <Link key={product.id} href={`/products/${activeCat.slug}/${product.slug}`} className="text-[11px] text-[#6c757d] hover:text-[#d12026] tracking-wider leading-relaxed">
                                {product.name}
                              </Link>
                            ))}
                          </div>
                        );
                      }

                      if (activeCat.children?.length > 0) {
                        return (
                          <div className="grid grid-cols-2 gap-4">
                            {activeCat.children.map((subCat: any) => (
                              <Link key={subCat.id} href={`/products/${subCat.slug}`} className="text-[11px] text-[#6c757d] hover:text-[#d12026] tracking-wider uppercase">
                                {subCat.name}
                              </Link>
                            ))}
                          </div>
                        );
                      }

                      return (
                        <div className="h-full flex flex-col items-center justify-center text-[#6c757d]">
                          <ShoppingBag className="w-8 h-8 mb-2 opacity-20" />
                          <p className="text-[10px] tracking-widest uppercase">Click to view category</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/news" className="text-[11px] font-medium text-[#212529] hover:text-[#d12026] uppercase tracking-widest transition-colors">
            INSIGHTS
          </Link>
          <Link href="/career" className="text-[11px] font-medium text-[#212529] hover:text-[#d12026] uppercase tracking-widest transition-colors">
            CAREERS
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden lg:block">
          <Link href="/contact" className="text-[11px] font-medium text-[#212529] hover:text-[#d12026] uppercase tracking-widest transition-colors">
            + CONTACT US
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-[#212529]">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-64 bg-white border-l border-[#e9ecef] shadow-2xl z-50 p-6 flex flex-col lg:hidden animate-in slide-in-from-right duration-200">
          <div className="flex justify-end mb-8">
            <button onClick={() => setIsOpen(false)} className="text-[#212529]">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-6">
            <Link href="/" className="text-xs font-medium tracking-widest uppercase text-[#212529] hover:text-[#d12026]">HOME</Link>
            <Link href="/ceo-profile" className="text-xs font-medium tracking-widest uppercase text-[#212529] hover:text-[#d12026]">CEO PROFILE</Link>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] tracking-widest uppercase text-[#d12026]">ABOUT</span>
              {aboutLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-xs font-medium tracking-widest uppercase text-[#6c757d] hover:text-[#d12026] pl-2">{link.name}</Link>
              ))}
            </div>
            <Link href="/products" className="text-xs font-medium tracking-widest uppercase text-[#212529] hover:text-[#d12026]">PRODUCTS</Link>
            <Link href="/news" className="text-xs font-medium tracking-widest uppercase text-[#212529] hover:text-[#d12026]">INSIGHTS</Link>
            <Link href="/career" className="text-xs font-medium tracking-widest uppercase text-[#212529] hover:text-[#d12026]">CAREERS</Link>
            <Link href="/contact" className="text-xs font-medium tracking-widest uppercase text-[#212529] hover:text-[#d12026] mt-4 pt-4 border-t border-[#e9ecef]">+ CONTACT US</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
