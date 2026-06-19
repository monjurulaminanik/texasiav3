"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/admin/DataTable";
import { Plus, Edit, Trash2, X, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useSession } from "next-auth/react";

const userSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  email: zod.string().email("Invalid email address"),
  password: zod.string().optional().or(zod.literal("")),
  role: zod.string().default("editor"),
});

type UserFormValues = zod.infer<typeof userSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "editor",
    },
  });

  // Fetch users list
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to load user managers");
      return res.json();
    },
  });

  // Mutator for User saving (Add or Edit)
  const upsertMutation = useMutation({
    mutationFn: async (data: UserFormValues) => {
      const url = editingUser ? `/api/users?id=${editingUser.id}` : "/api/users";
      const method = editingUser ? "PATCH" : "POST";

      // For edits, delete empty password fields to avoid blank resets
      const payload: any = { ...data };
      if (editingUser && !payload.password) {
        delete payload.password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save operation failed");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success(editingUser ? "User updated!" : "User account created successfully!");
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("User account deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("role", user.role);
    setValue("password", ""); // Clear password for security
    setIsOpen(true);
  };

  const handleClose = () => {
    setEditingUser(null);
    reset({
      name: "",
      email: "",
      password: "",
      role: "editor",
    });
    setIsOpen(false);
  };

  const handleDelete = (user: User) => {
    if (session?.user?.id === user.id) {
      toast.error("You cannot delete your own active administrative account.");
      return;
    }

    if (confirm(`Are you sure you want to delete ${user.name}'s account?`)) {
      deleteMutation.mutate(user.id);
    }
  };

  const onSubmit = (data: UserFormValues) => {
    // Basic password validation for new users
    if (!editingUser && (!data.password || data.password.length < 6)) {
      toast.error("Password is required and must be at least 6 characters for new users.");
      return;
    }
    upsertMutation.mutate(data);
  };

  const columns = [
    {
      header: "Staff Member",
      accessor: (row: User) => (
        <div>
          <div className="text-white font-semibold flex items-center gap-1.5">
            {row.name} {row.id === session?.user?.id && <span className="text-[9px] bg-amber-500/20 text-[#d4a574] px-1 rounded">You</span>}
          </div>
          <div className="text-xs text-slate-500">{row.email}</div>
        </div>
      ),
    },
    {
      header: "Security Role",
      accessor: (row: User) => (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
            row.role === "admin"
              ? "bg-[#d4a574]/10 text-[#d4a574] border border-[#d4a574]/20"
              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> {row.role}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-tight">
            User Managers
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review security credentials, roles, and administrative staff accounts.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[#d4a574]/20 transition-premium self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> Add Staff Member
        </button>
      </div>

      {/* Main loading / DataTable pane */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[#d4a574] animate-spin" />
          <span className="text-sm text-slate-500">Loading user lists...</span>
        </div>
      ) : (
        <div className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6">
          <DataTable
            columns={columns}
            data={users}
            searchKey="name"
            searchPlaceholder="Search staff by name..."
            actions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(row)}
                  className="p-1.5 rounded bg-[#0b2545] text-slate-300 hover:text-white border border-[#0f2545] hover:border-[#d4a574]/30 transition-premium cursor-pointer"
                  title="Edit Staff User"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  disabled={row.id === session?.user?.id}
                  className="p-1.5 rounded bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-rose-900/50 hover:bg-rose-900 transition-premium cursor-pointer disabled:opacity-40"
                  title="Delete Staff User"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        </div>
      )}

      {/* Slide Modal Drawer for Add/Edit Staff accounts */}
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
                  {editingUser ? `Edit Staff Member: ${editingUser.name}` : "Create Staff Account"}
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
                    Staff Name
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                  {errors.name && <p className="text-rose-500 text-xs">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase block">
                      Email Address
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="e.g. john@qsaapparels.local"
                      disabled={!!editingUser}
                      className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium disabled:opacity-50"
                    />
                    {errors.email && <p className="text-rose-500 text-xs">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase block">
                      Security Role
                    </label>
                    <select
                      {...register("role")}
                      className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium cursor-pointer"
                    >
                      <option value="editor">Editor (Blogs, FAQ, Jobs)</option>
                      <option value="admin">Administrator (Full Access)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">
                    {editingUser ? "Reset Password (Leave blank to keep current)" : "Password Security"}
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="Min 6 characters..."
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                  {errors.password && <p className="text-rose-500 text-xs">{errors.password.message}</p>}
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
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving account...
                      </>
                    ) : (
                      "Save Staff Account"
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

