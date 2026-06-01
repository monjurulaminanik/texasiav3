"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Star, Loader2, ArrowRight, Eye } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDesc: string | null;
  description: string;
  moq: string | null;
  leadTime: string | null;
  fabric: string | null;
  isFeatured: boolean;
  isActive: boolean;
  category: { name: string; slug: string };
  images: { id: string; url: string; alt: string | null }[];
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch products
  const { data: products = [], isLoading: isProductsLoading } = useQuery<Product[]>({
    queryKey: ["products", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory !== "all"
        ? `/api/products?categoryId=${selectedCategory}`
        : "/api/products";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  // Fetch categories for drop-down filter
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async (prod: Product) => {
      const res = await fetch(`/api/products/${prod.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !prod.isActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product active status toggled!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async (prod: Product) => {
      const res = await fetch(`/api/products/${prod.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !prod.isFeatured }),
      });
      if (!res.ok) throw new Error("Failed to toggle featured status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product featured status toggled!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      header: "Product Detail",
      accessor: (row: Product) => {
        const coverImage = row.images?.[0]?.url || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=80&h=100&fit=crop";
        return (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt={row.name}
              className="w-12 h-15 object-cover rounded-lg border border-[#0f2545] bg-[#040d1a]"
            />
            <div>
              <div className="text-white font-semibold text-sm">{row.name}</div>
              <div className="text-xs text-slate-500">{row.category?.name || "Uncategorized"}</div>
            </div>
          </div>
        );
      },
    },
    {
      header: "MOQ / Fabric",
      accessor: (row: Product) => (
        <div>
          <div className="text-slate-300 text-xs font-semibold">{row.moq || "500 pcs"}</div>
          <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{row.fabric || "Cotton"}</div>
        </div>
      ),
    },
    {
      header: "Featured",
      accessor: (row: Product) => (
        <button
          onClick={() => toggleFeaturedMutation.mutate(row)}
          className="flex items-center gap-1 cursor-pointer focus:outline-none"
        >
          {row.isFeatured ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/45 px-2 py-0.5 rounded border border-amber-900/50">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Featured
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-950/45 px-2 py-0.5 rounded border border-slate-900/50 hover:text-amber-400 hover:border-amber-900/50 transition-premium">
              <Star className="w-3.5 h-3.5 text-slate-500" /> Standard
            </span>
          )}
        </button>
      ),
    },
    {
      header: "Status",
      accessor: (row: Product) => (
        <button
          onClick={() => toggleActiveMutation.mutate(row)}
          className="flex items-center gap-1 cursor-pointer focus:outline-none"
        >
          {row.isActive ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/45 px-2 py-0.5 rounded border border-emerald-900/50">
              <ToggleRight className="w-3.5 h-3.5 text-emerald-400" /> Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-950/45 px-2 py-0.5 rounded border border-slate-900/50">
              <ToggleLeft className="w-3.5 h-3.5 text-slate-500" /> Draft
            </span>
          )}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-tight">
            Manage Products
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Curate and update premium products on the public catalog site.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[#d4a574]/20 transition-premium self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> Add Product
        </Link>
      </div>

      {/* Categories Dropdown Filter */}
      <div className="flex items-center gap-3 bg-[#081a33]/30 p-4 rounded-xl border border-[#0f2545]">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Filter by Category:
        </span>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#040d1a] border border-[#0f2545] text-slate-300 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#d4a574] transition-premium cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main loading / table pane */}
      {isProductsLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[#d4a574] animate-spin" />
          <span className="text-sm text-slate-500">Loading B2B products catalog...</span>
        </div>
      ) : (
        <div className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6">
          <DataTable
            columns={columns}
            data={products}
            searchKey="name"
            searchPlaceholder="Search products by name..."
            actions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/admin/page-builder/${row.id}`}
                  className="p-1.5 rounded bg-amber-950/60 text-amber-400 hover:text-amber-300 border border-amber-900/50 hover:bg-amber-900 transition-premium cursor-pointer flex items-center gap-1.5 text-[11px] font-bold"
                  title="Visual Page Builder"
                >
                  <Eye className="w-4 h-4" /> Visual Builder
                </Link>
                <Link
                  href={`/admin/products/${row.id}/edit`}
                  className="p-1.5 rounded bg-[#0b2545] text-slate-300 hover:text-white border border-[#0f2545] hover:border-[#d4a574]/30 transition-premium cursor-pointer flex items-center gap-1.5 text-[11px] font-bold"
                  title="Edit Specs"
                >
                  <Edit className="w-4 h-4" /> Specs
                </Link>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="p-1.5 rounded bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-rose-900/50 hover:bg-rose-900 transition-premium cursor-pointer flex items-center gap-1.5 text-[11px] font-bold"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}

