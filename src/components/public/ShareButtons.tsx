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
        className="p-3 rounded-full border border-gray-200 text-gray-400 hover:text-[#d12026] hover:border-[#d12026] bg-white transition-colors"
        title="LinkedIn Share"
      >
        <Linkedin className="w-4 h-4" />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-full border border-gray-200 text-gray-400 hover:text-[#d12026] hover:border-[#d12026] bg-white transition-colors"
        title="Facebook Share"
      >
        <Facebook className="w-4 h-4" />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-full border border-gray-200 text-gray-400 hover:text-[#d12026] hover:border-[#d12026] bg-white transition-colors"
        title="WhatsApp Share"
      >
        <Send className="w-4 h-4" />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="p-3 rounded-full border border-gray-200 text-gray-400 hover:text-[#d12026] hover:border-[#d12026] bg-white transition-colors flex items-center justify-center relative w-10 h-10"
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
