"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ImageUploader from "@/components/admin/ImageUploader";
import { Loader2, Settings, Mail, ShieldAlert, Check } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

const settingsSchema = zod.object({
  siteName: zod.string().min(2, "Site name must be at least 2 characters"),
  tagline: zod.string().optional(),
  logo: zod.string().optional(),
  favicon: zod.string().optional(),
  email: zod.string().email("Invalid corporate email").optional().or(zod.literal("")),
  phone: zod.string().optional(),
  whatsapp: zod.string().optional(),
  address: zod.string().optional(),
  facebook: zod.string().optional(),
  linkedin: zod.string().optional(),
  instagram: zod.string().optional(),
  youtube: zod.string().optional(),
  footerText: zod.string().optional(),
  smtpHost: zod.string().optional(),
  smtpPort: zod.preprocess((val) => Number(val), zod.number().default(587)),
  smtpUser: zod.string().optional(),
  smtpPass: zod.string().optional(),
  smtpFromName: zod.string().optional(),
  smtpFromAddr: zod.string().optional(),
});

type SettingsFormValues = zod.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"general" | "contact" | "social" | "smtp">("general");
  const [testEmailInput, setTestEmailInput] = useState("");
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  });

  const logoWatch = watch("logo") || "";
  const faviconWatch = watch("favicon") || "";

  // Fetch site settings
  const { isLoading } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      const data = await res.json();
      
      // Populate form defaults
      reset({
        siteName: data.siteName || "Texasia Clone",
        tagline: data.tagline || "",
        logo: data.logo || "",
        favicon: data.favicon || "",
        email: data.email || "",
        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        address: data.address || "",
        facebook: data.facebook || "",
        linkedin: data.linkedin || "",
        instagram: data.instagram || "",
        youtube: data.youtube || "",
        footerText: data.footerText || "",
        smtpHost: data.smtpHost || "",
        smtpPort: data.smtpPort || 587,
        smtpUser: data.smtpUser || "",
        smtpPass: data.smtpPass || "",
        smtpFromName: data.smtpFromName || "",
        smtpFromAddr: data.smtpFromAddr || "",
      });
      return data;
    },
  });

  // Mutator for Settings saving
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save settings failed");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      toast.success("Settings updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Trigger SMTP verify test mail mutation
  const handleTestEmail = async () => {
    if (!testEmailInput) {
      toast.error("Please enter a target email address first.");
      return;
    }

    setIsTestingSmtp(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test_email", testEmail: testEmailInput }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Test transmission failed");
      }

      toast.success("Test verification email successfully transmitted!");
      setTestEmailInput("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to transmit test email.");
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const onSubmit = (data: SettingsFormValues) => {
    saveSettingsMutation.mutate(data);
  };

  const tabs = [
    { id: "general", name: "General Info" },
    { id: "contact", name: "Contact & Address" },
    { id: "social", name: "Social Channels" },
    { id: "smtp", name: "Email SMTP Setup" },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div>
        <h1 className="text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#d4a574]" /> Site Configurations
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure branding, global headers/footers, maps address, and SMTP messaging servers.
        </p>
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

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[#d4a574] animate-spin" />
          <span className="text-sm text-slate-500">Loading configurations...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Tab 1: General Info */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">Site / Company Name</label>
                  <input
                    {...register("siteName")}
                    type="text"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">Brand Tagline</label>
                  <input
                    {...register("tagline")}
                    type="text"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>
              </div>

              {/* Logo & Favicon uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ImageUploader
                  value={logoWatch ? [logoWatch] : []}
                  onChange={(urls) => setValue("logo", urls[0] || "")}
                  folder="pages"
                  maxImages={1}
                />
                <ImageUploader
                  value={faviconWatch ? [faviconWatch] : []}
                  onChange={(urls) => setValue("favicon", urls[0] || "")}
                  folder="pages"
                  maxImages={1}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase block">Footer copyright text</label>
                <textarea
                  {...register("footerText")}
                  rows={3}
                  className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium resize-none"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Contact Info */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">Public email address</label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">Public Phone Line</label>
                  <input
                    {...register("phone")}
                    type="text"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">WhatsApp Number (inc. country code)</label>
                  <input
                    {...register("whatsapp")}
                    type="text"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase block">Physical Office / Factory Address</label>
                <textarea
                  {...register("address")}
                  rows={3}
                  className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium resize-none"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Social Channels */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">Facebook URL</label>
                  <input
                    {...register("facebook")}
                    type="text"
                    placeholder="https://facebook.com/..."
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">LinkedIn Company page</label>
                  <input
                    {...register("linkedin")}
                    type="text"
                    placeholder="https://linkedin.com/company/..."
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">Instagram Profile</label>
                  <input
                    {...register("instagram")}
                    type="text"
                    placeholder="https://instagram.com/..."
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">YouTube Channel</label>
                  <input
                    {...register("youtube")}
                    type="text"
                    placeholder="https://youtube.com/channel/..."
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Email SMTP Configuration */}
          {activeTab === "smtp" && (
            <div className="space-y-6">
              <div className="bg-[#0b2545]/20 p-4 rounded-xl border border-[#0f2545] flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#d4a574] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400">
                  Strict SMTP configurations ensure lead email notifications deliver instantly to your administrative inboxes. Make sure SMTP server addresses, ports, usernames, and app passwords are exact.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">SMTP Host</label>
                  <input
                    {...register("smtpHost")}
                    type="text"
                    placeholder="e.g. smtp.gmail.com"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">SMTP Port</label>
                  <input
                    {...register("smtpPort")}
                    type="number"
                    placeholder="e.g. 587"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">SMTP User / Username</label>
                  <input
                    {...register("smtpUser")}
                    type="text"
                    placeholder="your-email@gmail.com"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">SMTP Password / App Key</label>
                  <input
                    {...register("smtpPass")}
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">SMTP From Name</label>
                  <input
                    {...register("smtpFromName")}
                    type="text"
                    placeholder="Texasia Alerts"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase block">SMTP From Address</label>
                  <input
                    {...register("smtpFromAddr")}
                    type="text"
                    placeholder="noreply@yourdomain.com"
                    className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                </div>
              </div>

              {/* SMTP test verification box */}
              <div className="bg-[#040d1a]/60 p-5 rounded-xl border border-[#0f2545] space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#d4a574]" /> Test Mail Delivery Config
                </h4>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="email"
                    value={testEmailInput}
                    onChange={(e) => setTestEmailInput(e.target.value)}
                    placeholder="Enter email to receive test message..."
                    className="w-full sm:max-w-md bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-2 px-4 text-xs text-white focus:outline-none focus:border-[#d4a574] transition-premium"
                  />
                  <button
                    type="button"
                    onClick={handleTestEmail}
                    className="bg-[#0b2545] hover:bg-[#0f2545] border border-[#0f2545] hover:border-[#d4a574]/30 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-premium disabled:opacity-50"
                    disabled={isTestingSmtp}
                  >
                    {isTestingSmtp ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...
                      </>
                    ) : (
                      "Send Verification Mail"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Submit button footer */}
          <div className="pt-6 border-t border-[#0f2545] flex items-center justify-end gap-3">
            <button
              type="submit"
              className="bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-premium disabled:opacity-50 text-sm"
              disabled={saveSettingsMutation.isPending}
            >
              {saveSettingsMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Settings...
                </>
              ) : (
                "Save Settings"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

