"use client";

import React, { useState } from "react";
import { ZoomIn, X } from "lucide-react";

interface ImageItem {
  id: string;
  url: string;
  alt: string | null;
}

interface ProductGalleryProps {
  images: ImageItem[];
  productName: string;
}

export default function ProductGallery({ images = [], productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    images.push({
      id: "fallback",
      url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&h=750&fit=crop",
      alt: productName,
    });
  }

  const currentImage = images[activeIndex];

  return (
    <div className="space-y-4">
      {/* Large Main Image display */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#0f2545] bg-[#040d1a] group shadow-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage.url}
          alt={currentImage.alt || productName}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-premium cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        />
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-4 right-4 p-2 rounded-xl bg-slate-950/80 text-slate-300 border border-[#0f2545] hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-premium"
          title="Zoom View"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="flex gap-4">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(index)}
              className={`relative w-20 aspect-[4/5] rounded-xl overflow-hidden bg-[#040d1a] border transition-premium cursor-pointer ${
                activeIndex === index
                  ? "border-[#d4a574] ring-1 ring-[#d4a574]/40"
                  : "border-[#0f2545] hover:border-slate-500"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Zoom Overlay Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center lightbox-overlay animate-in fade-in duration-200">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-xl bg-[#081a33]/85 text-slate-400 hover:text-white border border-[#0f2545] cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage.url}
            alt={currentImage.alt || productName}
            className="max-w-[90%] max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-[#0f2545]"
          />
        </div>
      )}
    </div>
  );
}
