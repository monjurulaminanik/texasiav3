import React from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import PopupRfqForm from "@/components/public/PopupRfqForm";

export default function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#040d1a] text-slate-100">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <PopupRfqForm />
    </div>
  );
}
