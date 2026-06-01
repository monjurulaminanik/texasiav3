"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import ImageUploader from "@/components/admin/ImageUploader";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { Loader2, ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";

const productSchema = zod.object({
  name: zod.string().min(2, "Product name is required"),
  categoryId: zod.string().min(1, "Please select a category"),
  shortDesc: zod.string().max(250, "Short description must be under 250 characters").optional(),
  description: zod.string().min(10, "Description must be at least 10 characters"),
  features: zod.array(zod.string()).default([]),
  moq: zod.string().optional(),
  leadTime: zod.string().optional(),
  fabric: zod.string().optional(),
  sizes: zod.string().optional(),
  colors: zod.string().optional(),
  metaTitle: zod.string().optional(),
  metaDesc: zod.string().optional(),
  isFeatured: zod.boolean().default(false),
  isActive: zod.boolean().default(true),
  images: zod.array(zod.string()).min(1, "At least one product image is required"),
});

type ProductFormValues = zod.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "specs" | "seo" | "media">("general");
  const [featureInput, setFeatureInput] = useState("");

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      categoryId: initialData?.categoryId || "",
      shortDesc: initialData?.shortDesc || "",
      description: initialData?.description || "",
      features: initialData?.features ? JSON.parse(initialData.features) : [],
      moq: initialData?.moq || "500 pieces per style/color",
      leadTime: initialData?.leadTime || "30 to 45 business days",
      fabric: initialData?.fabric || "100% Ring-Spun Combed Cotton",
      sizes: initialData?.sizes || "S, M, L, XL, XXL, 3XL",
      colors: initialData?.colors || "Jet Black, Classic White, Slate Gray, Navy Blue, Forest Green",
      metaTitle: initialData?.metaTitle || "",
      metaDesc: initialData?.metaDesc || "",
      isFeatured: initialData?.isFeatured || false,
      isActive: initialData?.isActive || true,
      images: initialData?.images ? initialData.images.map((img: any) => img.url) : [],
    },
  });

  const imagesWatch = watch("images") || [];
  const descriptionWatch = watch("description") || "";
  const featuresWatch = watch("features") || [];

  // Fetch categories for dropdown
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      return res.json();
    },
  });

  // Mutator for Save operation
  const mutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const url = initialData ? `/api/products/${initialData.id}` : "/api/products";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save product failed");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success(initialData ? "Product updated!" : "Product created successfully!");
      router.push("/admin/products");
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    mutation.mutate(data);
  };

  const handleAddFeature = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && featureInput.trim()) {
      e.preventDefault();
      if (!featuresWatch.includes(featureInput.trim())) {
        setValue("features", [...featuresWatch, featureInput.trim()]);
      }
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (indexToRemove: number) => {
    setValue("features", featuresWatch.filter((_, idx) => idx !== indexToRemove));
  };

  const tabs = [
    { id: "general", name: "General Details" },
    { id: "specs", name: "B2B Specifications" },
    { id: "media", name: "Product Media" },
    { id: "seo", name: "SEO Meta" },
  ];

  return (
    <div className="space-y-6">
      {/* Header breadcrumb bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/products")}
          className="p-2 border border-[#0f2545] rounded-xl hover:bg-[#0b2545] text-slate-300 hover:text-white cursor-pointer transition-premium"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-heading">
            {initialData ? `Edit: ${initialData.name}` : "Create Premium Product"}
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Configure catalogs and detailed garment engineering items.
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-[#0f2545] gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 font-semibold text-sm transition-premium border-b-2 px-1 cursor-pointer ${
              activeTab === tab.id
                ? "border-[#d4a574] text-[#d4a574]"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Tab 1: General Info */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase block">Product Name</label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="e.g. Premium Cotton Crew Neck T-Shirt"
                  className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                />
                {errors.name && <p className="text-rose-500 text-xs">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase block">Category catalog</label>
                <select
                  {...register("categoryId")}
                  className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium cursor-pointer"
                >
                  <option value="">Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-rose-500 text-xs">{errors.categoryId.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase block">Short Summary excerpt (Max 250 chars)</label>
              <textarea
                {...register("shortDesc")}
                rows={2}
                placeholder="Brief B2B teaser blurb of the product."
                className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium resize-none"
              />
              {errors.shortDesc && <p className="text-rose-500 text-xs">{errors.shortDesc.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase block">Detailed Description (Rich HTML Specs)</label>
              <TiptapEditor
                value={descriptionWatch}
                onChange={(html) => setValue("description", html)}
              />
              {errors.description && <p className="text-rose-500 text-xs">{errors.description.message}</p>}
            </div>
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === "specs" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase block">MOQ Requirement</label>
                <input
                  {...register("moq")}
                  type="text"
                  placeholder="e.g. 500 pieces per style"
                  className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase block">Lead Time</label>
                <input
                  {...register("leadTime")}
                  type="text"
                  placeholder="e.g. 30 to 45 business days"
                  className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase block">Fabric composition</label>
                <input
                  {...register("fabric")}
                  type="text"
                  placeholder="e.g. 100% Ring-Spun Cotton"
                  className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase block">Sizes (Comma-separated)</label>
                <input
                  {...register("sizes")}
                  type="text"
                  placeholder="e.g. S, M, L, XL, XXL"
                  className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase block">Colors Available (Comma-separated)</label>
                <input
                  {...register("colors")}
                  type="text"
                  placeholder="e.g. Classic White, Navy Blue, Slate"
                  className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                />
              </div>
            </div>

            {/* Bullet features list manager */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase block">Garment Features (Type and press Enter)</label>
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={handleAddFeature}
                placeholder="Add bullet highlight..."
                className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {featuresWatch.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs text-[#d4a574] bg-[#d4a574]/10 border border-[#d4a574]/20 px-2.5 py-1 rounded-lg"
                  >
                    {feat}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-white focus:outline-none cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Media upload */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <ImageUploader
              value={imagesWatch}
              onChange={(urls) => setValue("images", urls)}
              folder="products"
              maxImages={5}
            />
            {errors.images && <p className="text-rose-500 text-xs">{errors.images.message}</p>}
          </div>
        )}

        {/* Tab 4: SEO metadata */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase block">Meta Title</label>
              <input
                {...register("metaTitle")}
                type="text"
                placeholder="Product SEO Title for Google"
                className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase block">Meta Description</label>
              <textarea
                {...register("metaDesc")}
                placeholder="Meta description teases for search engine rankings."
                rows={3}
                className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium resize-none"
              />
            </div>

            {/* Publishing toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#0f2545]">
              <div className="flex items-center gap-3 bg-[#040d1a]/40 p-4 rounded-xl border border-[#0f2545]">
                <input
                  type="checkbox"
                  id="isFeatured"
                  {...register("isFeatured")}
                  className="w-4 h-4 accent-[#d4a574] cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-300 uppercase cursor-pointer">
                  Feature this product on Home Page
                </label>
              </div>

              <div className="flex items-center gap-3 bg-[#040d1a]/40 p-4 rounded-xl border border-[#0f2545]">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("isActive")}
                  className="w-4 h-4 accent-[#d4a574] cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-slate-300 uppercase cursor-pointer">
                  Publish product catalog immediately
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Buttons footer */}
        <div className="pt-6 border-t border-[#0f2545] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-4 py-2.5 rounded-xl border border-[#0f2545] hover:bg-[#0b2545] text-slate-300 hover:text-white transition-premium cursor-pointer text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-premium disabled:opacity-50 text-sm"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Product...
              </>
            ) : (
              "Save Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
