"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Shirt, 
  Layers, 
  CircleDollarSign, 
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";

export default function RequestForQuotationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    productType: "Knitwear & T-Shirts",
    quantity: "",
    targetPrice: "",
    message: "",
    honeypot: "", // Honeypot spam blocker
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    // Step validation
    if (currentStep === 1) {
      if (!formData.companyName || !formData.contactName || !formData.email) {
        setSubmitError("Please fill in all required company and contact information.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setSubmitError("Please enter a valid business email address.");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.productType || !formData.quantity) {
        setSubmitError("Please specify the product type and estimated batch order quantity.");
        return;
      }
    }
    setSubmitError("");
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setSubmitError("");
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    if (!formData.message) {
      setSubmitError("Please describe your fabric, sourcing spec, or custom tailoring requests.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong during submission.");
      }

      setSubmitSuccess(true);
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        country: "",
        productType: "Knitwear & T-Shirts",
        quantity: "",
        targetPrice: "",
        message: "",
        honeypot: "",
      });
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Failed to transmit sourcing RFQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { label: "Company Details", icon: <Building2 className="w-4 h-4" /> },
    { label: "Product Specifications", icon: <Shirt className="w-4 h-4" /> },
    { label: "Message & Review", icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-6">
      {/* Page Header */}
      <section className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 bg-[#d4a574]/10 border border-[#d4a574]/30 px-3 py-1 rounded-full text-[10px] font-bold text-[#d4a574] uppercase tracking-wider">
          💼 Custom Apparel Manufacturing
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
          Request For Quotation (RFQ)
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Submit your bulk garment production queries. Our merchandising engineers in Dhaka will review your tech pack and reply with a complete price quote within 24 business hours.
        </p>
      </section>

      {/* Progress Wizard Steps */}
      <div className="flex justify-between items-center mb-10 max-w-2xl mx-auto relative px-2">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#0f2545]/60 -translate-y-1/2 -z-10" />
        {stepsList.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          return (
            <div key={idx} className="flex flex-col items-center gap-2 z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border text-xs font-bold transition-premium ${
                  isActive
                    ? "bg-[#d4a574] text-[#040d1a] border-[#d4a574] shadow-[0_0_15px_rgba(212,165,116,0.3)]"
                    : isCompleted
                    ? "bg-emerald-500 text-[#040d1a] border-emerald-500"
                    : "bg-[#040d1a] text-slate-500 border-[#0f2545]"
                }`}
              >
                {isCompleted ? "✓" : step.icon}
              </div>
              <span
                className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${
                  isActive ? "text-[#d4a574]" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Wizard Form container */}
      <div className="bg-[#081a33]/30 border border-[#0f2545]/60 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Glow Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-[#d4a574]/5 via-transparent to-transparent pointer-events-none -z-10" />

        {submitSuccess ? (
          <div className="text-center py-12 space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-white font-heading">
              Sourcing RFQ Submitted!
            </h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Your manufacturing query has been logged inside our central B2B sourcing registry. A senior RMG merchandiser has been assigned to your request and will contact you directly via email.
            </p>
            <div className="border-t border-[#0f2545]/30 pt-6 flex justify-center gap-4">
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setCurrentStep(1);
                }}
                className="bg-[#d4a574] text-[#040d1a] font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#c39463] cursor-pointer transition-premium"
              >
                Submit Another Request
              </button>
              <button
                onClick={() => router.push("/products")}
                className="bg-[#0b2545]/50 border border-[#0f2545] text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:border-slate-500 cursor-pointer transition-premium"
              >
                Browse Catalog
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot Spam Blocker (hidden field) */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              className="absolute opacity-0 pointer-events-none -z-50"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Error Message banner */}
            {submitError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* STEP 1: COMPANY & CONTACT INFO */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-[#0f2545]/30 pb-4">
                  <h3 className="text-white font-heading font-extrabold text-base">Company & Contact Info</h3>
                  <p className="text-slate-400 text-[11px]">Tell us about your brand and the primary procurement contact.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Nordstrom Apparel Group"
                        className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                        required
                      />
                    </div>
                  </div>

                  {/* Business Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      Business Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. sourcing@nordstrom.com"
                        className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone number */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      Phone Number (Include Country Code)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +1 (555) 019-2834"
                        className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                      />
                    </div>
                  </div>

                  {/* Sourcing Country */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      Delivery Destination Country
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="e.g. United States, Germany, Japan"
                        className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PRODUCT SPECIFICATIONS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-[#0f2545]/30 pb-4">
                  <h3 className="text-white font-heading font-extrabold text-base">Product Specifications</h3>
                  <p className="text-slate-400 text-[11px]">Tell us what garments you wish to produce and the estimated quantities.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Type Category */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      Product Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Shirt className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4a574]" />
                      <select
                        name="productType"
                        value={formData.productType}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-[#d4a574] cursor-pointer appearance-none transition-premium"
                      >
                        <option value="Knitwear & T-Shirts" className="bg-[#040d1a]">Knitwear & T-Shirts</option>
                        <option value="Woven Shirts & Tops" className="bg-[#040d1a]">Woven Shirts & Tops</option>
                        <option value="Denim & Jeans" className="bg-[#040d1a]">Denim & Jeans</option>
                        <option value="Jackets & Outerwear" className="bg-[#040d1a]">Jackets & Outerwear</option>
                        <option value="Activewear & Sportswear" className="bg-[#040d1a]">Activewear & Sportswear</option>
                        <option value="Childrenswear" className="bg-[#040d1a]">Childrenswear</option>
                        <option value="Undergarments & Socks" className="bg-[#040d1a]">Undergarments & Socks</option>
                        <option value="Custom Fabrics" className="bg-[#040d1a]">Custom Organic Fabrics</option>
                      </select>
                    </div>
                  </div>

                  {/* Quantity (MOQ is 1000pcs) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      Estimated Order Volume (pcs) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="e.g. 5,000 (Min. MOQ: 1,000)"
                        className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                        required
                      />
                    </div>
                  </div>

                  {/* Target Unit Price */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      Target Unit Price (USD / piece FOB)
                    </label>
                    <div className="relative">
                      <CircleDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        name="targetPrice"
                        value={formData.targetPrice}
                        onChange={handleChange}
                        placeholder="e.g. $4.50 - $5.20"
                        className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: MESSAGE & REVIEW */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-[#0f2545]/30 pb-4">
                  <h3 className="text-white font-heading font-extrabold text-base">Message & Tech Specs</h3>
                  <p className="text-slate-400 text-[11px]">Describe details regarding fabrics, patterns, wash specifications, or design tags.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    Detailed Sourcing Specifications <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-4.5 w-4 h-4 text-slate-500" />
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Include details about: fabric GSM weights, specific organic certificates required, printing styles, custom packaging options, and logistics delivery timelines..."
                      className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                      required
                    />
                  </div>
                </div>

                {/* Sourcing Summary Checklist */}
                <div className="bg-[#0b2545]/40 border border-[#0f2545] p-5 rounded-2xl space-y-3.5 text-xs text-slate-300">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Verify RFQ Information:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 font-medium">
                    <div><span className="text-slate-500">Brand Company:</span> {formData.companyName}</div>
                    <div><span className="text-slate-500">Contact:</span> {formData.contactName}</div>
                    <div><span className="text-slate-500">Business Email:</span> {formData.email}</div>
                    <div><span className="text-slate-500">Destination:</span> {formData.country || "N/A"}</div>
                    <div><span className="text-slate-500">Product:</span> {formData.productType}</div>
                    <div><span className="text-slate-500">Quantity:</span> {formData.quantity} pcs</div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between border-t border-[#0f2545]/30 pt-6 mt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 border border-[#0f2545] text-slate-300 hover:text-white px-5 py-3 rounded-xl hover:border-slate-500 cursor-pointer transition-premium text-xs md:text-sm font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous Step
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-[#d4a574] text-[#040d1a] hover:bg-[#c39463] px-6 py-3 rounded-xl cursor-pointer transition-premium text-xs md:text-sm font-bold ml-auto"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-[#d4a574] text-[#040d1a] hover:bg-[#c39463] disabled:opacity-50 px-6 py-3 rounded-xl cursor-pointer transition-premium text-xs md:text-sm font-bold ml-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing RFQ...
                    </>
                  ) : (
                    <>
                      Submit Sourcing RFQ <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

