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
    <div className="bg-white min-h-screen pt-40 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Page Header */}
        <section className="text-center space-y-6 mb-16 border-b border-gray-100 pb-16">
          <div className="inline-flex items-center gap-2 bg-[#f8f9fa] px-4 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-widest">
            💼 Custom Apparel Manufacturing
          </div>
          <h1 className="text-3xl md:text-5xl font-light text-[#212529] font-heading tracking-[0.1em] uppercase leading-[1.3]">
            Request For Quotation
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto font-light leading-[1.8]">
            Submit your bulk garment production queries. Our merchandising engineers in Dhaka will review your tech pack and reply with a complete price quote within 24 business hours.
          </p>
        </section>

        {/* Progress Wizard Steps */}
        <div className="flex justify-between items-center mb-16 max-w-2xl mx-auto relative px-4">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-200 -translate-y-1/2 -z-10" />
          {stepsList.map((step, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;
            return (
              <div key={idx} className="flex flex-col items-center gap-4 z-10 bg-white px-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                    isActive
                      ? "bg-[#212529] text-white border-[#212529]"
                      : isCompleted
                      ? "bg-[#f8f9fa] text-[#212529] border-gray-300"
                      : "bg-white text-gray-300 border-gray-200"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.icon}
                </div>
                <span
                  className={`text-[9px] font-medium uppercase tracking-widest hidden sm:block ${
                    isActive ? "text-[#212529]" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Wizard Form container */}
        <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
          {submitSuccess ? (
            <div className="text-center py-16 space-y-8 max-w-lg mx-auto">
              <div className="w-20 h-20 bg-[#f8f9fa] border border-gray-100 rounded-full flex items-center justify-center mx-auto text-[#212529]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-light text-[#212529] font-heading tracking-[0.1em] uppercase">
                RFQ Submitted Successfully
              </h2>
              <p className="text-gray-500 text-sm font-light leading-[1.8]">
                Your manufacturing query has been logged inside our central B2B sourcing registry. A senior RMG merchandiser has been assigned to your request and will contact you directly via email.
              </p>
              <div className="border-t border-gray-100 pt-8 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setCurrentStep(1);
                  }}
                  className="bg-[#212529] text-white font-medium text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-[#d12026] transition-colors"
                >
                  New Request
                </button>
                <button
                  onClick={() => router.push("/products")}
                  className="bg-[#f8f9fa] text-gray-600 font-medium text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-gray-200 transition-colors"
                >
                  Browse Catalog
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
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
                <div className="bg-[#fff5f5] border border-[#ffdddd] text-[#d12026] p-4 flex items-start gap-3 text-xs font-medium">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* STEP 1: COMPANY & CONTACT INFO */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-[#212529] font-heading font-light tracking-[0.1em] text-lg uppercase mb-2">Company & Contact Info</h3>
                    <p className="text-gray-500 font-light text-sm">Tell us about your brand and the primary procurement contact.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Company Name */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        Company Name <span className="text-[#d12026]">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="e.g. Nordstrom Apparel Group"
                          className="w-full pl-12 pr-4 py-4 bg-[#f8f9fa] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-[#212529] placeholder-gray-400 outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* Contact Name */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        Contact Person <span className="text-[#d12026]">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleChange}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full pl-12 pr-4 py-4 bg-[#f8f9fa] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-[#212529] placeholder-gray-400 outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* Business Email */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        Business Email <span className="text-[#d12026]">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="e.g. sourcing@nordstrom.com"
                          className="w-full pl-12 pr-4 py-4 bg-[#f8f9fa] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-[#212529] placeholder-gray-400 outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone number */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        Phone Number (Include Country Code)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. +1 (555) 019-2834"
                          className="w-full pl-12 pr-4 py-4 bg-[#f8f9fa] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-[#212529] placeholder-gray-400 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Sourcing Country */}
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        Delivery Destination Country
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="e.g. United States, Germany, Japan"
                          className="w-full pl-12 pr-4 py-4 bg-[#f8f9fa] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-[#212529] placeholder-gray-400 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PRODUCT SPECIFICATIONS */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-[#212529] font-heading font-light tracking-[0.1em] text-lg uppercase mb-2">Product Specifications</h3>
                    <p className="text-gray-500 font-light text-sm">Tell us what garments you wish to produce and the estimated quantities.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Type Category */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        Product Category <span className="text-[#d12026]">*</span>
                      </label>
                      <div className="relative">
                        <Shirt className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          name="productType"
                          value={formData.productType}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-[#f8f9fa] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-[#212529] outline-none cursor-pointer appearance-none transition-colors"
                        >
                          <option value="Knitwear & T-Shirts">Knitwear & T-Shirts</option>
                          <option value="Woven Shirts & Tops">Woven Shirts & Tops</option>
                          <option value="Denim & Jeans">Denim & Jeans</option>
                          <option value="Jackets & Outerwear">Jackets & Outerwear</option>
                          <option value="Activewear & Sportswear">Activewear & Sportswear</option>
                          <option value="Childrenswear">Childrenswear</option>
                          <option value="Undergarments & Socks">Undergarments & Socks</option>
                          <option value="Custom Fabrics">Custom Organic Fabrics</option>
                        </select>
                      </div>
                    </div>

                    {/* Quantity (MOQ is 1000pcs) */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        Estimated Order Volume (pcs) <span className="text-[#d12026]">*</span>
                      </label>
                      <div className="relative">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="e.g. 5,000 (Min. MOQ: 1,000)"
                          className="w-full pl-12 pr-4 py-4 bg-[#f8f9fa] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-[#212529] placeholder-gray-400 outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* Target Unit Price */}
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        Target Unit Price (USD / piece FOB)
                      </label>
                      <div className="relative">
                        <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="targetPrice"
                          value={formData.targetPrice}
                          onChange={handleChange}
                          placeholder="e.g. $4.50 - $5.20"
                          className="w-full pl-12 pr-4 py-4 bg-[#f8f9fa] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-[#212529] placeholder-gray-400 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: MESSAGE & REVIEW */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-[#212529] font-heading font-light tracking-[0.1em] text-lg uppercase mb-2">Message & Tech Specs</h3>
                    <p className="text-gray-500 font-light text-sm">Describe details regarding fabrics, patterns, wash specifications, or design tags.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      Detailed Sourcing Specifications <span className="text-[#d12026]">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-gray-400" />
                      <textarea
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Include details about: fabric GSM weights, specific organic certificates required, printing styles, custom packaging options, and logistics delivery timelines..."
                        className="w-full pl-12 pr-4 py-4 bg-[#f8f9fa] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-[#212529] placeholder-gray-400 outline-none transition-colors resize-y min-h-[150px]"
                        required
                      />
                    </div>
                  </div>

                  {/* Sourcing Summary Checklist */}
                  <div className="bg-[#f8f9fa] p-8 space-y-6">
                    <h4 className="text-[10px] font-medium text-gray-400 uppercase tracking-widest block border-b border-gray-200 pb-4">Verify RFQ Information:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm font-light">
                      <div><span className="text-gray-400 block text-[10px] font-medium uppercase tracking-widest mb-1">Brand Company:</span> <span className="text-[#212529]">{formData.companyName}</span></div>
                      <div><span className="text-gray-400 block text-[10px] font-medium uppercase tracking-widest mb-1">Contact:</span> <span className="text-[#212529]">{formData.contactName}</span></div>
                      <div><span className="text-gray-400 block text-[10px] font-medium uppercase tracking-widest mb-1">Business Email:</span> <span className="text-[#212529]">{formData.email}</span></div>
                      <div><span className="text-gray-400 block text-[10px] font-medium uppercase tracking-widest mb-1">Destination:</span> <span className="text-[#212529]">{formData.country || "N/A"}</span></div>
                      <div><span className="text-gray-400 block text-[10px] font-medium uppercase tracking-widest mb-1">Product:</span> <span className="text-[#212529]">{formData.productType}</span></div>
                      <div><span className="text-gray-400 block text-[10px] font-medium uppercase tracking-widest mb-1">Quantity:</span> <span className="text-[#212529]">{formData.quantity} pcs</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 bg-[#f8f9fa] text-gray-600 px-6 py-3 hover:bg-gray-200 transition-colors text-[10px] uppercase font-medium tracking-widest"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-[#212529] text-white hover:bg-[#d12026] px-8 py-3 transition-colors text-[10px] uppercase font-medium tracking-widest ml-auto"
                  >
                    Next Step <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-[#212529] text-white hover:bg-[#d12026] disabled:opacity-50 px-8 py-3 transition-colors text-[10px] uppercase font-medium tracking-widest ml-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing
                      </>
                    ) : (
                      <>
                        Submit RFQ <CheckCircle className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

