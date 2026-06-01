"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/admin/DataTable";
import ImageUploader from "@/components/admin/ImageUploader";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

const categorySchema = zod.object({
  name: zod.string().min(2, "Category name is required (min 2 chars)"),
  description: zod.string().optional(),
  heroImage: zod.string().optional(),
  metaTitle: zod.string().optional(),
  metaDesc: zod.string().optional(),
  order: zod.preprocess((val) => Number(val), zod.number().default(0)),
  isActive: zod.boolean().default(true),
});

type CategoryFormValues = zod.infer<typeof categorySchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  heroImage: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  order: number;
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      heroImage: "",
      metaTitle: "",
      metaDesc: "",
      order: 0,
      isActive: true,
    },
  });

  const heroImageWatch = watch("heroImage") || "";
  const descriptionWatch = watch("description") || "";

  // Fetch categories using TanStack Query
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  // Mutator for inserting/updating categories
  const upsertMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const url = editingCategory
        ? `/api/categories?id=${editingCategory.id}`
        : "/api/categories";
      const method = editingCategory ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save operation failed");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(editingCategory ? "Category updated!" : "Category created successfully!");
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async (cat: Category) => {
      const res = await fetch(`/api/categories?id=${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !cat.isActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category status updated!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setValue("description", category.description || "");
    setValue("heroImage", category.heroImage || "");
    setValue("metaTitle", category.metaTitle || "");
    setValue("metaDesc", category.metaDesc || "");
    setValue("order", category.order);
    setValue("isActive", category.isActive);
    setIsOpen(true);
  };

  const handleClose = () => {
    setEditingCategory(null);
    reset({
      name: "",
      description: "",
      heroImage: "",
      metaTitle: "",
      metaDesc: "",
      order: 0,
      isActive: true,
    });
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: CategoryFormValues) => {
    upsertMutation.mutate(data);
  };

  const columns = [
    {
      header: "Category Name",
      accessor: (row: Category) => (
        <div>
          <div className="text-white font-semibold">{row.name}</div>
          <div className="text-xs text-slate-500">{row.slug}</div>
        </div>
      ),
    },
    {
      header: "Sort Order",
      accessor: (row: Category) => <span className="text-slate-400 font-mono">{row.order}</span>,
    },
    {
      header: "Status",
      accessor: (row: Category) => (
        <button
          onClick={() => toggleActiveMutation.mutate(row)}
          className="flex items-center gap-1 cursor-pointer focus:outline-none"
        >
          {row.isActive ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/45 px-2 py-0.5 rounded border border-emerald-900/50">
              <ToggleRight className="w-4 h-4 text-emerald-400" /> Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-950/45 px-2 py-0.5 rounded border border-slate-900/50">
              <ToggleLeft className="w-4 h-4 text-slate-500" /> Inactive
            </span>
          )}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-tight">
            Manage Product Categories
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Curate and configure the primary B2B garment catalogs.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[#d4a574]/20 transition-premium self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      {/* Main loading / listing pane */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[#d4a574] animate-spin" />
          <span className="text-sm text-slate-500">Loading catalog categories...</span>
        </div>
      ) : (
        <div className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6">
          <DataTable
            columns={columns}
            data={categories}
            searchKey="name"
            searchPlaceholder="Search categories..."
            actions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(row)}
                  className="p-1.5 rounded bg-[#0b2545] text-slate-300 hover:text-white border border-[#0f2545] hover:border-[#d4a574]/30 transition-premium cursor-pointer"
                  title="Edit Category"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="p-1.5 rounded bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-rose-900/50 hover:bg-rose-900 transition-premium cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        </div>
      )}

      {/* Sliding Drawer / Modal Form for Category Add/Edit */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer contents */}
          <div className="w-full max-w-2xl bg-[#081a33] border-l border-[#0f2545] h-screen overflow-y-auto relative z-10 flex flex-col justify-between shadow-2xl p-6 sm:p-8 animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-[#0f2545] pb-4 mb-6">
                <h3 className="text-lg font-bold text-white font-heading">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create Product Category"}
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
                {/* Category name & order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                      Category Name
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="e.g. Circular Knit Jersey"
                      className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                    />
                    {errors.name && (
                      <p className="text-rose-500 text-xs">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                      Display Order (Sort Index)
                    </label>
                    <input
                      {...register("order")}
                      type="number"
                      placeholder="e.g. 5"
                      className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                    />
                    {errors.order && (
                      <p className="text-rose-500 text-xs">{errors.order.message}</p>
                    )}
                  </div>
                </div>

                {/* Hero Image upload */}
                <ImageUploader
                  value={heroImageWatch ? [heroImageWatch] : []}
                  onChange={(urls) => setValue("heroImage", urls[0] || "")}
                  folder="products"
                  maxImages={1}
                />

                {/* Rich text Tiptap description */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    Category Long Description (B2B Sourcing Overview)
                  </label>
                  <TiptapEditor
                    value={descriptionWatch}
                    onChange={(html) => setValue("description", html)}
                  />
                </div>

                {/* SEO Configurations */}
                <div className="border-t border-[#0f2545] pt-6 space-y-4">
                  <h4 className="text-xs font-bold text-[#d4a574] uppercase tracking-widest">
                    Search Engine Optimization (SEO Metadata)
                  </h4>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase block">
                      Meta Title
                    </label>
                    <input
                      {...register("metaTitle")}
                      type="text"
                      placeholder="e.g. Custom Circular Knit Jersey Wholesale Manufacturer"
                      className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase block">
                      Meta Description
                    </label>
                    <textarea
                      {...register("metaDesc")}
                      placeholder="e.g. Supplier of certified B2B custom circular knit jersey fabrics. 500 pcs low MOQ..."
                      rows={3}
                      className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium resize-none"
                    />
                  </div>
                </div>

                {/* Active Toggle Switch */}
                <div className="flex items-center gap-3 bg-[#040d1a]/40 p-4 rounded-xl border border-[#0f2545]">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...register("isActive")}
                    className="w-4 h-4 accent-[#d4a574] cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer">
                    Enable and Publish Category immediately
                  </label>
                </div>

                {/* Submit button footer */}
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
                    disabled={upsertMutation.isPending}
                  >
                    {upsertMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save Category"
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

