"use client";

import React, { useState } from "react";
import { Linkedin, Facebook, Send, Copy, CheckCircle } from "lucide-react";

interface ShareButtonsProps {
  shareUrl: string;
  title: string;
}

export default function ShareButtons({ shareUrl, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-[#0b2545]/50 border border-[#0f2545] text-slate-400 hover:text-[#d4a574] hover:bg-[#0b2545] transition-premium"
        title="LinkedIn Share"
      >
        <Linkedin className="w-4.5 h-4.5" />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-[#0b2545]/50 border border-[#0f2545] text-slate-400 hover:text-[#d4a574] hover:bg-[#0b2545] transition-premium"
        title="Facebook Share"
      >
        <Facebook className="w-4.5 h-4.5" />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-[#0b2545]/50 border border-[#0f2545] text-slate-400 hover:text-emerald-400 hover:bg-[#0b2545] transition-premium"
        title="WhatsApp Share"
      >
        <Send className="w-4.5 h-4.5" />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg bg-[#0b2545]/50 border border-[#0f2545] text-slate-400 hover:text-white hover:bg-[#0b2545] cursor-pointer transition-premium flex items-center gap-1.5"
        title="Copy Link"
      >
        {copied ? (
          <>
            <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400">Copied!</span>
          </>
        ) : (
          <Copy className="w-4.5 h-4.5" />
        )}
      </button>
    </div>
  );
}
