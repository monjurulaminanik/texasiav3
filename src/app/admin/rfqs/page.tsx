"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/admin/DataTable";
import { X, Mail, Globe, Hash, DollarSign, Calendar, ChevronRight, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface RFQ {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string | null;
  country: string | null;
  productType: string | null;
  quantity: string | null;
  targetPrice: string | null;
  message: string;
  status: string; // new | contacted | quoted | closed
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminRfqsPage() {
  const queryClient = useQueryClient();
  const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);
  const [notesInput, setNotesInput] = useState("");

  // Fetch RFQs
  const { data: rfqs = [], isLoading } = useQuery<RFQ[]>({
    queryKey: ["adminRfqs"],
    queryFn: async () => {
      const res = await fetch("/api/rfq");
      if (!res.ok) throw new Error("Failed to load RFQs inbox");
      return res.json();
    },
  });

  // Mutator for Status & Notes updates
  const updateRfqMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status?: string; notes?: string }) => {
      const res = await fetch(`/api/rfq?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error("Failed to update inquiry");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adminRfqs"] });
      queryClient.invalidateQueries({ queryKey: ["pendingNotifications"] });
      
      // Update local state to reflect current DB state
      setSelectedRfq(data);
      toast.success("RFQ updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleRowClick = (rfq: RFQ) => {
    setSelectedRfq(rfq);
    setNotesInput(rfq.notes || "");
  };

  const handleClose = () => {
    setSelectedRfq(null);
    setNotesInput("");
  };

  const exportCSV = () => {
    if (rfqs.length === 0) {
      toast.error("No RFQ data available to export.");
      return;
    }

    const headers = "Date,Company,Contact,Email,Phone,Country,Product,Quantity,Price,Status\n";
    const rows = rfqs
      .map(
        (r) =>
          `"${format(new Date(r.createdAt), "yyyy-MM-dd")}","${r.companyName}","${r.contactName}","${r.email}","${r.phone || ""}","${r.country || ""}","${r.productType || ""}","${r.quantity || ""}","${r.targetPrice || ""}","${r.status}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `rfqs-export-${format(new Date(), "yyyyMMdd")}.csv`);
    a.click();
    toast.success("CSV export downloaded successfully!");
  };

  // Compile pre-filled professional mailto link
  const getMailtoLink = (rfq: RFQ) => {
    const subject = encodeURIComponent(`Texasia Garment Sourcing Inquiry - Re: ${rfq.productType || "Garment Production"}`);
    const body = encodeURIComponent(
      `Dear ${rfq.contactName},\n\nThank you for reaching out to Texasia International Fashion Co., Ltd.\n\nWe have received your RFQ for ${rfq.quantity || "bulk"} pieces of ${rfq.productType || "garments"} targeting ${rfq.targetPrice || "competitive"} price points.\n\nOur merchandising team in Dhaka is currently evaluating your design specifications and sourcing details. We will prepare a detailed quotation sheet with estimated shipping/freight options shortly.\n\nTo help us expedite the process, could you please supply:\n1. Any detailed tech packs or design CAD drafts?\n2. Desired fabric weight (GSM) and composition?\n\nLooking forward to a mutually beneficial partnership.\n\nBest regards,\nTexasia Merchandising Team\nMirpur DOHS, Dhaka, Bangladesh\nwww.texasiafashion.com`
    );
    return `mailto:${rfq.email}?subject=${subject}&body=${body}`;
  };

  const columns = [
    {
      header: "Date Received",
      accessor: (row: RFQ) => (
        <span className="text-slate-400 font-mono text-xs">
          {format(new Date(row.createdAt), "yyyy-MM-dd HH:mm")}
        </span>
      ),
    },
    {
      header: "Company & Contact",
      accessor: (row: RFQ) => (
        <div>
          <div className="text-white font-semibold">{row.companyName}</div>
          <div className="text-xs text-slate-500">
            {row.contactName} ({row.country || "Global"})
          </div>
        </div>
      ),
    },
    {
      header: "Requested Sourcing",
      accessor: (row: RFQ) => (
        <div>
          <div className="text-slate-300 text-xs font-semibold">{row.productType || "Garment"}</div>
          <div className="text-[10px] text-slate-500">
            Qty: {row.quantity || "N/A"} · Price: {row.targetPrice || "N/A"}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: RFQ) => (
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            row.status === "new"
              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
              : row.status === "contacted"
              ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
              : row.status === "quoted"
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-tight">
            RFQ Sourcing Inbox
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review wholesale buying requests, manage CRM statuses, and coordinate quotations.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="bg-[#0b2545] hover:bg-[#0f2545] text-slate-300 hover:text-white border border-[#0f2545] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-premium self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-5 h-5 text-[#d4a574]" /> Export CSV
        </button>
      </div>

      {/* Main loading / DataTable pane */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[#d4a574] animate-spin" />
          <span className="text-sm text-slate-500">Loading RFQs inbox...</span>
        </div>
      ) : (
        <div className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6">
          <DataTable
            columns={columns}
            data={rfqs}
            searchKey="companyName"
            searchPlaceholder="Search by company name..."
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

      {/* Slide Modal Drawer for inspecting RFQ Details */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <div className="w-full max-w-2xl bg-[#081a33] border-l border-[#0f2545] h-screen overflow-y-auto relative z-10 flex flex-col justify-between shadow-2xl p-6 sm:p-8 animate-in slide-in-from-right duration-300">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#0f2545] pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    RFQ: {selectedRfq.companyName}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID: {selectedRfq.id}
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 text-slate-400 hover:text-white hover:bg-[#0b2545] rounded-lg transition-premium cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CRM Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#040d1a]/50 p-4 rounded-xl border border-[#0f2545] mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400">Contact:</span>
                    <a href={`mailto:${selectedRfq.email}`} className="text-[#d4a574] hover:underline font-semibold">
                      {selectedRfq.contactName}
                    </a>
                  </div>
                  {selectedRfq.phone && (
                    <div className="flex items-center gap-2 text-xs">
                      <Hash className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400">Phone:</span>
                      <span className="text-slate-300 font-semibold">{selectedRfq.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400">Country:</span>
                    <span className="text-slate-300 font-semibold">{selectedRfq.country || "Global"}</span>
                  </div>
                </div>

                <div className="space-y-3 border-t sm:border-t-0 sm:border-l border-[#0f2545] pt-3 sm:pt-0 sm:pl-6">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Product:</span>
                    <span className="text-[#d4a574] font-semibold uppercase">{selectedRfq.productType || "Garment"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Quantity:</span>
                    <span className="text-slate-300 font-semibold">{selectedRfq.quantity || "N/A"} pcs</span>
                  </div>
                  {selectedRfq.targetPrice && (
                    <div className="flex items-center gap-2 text-xs">
                      <DollarSign className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400">Target Price:</span>
                      <span className="text-emerald-400 font-semibold">{selectedRfq.targetPrice}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Inquiry message */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Buyer's Request Message
                </label>
                <div className="bg-[#040d1a]/80 border border-[#0f2545] rounded-xl p-4 text-slate-200 text-sm max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {selectedRfq.message}
                </div>
              </div>

              {/* CRM controls form */}
              <div className="border-t border-[#0f2545] pt-6 mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Status update drop-down */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                      Lead Status
                    </label>
                    <select
                      value={selectedRfq.status}
                      onChange={(e) => updateRfqMutation.mutate({ id: selectedRfq.id, status: e.target.value })}
                      className="w-full bg-[#040d1a] border border-[#0f2545] text-slate-300 text-sm font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#d4a574] transition-premium cursor-pointer"
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted / Sampling</option>
                      <option value="quoted">Quoted / Sheet Sent</option>
                      <option value="closed">Closed / Closed Deal</option>
                    </select>
                  </div>

                  {/* Mail reply quick shortcut */}
                  <div className="space-y-2 flex flex-col justify-end">
                    <a
                      href={getMailtoLink(selectedRfq)}
                      onClick={() => {
                        // Automatically shift status to contacted upon clicking email responder
                        if (selectedRfq.status === "new") {
                          updateRfqMutation.mutate({ id: selectedRfq.id, status: "contacted" });
                        }
                      }}
                      className="w-full bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-semibold rounded-xl py-2.5 flex items-center justify-center gap-2 cursor-pointer transition-premium shadow-lg text-sm"
                    >
                      <Mail className="w-4.5 h-4.5" /> Reply via Email
                    </a>
                  </div>
                </div>

                {/* Internal notes text area */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    Internal Staff Notes (CRM log)
                  </label>
                  <textarea
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Log sampling details, pricing compromises, phone logs here..."
                    rows={4}
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => updateRfqMutation.mutate({ id: selectedRfq.id, notes: notesInput })}
                    className="bg-[#0b2545] hover:bg-[#0f2545] border border-[#0f2545] text-slate-300 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-premium"
                  >
                    Save Notes log
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

