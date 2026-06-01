"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: "products" | "blog" | "pages";
  maxImages?: number;
}

export default function ImageUploader({
  value = [],
  onChange,
  folder = "products",
  maxImages = 5,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      const updatedImages = [...value, data.url];
      onChange(updatedImages);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (value.length >= maxImages) {
      toast.warning(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    const file = files[0];
    handleUpload(file);
  };

  const handleRemove = (indexToRemove: number) => {
    const updatedImages = value.filter((_, index) => index !== indexToRemove);
    onChange(updatedImages);
    toast.success("Image removed");
  };

  const triggerInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
        Media Upload ({value.length} / {maxImages})
      </label>

      {/* Grid of uploaded images */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative aspect-[4/5] rounded-xl border border-[#0f2545] overflow-hidden bg-[#040d1a] group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-premium"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-950/80 text-rose-300 hover:text-white border border-rose-900/50 hover:bg-rose-900 cursor-pointer transition-premium opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 text-[9px] font-bold text-white bg-[#d4a574] px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dropzone container */}
      {value.length < maxImages && (
        <div
          onClick={triggerInputClick}
          className="border border-dashed border-[#0f2545] hover:border-[#d4a574]/40 bg-[#081a33]/20 hover:bg-[#081a33]/40 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-premium group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-[#d4a574] animate-spin" />
              <span className="text-xs text-slate-400">Uploading file...</span>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-full bg-[#0b2545]/60 text-slate-400 group-hover:text-[#d4a574] group-hover:bg-[#0b2545] transition-premium">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-white group-hover:text-[#d4a574] transition-premium">
                  Click to upload image
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  PNG, JPG, or WEBP up to 5MB (4:5 Aspect Ratio recommended)
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
