"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  FileText,
  FileCode,
  HelpCircle,
  Briefcase,
  Inbox,
  MessageSquare,
  Image,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Blog Posts", href: "/admin/blog", icon: FileText },
    { name: "Static Pages", href: "/admin/pages", icon: FileCode },
    { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    { name: "Job Openings", href: "/admin/jobs", icon: Briefcase },
    { name: "RFQ Inbox", href: "/admin/rfqs", icon: Inbox },
    { name: "Contacts", href: "/admin/contacts", icon: MessageSquare },
    { name: "Media Library", href: "/admin/media", icon: Image },
  ];

  // Only admins see the User manager
  if (session?.user && (session.user as any).role === "admin") {
    menuItems.push({ name: "User Managers", href: "/admin/users", icon: Users });
  }

  // Settings is global
  menuItems.push({ name: "Site Settings", href: "/admin/settings", icon: Settings });

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 bg-[#081a33] border-r border-[#0f2545] w-64 z-50 flex flex-col transition-all duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#0f2545]">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0b2545] to-[#d4a574] p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-[#081a33] rounded-[7px] flex items-center justify-center">
                <span className="text-[#d4a574] text-xs font-bold font-heading">TX</span>
              </div>
            </div>
            <span className="font-bold text-white font-heading tracking-tight text-sm">
              Texasia CMS
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-premium cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-premium ${
                  isActive
                    ? "bg-[#d4a574] text-[#040d1a]"
                    : "text-slate-300 hover:bg-[#0b2545] hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#040d1a]" : "text-slate-400"}`} />
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Footer User blurb & Logout */}
        <div className="p-4 border-t border-[#0f2545]">
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#040d1a]/50">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {session?.user?.name || "Admin User"}
              </p>
              <p className="text-xs text-slate-400 truncate capitalize">
                {(session?.user as any)?.role || "Administrator"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 transition-premium cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
