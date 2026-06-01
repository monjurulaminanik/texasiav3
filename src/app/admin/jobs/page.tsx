"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/admin/DataTable";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

const jobSchema = zod.object({
  title: zod.string().min(3, "Job title is required"),
  department: zod.string().min(2, "Department is required"),
  location: zod.string().min(2, "Location is required"),
  type: zod.string().default("Full-time"),
  description: zod.string().min(10, "Job description is required (min 10 chars)"),
  requirements: zod.string().min(10, "Job requirements are required (min 10 chars)"),
  isActive: zod.boolean().default(true),
});

type JobFormValues = zod.infer<typeof jobSchema>;

interface Job {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  type: string | null;
  description: string;
  requirements: string;
  isActive: boolean;
}

export default function AdminJobsPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      department: "Merchandising & Sourcing",
      location: "Dhaka Office (Mirpur DOHS)",
      type: "Full-time",
      description: "",
      requirements: "",
      isActive: true,
    },
  });

  const descriptionWatch = watch("description") || "";
  const requirementsWatch = watch("requirements") || "";

  // Fetch jobs list
  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["adminJobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to load jobs");
      return res.json();
    },
  });

  // Mutator for FAQ saving
  const upsertMutation = useMutation({
    mutationFn: async (data: JobFormValues) => {
      const url = editingJob ? `/api/jobs?id=${editingJob.id}` : "/api/jobs";
      const method = editingJob ? "PATCH" : "POST";

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
      queryClient.invalidateQueries({ queryKey: ["adminJobs"] });
      toast.success(editingJob ? "Job post updated!" : "Job opening created successfully!");
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async (job: Job) => {
      const res = await fetch(`/api/jobs?id=${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !job.isActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminJobs"] });
      toast.success("Job status updated!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Delete FAQ mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/jobs?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete job");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminJobs"] });
      toast.success("Job deleted!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setValue("title", job.title);
    setValue("department", job.department || "");
    setValue("location", job.location || "");
    setValue("type", job.type || "Full-time");
    setValue("description", job.description);
    setValue("requirements", job.requirements);
    setValue("isActive", job.isActive);
    setIsOpen(true);
  };

  const handleClose = () => {
    setEditingJob(null);
    reset({
      title: "",
      department: "Merchandising & Sourcing",
      location: "Dhaka Office (Mirpur DOHS)",
      type: "Full-time",
      description: "",
      requirements: "",
      isActive: true,
    });
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: JobFormValues) => {
    upsertMutation.mutate(data);
  };

  const columns = [
    {
      header: "Job Title & Dept",
      accessor: (row: Job) => (
        <div>
          <div className="text-white font-semibold text-sm">{row.title}</div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
            {row.department} · {row.location}
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: (row: Job) => <span className="text-slate-400 font-mono text-xs">{row.type}</span>,
    },
    {
      header: "Status",
      accessor: (row: Job) => (
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
            Manage Job Openings
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Publish and curate active employment positions at Texasia.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[#d4a574]/20 transition-premium self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> Post Job
        </button>
      </div>

      {/* Main loading / DataTable pane */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[#d4a574] animate-spin" />
          <span className="text-sm text-slate-500">Loading career jobs directory...</span>
        </div>
      ) : (
        <div className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6">
          <DataTable
            columns={columns}
            data={jobs}
            searchKey="title"
            searchPlaceholder="Search jobs by title..."
            actions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(row)}
                  className="p-1.5 rounded bg-[#0b2545] text-slate-300 hover:text-white border border-[#0f2545] hover:border-[#d4a574]/30 transition-premium cursor-pointer"
                  title="Edit Job"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="p-1.5 rounded bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-rose-900/50 hover:bg-rose-900 transition-premium cursor-pointer"
                  title="Delete Job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        </div>
      )}

      {/* Slide Modal Drawer for Job details Add/Edit */}
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
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-[#0f2545] pb-4 mb-6">
                <h3 className="text-lg font-bold text-white font-heading">
                  {editingJob ? `Edit Job Opening` : "Post Job Opening"}
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
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">
                    Job Title
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    placeholder="e.g. Senior Merchandiser"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                  {errors.title && <p className="text-rose-500 text-xs">{errors.title.message}</p>}
                </div>

                {/* Grid for Dept, Location, Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase block">
                      Department
                    </label>
                    <input
                      {...register("department")}
                      type="text"
                      className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase block">
                      Location
                    </label>
                    <input
                      {...register("location")}
                      type="text"
                      className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase block">
                      Job Type
                    </label>
                    <select
                      {...register("type")}
                      className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium cursor-pointer"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                {/* Job Description (Tiptap) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">
                    Job Description (Responsibilities)
                  </label>
                  <TiptapEditor
                    value={descriptionWatch}
                    onChange={(html) => setValue("description", html)}
                  />
                  {errors.description && <p className="text-rose-500 text-xs">{errors.description.message}</p>}
                </div>

                {/* Job Requirements (Tiptap) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">
                    Requirements (Experience, English level, etc.)
                  </label>
                  <TiptapEditor
                    value={requirementsWatch}
                    onChange={(html) => setValue("requirements", html)}
                  />
                  {errors.requirements && <p className="text-rose-500 text-xs">{errors.requirements.message}</p>}
                </div>

                {/* Toggle switch */}
                <div className="flex items-center gap-3 bg-[#040d1a]/40 p-4 rounded-xl border border-[#0f2545]">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...register("isActive")}
                    className="w-4 h-4 accent-[#d4a574] cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-xs font-semibold text-slate-300 uppercase cursor-pointer">
                    Enable and Publish Job Opening immediately
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
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving Job...
                      </>
                    ) : (
                      "Save Job"
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

