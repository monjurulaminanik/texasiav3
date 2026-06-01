"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/admin/DataTable";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { Edit, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

const pageSchema = zod.object({
  title: zod.string().min(2, "Page title is required"),
  content: zod.string().min(10, "Content must be at least 10 characters"),
  metaTitle: zod.string().optional(),
  metaDesc: zod.string().optional(),
});

type PageFormValues = zod.infer<typeof pageSchema>;

interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle: string | null;
  metaDesc: string | null;
}

export default function AdminPagesPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      content: "",
      metaTitle: "",
      metaDesc: "",
    },
  });

  const contentWatch = watch("content") || "";

  // Fetch static pages
  const { data: pages = [], isLoading } = useQuery<StaticPage[]>({
    queryKey: ["adminPages"],
    queryFn: async () => {
      const res = await fetch("/api/pages");
      if (!res.ok) throw new Error("Failed to load pages");
      return res.json();
    },
  });

  // Mutator for Page updates
  const updateMutation = useMutation({
    mutationFn: async (data: PageFormValues) => {
      if (!editingPage) return;
      const res = await fetch(`/api/pages?id=${editingPage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update page");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPages"] });
      toast.success("Page updated successfully!");
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (page: StaticPage) => {
    setEditingPage(page);
    setValue("title", page.title);
    setValue("content", page.content);
    setValue("metaTitle", page.metaTitle || "");
    setValue("metaDesc", page.metaDesc || "");
    setIsOpen(true);
  };

  const handleClose = () => {
    setEditingPage(null);
    reset({
      title: "",
      content: "",
      metaTitle: "",
      metaDesc: "",
    });
    setIsOpen(false);
  };

  const onSubmit = (data: PageFormValues) => {
    updateMutation.mutate(data);
  };

  const columns = [
    {
      header: "Page Title",
      accessor: (row: StaticPage) => (
        <div>
          <div className="text-white font-semibold">{row.title}</div>
          <div className="text-xs text-slate-500">/{row.slug}</div>
        </div>
      ),
    },
    {
      header: "Meta Tags",
      accessor: (row: StaticPage) => (
        <span className="text-xs text-slate-400 truncate max-w-[250px] inline-block">
          {row.metaTitle || "Default Theme Meta"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-heading tracking-tight">
          Manage Static Pages
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Edit the content and SEO tags of your primary corporate pages (Profile, Sustainability, etc.).
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[#d4a574] animate-spin" />
          <span className="text-sm text-slate-500">Loading pages...</span>
        </div>
      ) : (
        <div className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6">
          <DataTable
            columns={columns}
            data={pages}
            searchKey="title"
            searchPlaceholder="Search pages by title..."
            actions={(row) => (
              <div className="flex items-center justify-end">
                <button
                  onClick={() => handleEdit(row)}
                  className="p-1.5 rounded bg-[#0b2545] text-slate-300 hover:text-white border border-[#0f2545] hover:border-[#d4a574]/30 transition-premium cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Edit className="w-4 h-4" /> Edit Content
                </button>
              </div>
            )}
          />
        </div>
      )}

      {/* Drawer Overlay for Editing Page */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Wrapper */}
          <div className="w-full max-w-3xl bg-[#081a33] border-l border-[#0f2545] h-screen overflow-y-auto relative z-10 flex flex-col justify-between shadow-2xl p-6 sm:p-8 animate-in slide-in-from-right duration-300">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#0f2545] pb-4 mb-6">
                <h3 className="text-lg font-bold text-white font-heading">
                  Edit Static Page: {editingPage?.title}
                </h3>
                <button
                  onClick={handleClose}
                  className="p-1 text-slate-400 hover:text-white hover:bg-[#0b2545] rounded-lg transition-premium cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">
                    Page Title Label
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                  {errors.title && <p className="text-rose-500 text-xs">{errors.title.message}</p>}
                </div>

                {/* Content text editor */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">
                    Page HTML Body (Rich Content)
                  </label>
                  <TiptapEditor
                    value={contentWatch}
                    onChange={(html) => setValue("content", html)}
                  />
                  {errors.content && <p className="text-rose-500 text-xs">{errors.content.message}</p>}
                </div>

                {/* SEO Configuration fields */}
                <div className="border-t border-[#0f2545] pt-6 space-y-4">
                  <h4 className="text-xs font-bold text-[#d4a574] uppercase tracking-widest">
                    SEO Metadata configurations
                  </h4>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase block">
                      SEO Title tag
                    </label>
                    <input
                      {...register("metaTitle")}
                      type="text"
                      placeholder="Page SEO Meta Title"
                      className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase block">
                      SEO Meta Description
                    </label>
                    <textarea
                      {...register("metaDesc")}
                      placeholder="SEO Meta Description block..."
                      rows={3}
                      className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium resize-none"
                    />
                  </div>
                </div>

                {/* Save button footer */}
                <div className="pt-4 border-t border-[#0f2545] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-xl border border-[#0f2545] hover:bg-[#0b2545] text-slate-300 hover:text-white transition-premium cursor-pointer text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-premium disabled:opacity-50 text-sm"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving changes...
                      </>
                    ) : (
                      "Save Page changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

