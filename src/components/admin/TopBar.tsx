"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Menu, Bell, User } from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();

  // Compute page title based on path
  const getPageTitle = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length <= 1) return "Dashboard";
    const sub = parts[1];
    
    // Capitalize and format
    return sub
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Fetch pending notifications from dashboard api
  const { data: notificationCount = 0 } = useQuery<number>({
    queryKey: ["pendingNotifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (!res.ok) return 0;
        const data = await res.json();
        return (data.newRfqsCount || 0) + (data.newContactsCount || 0);
      } catch {
        return 0;
      }
    },
    refetchInterval: 30000, // Poll every 30s
  });

  return (
    <header className="h-16 bg-[#081a33]/60 backdrop-blur-xl border-b border-[#0f2545] sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-300 hover:text-white p-1 rounded-lg hover:bg-[#0b2545] cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white font-heading">
            {getPageTitle()}
          </h2>
        </div>
      </div>

      {/* Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <a
          href="/admin/rfqs"
          className="relative text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-[#0b2545] transition-premium cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {notificationCount}
            </span>
          )}
        </a>

        {/* Avatar indicator */}
        <div className="h-8 w-8 rounded-lg bg-[#0b2545] border border-[#0f2545] flex items-center justify-center text-slate-300">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
