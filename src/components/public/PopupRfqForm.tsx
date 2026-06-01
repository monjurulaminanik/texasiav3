"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { X, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

const rfqSchema = zod.object({
  contactName: zod.string().min(2, "Full Name is required"),
  companyName: zod.string().min(2, "Company Name is required"),
  email: zod.string().email("Valid email is required"),
  phone: zod.string().min(5, "Phone is required"),
  country: zod.string().min(2, "Country is required"),
  message: zod.string().min(10, "Please provide your requirements"),
  honeypot: zod.string().optional(),
});

type RFQFormValues = zod.infer<typeof rfqSchema>;

export default function PopupRfqForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileAttached, setFileAttached] = useState<File | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // If we are on the homepage, show it almost immediately (e.g. 1.5 seconds)
    // Only once per page load to not be overwhelmingly annoying if they just route away and back
    if (pathname === "/" && !hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [pathname, hasShown]);

  useEffect(() => {
    const handleOpenPopup = () => {
      setIsOpen(true);
    };

    window.addEventListener("openRfqPopup", handleOpenPopup);
    return () => window.removeEventListener("openRfqPopup", handleOpenPopup);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RFQFormValues>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      contactName: "",
      companyName: "",
      email: "",
      phone: "",
      country: "",
      message: "",
      honeypot: "",
    },
  });

  const onSubmit = async (data: RFQFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          productType: "Custom Quote Popup",
          notes: fileAttached ? `User attempted to attach file: ${fileAttached.name}` : "",
        }),
      });

      if (!res.ok) throw new Error("Failed to submit RFQ");
      
      toast.success("Thank you! Your quote request has been received. Our team will contact you shortly.");
      setIsOpen(false);
      reset();
      setFileAttached(null);
    } catch (error) {
      toast.error("There was an error submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#040d1a]/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Popup Container */}
      <div className="bg-white rounded-2xl w-full max-w-3xl relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-0 right-0 bg-red-600 text-white p-2 hover:bg-red-700 transition-colors z-20 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#081a33] font-heading">
              Get a Custom Quote for Your Apparel Production
            </h2>
            <p className="text-[#0b2545] font-semibold mt-2">
              Direct manufacturer • MOQ-friendly • Fast turnaround
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="hidden">
              <input type="text" {...register("honeypot")} tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  FULL NAME <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("contactName")}
                  placeholder="Enter Your Full Name"
                  className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2545] focus:ring-1 focus:ring-[#0b2545] transition-premium"
                />
                {errors.contactName && <p className="text-red-500 text-xs">{errors.contactName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  COMPANY NAME <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("companyName")}
                  placeholder="Enter Your Company Name"
                  className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2545] focus:ring-1 focus:ring-[#0b2545] transition-premium"
                />
                {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  EMAIL ADDRESS <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Enter Your Email Address"
                  className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2545] focus:ring-1 focus:ring-[#0b2545] transition-premium"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  PHONE / WHATSAPP <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="w-16 flex-shrink-0 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center text-xl">
                    🇧🇩
                  </div>
                  <input
                    {...register("phone")}
                    placeholder="Enter Your Phone Number"
                    className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2545] focus:ring-1 focus:ring-[#0b2545] transition-premium"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  YOUR COUNTRY <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("country")}
                  className="w-full bg-slate-100 border border-slate-300 rounded-lg py-3 px-4 text-slate-800 focus:outline-none focus:border-[#0b2545] focus:ring-1 focus:ring-[#0b2545] transition-premium cursor-pointer"
                >
                  <option value="">Select Country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Europe">Europe</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="Other">Other</option>
                </select>
                {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  ATTACH TECH PACK / REFERENCE
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    id="techpack-upload"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileAttached(e.target.files[0]);
                      }
                    }}
                    accept=".pdf,.ai,.jpg,.jpeg,.png"
                  />
                  <label 
                    htmlFor="techpack-upload"
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-full py-3 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors text-sm font-medium"
                  >
                    <UploadCloud className="w-4 h-4" />
                    {fileAttached ? fileAttached.name.substring(0, 20) + (fileAttached.name.length > 20 ? '...' : '') : "Upload file (AI, PDF, JPG, PNG)"}
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                TELL US YOUR REQUIREMENTS <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("message")}
                rows={4}
                placeholder="Product type • Fabric Composition, Type & GSM • Order Quantity • Target price (if any) • Delivery timeline"
                className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2545] focus:ring-1 focus:ring-[#0b2545] transition-premium resize-none"
              />
              {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0b2545] hover:bg-[#081a33] text-white font-bold rounded-full py-4 flex items-center justify-center gap-2 cursor-pointer transition-premium disabled:opacity-70 disabled:cursor-not-allowed text-lg shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  SUBMITTING...
                </>
              ) : (
                "REQUEST QUOTE"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
