"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useMutation } from "@tanstack/react-query";
import ImageUploader from "@/components/admin/ImageUploader";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const blogSchema = zod.object({
  title: zod.string().min(5, "Title is required (min 5 characters)"),
  excerpt: zod.string().max(300, "Excerpt must be under 300 characters").optional(),
  content: zod.string().min(10, "Content must be at least 10 characters"),
  coverImage: zod.string().optional(),
  tags: zod.string().optional(), // comma-separated
  metaTitle: zod.string().optional(),
  metaDesc: zod.string().optional(),
  isPublished: zod.boolean().default(false),
});

type BlogFormValues = zod.infer<typeof blogSchema>;

interface BlogFormProps {
  initialData?: any;
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "seo">("general");

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      coverImage: initialData?.coverImage || "",
      tags: initialData?.tags || "Garment Sourcing, Sustainable Fashion, Bangladesh Exports",
      metaTitle: initialData?.metaTitle || "",
      metaDesc: initialData?.metaDesc || "",
      isPublished: initialData?.isPublished || false,
    },
  });

  const coverImageWatch = watch("coverImage") || "";
  const contentWatch = watch("content") || "";

  // Mutator for Save operation
  const mutation = useMutation({
    mutationFn: async (data: BlogFormValues) => {
      const url = initialData ? `/api/blog?id=${initialData.id}` : "/api/blog";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save blog post failed");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success(initialData ? "Blog post updated!" : "Blog post published successfully!");
      router.push("/admin/blog");
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: BlogFormValues) => {
    mutation.mutate(data);
  };

  const tabs = [
    { id: "general", name: "Content Body" },
    { id: "seo", name: "SEO Meta Tags" },
  ];

  return (
    <div className="space-y-6">
      {/* Header crumb bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/blog")}
          className="p-2 border border-[#0f2545] rounded-xl hover:bg-[#0b2545] text-slate-300 hover:text-white cursor-pointer transition-premium"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-heading">
            {initialData ? `Edit: ${initialData.title}` : "Publish News Article"}
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Create search-optimized insights regarding the Bangladesh apparel industry.
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
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase block">Article Title</label>
              <input
                {...register("title")}
                type="text"
                placeholder="e.g. Sustainable Garment Manufacturing: A 2026 Outlook"
                className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
              />
              {errors.title && <p className="text-rose-500 text-xs">{errors.title.message}</p>}
            </div>

            {/* Cover image uploader */}
            <ImageUploader
              value={coverImageWatch ? [coverImageWatch] : []}
              onChange={(urls) => setValue("coverImage", urls[0] || "")}
              folder="blog"
              maxImages={1}
            />

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase block">Short excerpt blurb</label>
              <textarea
                {...register("excerpt")}
                rows={2}
                placeholder="Summarize the core theme of the article."
                className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium resize-none"
              />
              {errors.excerpt && <p className="text-rose-500 text-xs">{errors.excerpt.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase block">Article Rich content (Tiptap HTML)</label>
              <TiptapEditor
                value={contentWatch}
                onChange={(html) => setValue("content", html)}
              />
              {errors.content && <p className="text-rose-500 text-xs">{errors.content.message}</p>}
            </div>
          </div>
        )}

        {/* Tab 2: SEO settings */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase block">Tags (Comma-separated)</label>
              <input
                {...register("tags")}
                type="text"
                placeholder="e.g. Garment Sourcing, Sustainable Fashion, Low MOQ"
                className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase block">SEO Meta Title</label>
              <input
                {...register("metaTitle")}
                type="text"
                placeholder="Insight SEO Title for Google"
                className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase block">SEO Meta Description</label>
              <textarea
                {...register("metaDesc")}
                placeholder="Brief summary displayed inside search engine snippets."
                rows={3}
                className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium resize-none"
              />
            </div>

            {/* Publishing toggle switch */}
            <div className="flex items-center gap-3 bg-[#040d1a]/40 p-4 rounded-xl border border-[#0f2545] pt-4">
              <input
                type="checkbox"
                id="isPublished"
                {...register("isPublished")}
                className="w-4 h-4 accent-[#d4a574] cursor-pointer"
              />
              <label htmlFor="isPublished" className="text-xs font-semibold text-slate-300 uppercase cursor-pointer">
                Publish blog post immediately (Otherwise saves as draft)
              </label>
            </div>
          </div>
        )}

        {/* Buttons footer */}
        <div className="pt-6 border-t border-[#0f2545] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
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
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Post...
              </>
            ) : (
              "Save Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
