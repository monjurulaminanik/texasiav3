"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Eye, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  author: { name: string; email: string };
  views: number;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminBlogPage() {
  const queryClient = useQueryClient();

  // Fetch all posts
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["adminBlogs"],
    queryFn: async () => {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Failed to load blog posts");
      return res.json();
    },
  });

  // Toggle published status mutation
  const togglePublishMutation = useMutation({
    mutationFn: async (post: BlogPost) => {
      const res = await fetch(`/api/blog?id=${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });
      if (!res.ok) throw new Error("Failed to toggle publish status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      toast.success("Article publish status updated!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blog?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      toast.success("Blog article deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      header: "Article Info",
      accessor: (row: BlogPost) => {
        const cover = row.coverImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=60&fit=crop";
        return (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={row.title}
              className="w-12 h-9 object-cover rounded-lg border border-[#0f2545] bg-[#040d1a]"
            />
            <div>
              <div className="text-white font-semibold text-sm line-clamp-1">{row.title}</div>
              <div className="text-[10px] text-slate-500">
                By {row.author?.name} · {formatDistanceToNow(new Date(row.createdAt))} ago
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Views",
      accessor: (row: BlogPost) => (
        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-slate-500" /> {row.views}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row: BlogPost) => (
        <button
          onClick={() => togglePublishMutation.mutate(row)}
          className="flex items-center gap-1 cursor-pointer focus:outline-none"
        >
          {row.isPublished ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/45 px-2 py-0.5 rounded border border-emerald-900/50">
              <ToggleRight className="w-3.5 h-3.5 text-emerald-400" /> Published
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
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-tight">
            Manage Blog & Insights
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Publish SEO articles to attract international B2B RMG buyers.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[#d4a574]/20 transition-premium self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> New Article
        </Link>
      </div>

      {/* Main content listing */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[#d4a574] animate-spin" />
          <span className="text-sm text-slate-500">Loading blog directory...</span>
        </div>
      ) : (
        <div className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6">
          <DataTable
            columns={columns}
            data={posts}
            searchKey="title"
            searchPlaceholder="Search articles by title..."
            actions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/admin/blog/${row.id}/edit`}
                  className="p-1.5 rounded bg-[#0b2545] text-slate-300 hover:text-white border border-[#0f2545] hover:border-[#d4a574]/30 transition-premium cursor-pointer"
                  title="Edit Post"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="p-1.5 rounded bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-rose-900/50 hover:bg-rose-900 transition-premium cursor-pointer"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}

