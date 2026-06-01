"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/admin/DataTable";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

const faqSchema = zod.object({
  question: zod.string().min(5, "Question must be at least 5 characters"),
  answer: zod.string().min(10, "Answer must be at least 10 characters"),
  category: zod.string().default("General"),
  order: zod.preprocess((val) => Number(val), zod.number().default(0)),
  isActive: zod.boolean().default(true),
});

type FAQFormValues = zod.infer<typeof faqSchema>;

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order: number;
  isActive: boolean;
}

export default function AdminFaqsPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "General",
      order: 0,
      isActive: true,
    },
  });

  // Fetch FAQs
  const { data: faqs = [], isLoading } = useQuery<FAQ[]>({
    queryKey: ["adminFaqs"],
    queryFn: async () => {
      const res = await fetch("/api/faqs");
      if (!res.ok) throw new Error("Failed to load FAQs");
      return res.json();
    },
  });

  // Mutator for FAQ saving
  const upsertMutation = useMutation({
    mutationFn: async (data: FAQFormValues) => {
      const url = editingFaq ? `/api/faqs?id=${editingFaq.id}` : "/api/faqs";
      const method = editingFaq ? "PATCH" : "POST";

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
      queryClient.invalidateQueries({ queryKey: ["adminFaqs"] });
      toast.success(editingFaq ? "FAQ updated!" : "FAQ published successfully!");
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async (faq: FAQ) => {
      const res = await fetch(`/api/faqs?id=${faq.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !faq.isActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFaqs"] });
      toast.success("FAQ status updated!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Delete FAQ mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/faqs?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete FAQ");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFaqs"] });
      toast.success("FAQ deleted!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setValue("question", faq.question);
    setValue("answer", faq.answer);
    setValue("category", faq.category || "General");
    setValue("order", faq.order);
    setValue("isActive", faq.isActive);
    setIsOpen(true);
  };

  const handleClose = () => {
    setEditingFaq(null);
    reset({
      question: "",
      answer: "",
      category: "General",
      order: 0,
      isActive: true,
    });
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: FAQFormValues) => {
    upsertMutation.mutate(data);
  };

  const columns = [
    {
      header: "Question & Category",
      accessor: (row: FAQ) => (
        <div>
          <div className="text-white font-semibold text-sm line-clamp-1">{row.question}</div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
            Category: {row.category || "General"}
          </div>
        </div>
      ),
    },
    {
      header: "Sort Order",
      accessor: (row: FAQ) => <span className="text-slate-400 font-mono text-xs">{row.order}</span>,
    },
    {
      header: "Status",
      accessor: (row: FAQ) => (
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
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-tight">
            Manage FAQs
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Display comprehensive questions & answers regarding MOQs, Logistics, and Quality.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[#d4a574]/20 transition-premium self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> Add FAQ
        </button>
      </div>

      {/* Main loading / DataTable pane */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[#d4a574] animate-spin" />
          <span className="text-sm text-slate-500">Loading FAQs list...</span>
        </div>
      ) : (
        <div className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6">
          <DataTable
            columns={columns}
            data={faqs}
            searchKey="question"
            searchPlaceholder="Search FAQs by question..."
            actions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(row)}
                  className="p-1.5 rounded bg-[#0b2545] text-slate-300 hover:text-white border border-[#0f2545] hover:border-[#d4a574]/30 transition-premium cursor-pointer"
                  title="Edit FAQ"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="p-1.5 rounded bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-rose-900/50 hover:bg-rose-900 transition-premium cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        </div>
      )}

      {/* Slide Modal Drawer for Add/Edit */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="w-full max-w-xl bg-[#081a33] border-l border-[#0f2545] h-screen overflow-y-auto relative z-10 flex flex-col justify-between shadow-2xl p-6 sm:p-8 animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-[#0f2545] pb-4 mb-6">
                <h3 className="text-lg font-bold text-white font-heading">
                  {editingFaq ? "Edit FAQ Item" : "Create FAQ Item"}
                </h3>
                <button
                  onClick={handleClose}
                  className="p-1 text-slate-400 hover:text-white hover:bg-[#0b2545] rounded-lg transition-premium cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">
                    Question Label
                  </label>
                  <input
                    {...register("question")}
                    type="text"
                    placeholder="e.g. What is your typical production MOQ?"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                  {errors.question && <p className="text-rose-500 text-xs">{errors.question.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase block">
                      Category Group
                    </label>
                    <select
                      {...register("category")}
                      className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium cursor-pointer"
                    >
                      <option value="General">General</option>
                      <option value="Production">Production</option>
                      <option value="Shipping">Shipping</option>
                      <option value="MOQ">MOQ</option>
                      <option value="Quality">Quality</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase block">
                      Sort Order (Index)
                    </label>
                    <input
                      {...register("order")}
                      type="number"
                      placeholder="e.g. 0"
                      className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">
                    Detailed Answer (Explain thoroughly)
                  </label>
                  <textarea
                    {...register("answer")}
                    placeholder="Provide a detailed, professional B2B response..."
                    rows={6}
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium resize-none"
                  />
                  {errors.answer && <p className="text-rose-500 text-xs">{errors.answer.message}</p>}
                </div>

                <div className="flex items-center gap-3 bg-[#040d1a]/40 p-4 rounded-xl border border-[#0f2545]">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...register("isActive")}
                    className="w-4 h-4 accent-[#d4a574] cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-xs font-semibold text-slate-300 uppercase cursor-pointer">
                    Enable and Publish FAQ immediately
                  </label>
                </div>

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
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving FAQ...
                      </>
                    ) : (
                      "Save FAQ"
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

