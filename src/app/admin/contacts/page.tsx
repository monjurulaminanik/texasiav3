"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/admin/DataTable";
import { X, Mail, Hash, ChevronRight, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string; // new | read | replied
  createdAt: string;
}

export default function AdminContactsPage() {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Fetch contacts
  const { data: contacts = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["adminContacts"],
    queryFn: async () => {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Failed to load contacts inbox");
      return res.json();
    },
  });

  // Mutator for updating contact status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update message status");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adminContacts"] });
      queryClient.invalidateQueries({ queryKey: ["pendingNotifications"] });
      setSelectedMessage(data);
      toast.success("Message status updated!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Delete message mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete contact log");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContacts"] });
      toast.success("Message deleted successfully!");
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleRowClick = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    // Mark as read immediately when inspected
    if (msg.status === "new") {
      updateStatusMutation.mutate({ id: msg.id, status: "read" });
    }
  };

  const handleClose = () => {
    setSelectedMessage(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMutation.mutate(id);
    }
  };

  const getMailtoLink = (msg: ContactMessage) => {
    const subject = encodeURIComponent(`Re: ${msg.subject || "Garment Sourcing Inquiry"}`);
    const body = encodeURIComponent(
      `Dear ${msg.name},\n\nThank you for reaching out to QSA Apparels\n\nWe have received your message regarding: "${msg.subject || "Garment Sourcing Inquiry"}".\n\nOur client relations team in Dhaka has reviewed your inquiry:\n"${msg.message}"\n\nOne of our sourcing experts will follow up with you shortly. If this is an urgent matter, please feel free to reach out to us via WhatsApp at +8801712345678.\n\nBest regards,\nQSA Apparels Sourcing & Sourcing Partner\nwww.qsaapparels.com`
    );
    return `mailto:${msg.email}?subject=${subject}&body=${body}`;
  };

  const columns = [
    {
      header: "Date Received",
      accessor: (row: ContactMessage) => (
        <span className="text-slate-400 font-mono text-xs">
          {formatDistanceToNow(new Date(row.createdAt))} ago
        </span>
      ),
    },
    {
      header: "Sender & Info",
      accessor: (row: ContactMessage) => (
        <div>
          <div className="text-white font-semibold">{row.name}</div>
          <div className="text-xs text-slate-500">{row.email}</div>
        </div>
      ),
    },
    {
      header: "Subject Topic",
      accessor: (row: ContactMessage) => (
        <span className="text-slate-300 text-xs font-semibold max-w-[200px] truncate block">
          {row.subject || "General Inquiry"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row: ContactMessage) => (
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            row.status === "new"
              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
              : row.status === "read"
              ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
              : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold text-white font-heading tracking-tight">
          General Contact Inbox
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review general user emails, compliance audits, and sourcing partnership pitches.
        </p>
      </div>

      {/* Main loading / table pane */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[#d4a574] animate-spin" />
          <span className="text-sm text-slate-500">Loading contact messages...</span>
        </div>
      ) : (
        <div className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6">
          <DataTable
            columns={columns}
            data={contacts}
            searchKey="name"
            searchPlaceholder="Search by sender name..."
            actions={(row) => (
              <button
                onClick={() => handleRowClick(row)}
                className="p-1.5 rounded bg-[#0b2545] text-slate-300 hover:text-white border border-[#0f2545] hover:border-[#d4a574]/30 transition-premium cursor-pointer flex items-center gap-1 text-xs font-semibold"
              >
                Inspect <ChevronRight className="w-4 h-4" />
              </button>
            )}
          />
        </div>
      )}

      {/* Sliding Drawer overlay */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer pane */}
          <div className="w-full max-w-xl bg-[#081a33] border-l border-[#0f2545] h-screen overflow-y-auto relative z-10 flex flex-col justify-between shadow-2xl p-6 sm:p-8 animate-in slide-in-from-right duration-300">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#0f2545] pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Inquiry from {selectedMessage.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Received: {format(new Date(selectedMessage.createdAt), "yyyy-MM-dd HH:mm")}
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 text-slate-400 hover:text-white hover:bg-[#0b2545] rounded-lg transition-premium cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sender Details card */}
              <div className="space-y-3 bg-[#040d1a]/50 p-4 rounded-xl border border-[#0f2545] mb-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">Email:</span>
                  <a href={`mailto:${selectedMessage.email}`} className="text-[#d4a574] hover:underline font-semibold">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-semibold">{selectedMessage.phone}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400">Subject Topic:</span>
                  <p className="font-bold text-white text-sm mt-1">{selectedMessage.subject || "General Inquiry"}</p>
                </div>
              </div>

              {/* Message body */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Message Content
                </label>
                <div className="bg-[#040d1a]/80 border border-[#0f2545] rounded-xl p-4 text-slate-200 text-sm max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="border-t border-[#0f2545] pt-6 mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status update select */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                      Read Status
                    </label>
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: selectedMessage.id, status: e.target.value })}
                      className="w-full bg-[#040d1a] border border-[#0f2545] text-slate-300 text-sm font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#d4a574] transition-premium cursor-pointer"
                    >
                      <option value="new">New / Unread</option>
                      <option value="read">Read / Reviewed</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>

                  {/* Mail responder */}
                  <div className="space-y-2 flex flex-col justify-end">
                    <a
                      href={getMailtoLink(selectedMessage)}
                      onClick={() => {
                        if (selectedMessage.status !== "replied") {
                          updateStatusMutation.mutate({ id: selectedMessage.id, status: "replied" });
                        }
                      }}
                      className="w-full bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-semibold rounded-xl py-2.5 flex items-center justify-center gap-2 cursor-pointer transition-premium shadow-lg text-sm"
                    >
                      <Mail className="w-4.5 h-4.5" /> Compose Reply
                    </a>
                  </div>
                </div>

                {/* Prune/Delete message */}
                <div className="pt-4 border-t border-[#0f2545] flex justify-between items-center">
                  <span className="text-xs text-slate-500">Prune outdated general logs:</span>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="bg-rose-950/60 hover:bg-rose-900 border border-rose-900/50 text-rose-400 hover:text-rose-300 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-premium flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

