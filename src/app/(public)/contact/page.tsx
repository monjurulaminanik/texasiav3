"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  User,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Clock,
  Globe
} from "lucide-react";

export default function PublicContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
    honeypot: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitError("Please fill out all required fields (Name, Email, Message).");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit. Please try again.");
      }

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
        honeypot: "",
      });
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Failed to send message. Please check connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-40 pb-20">
      {/* SECTION 1: HERO CONTAINER (Centro Minimalist) */}
      <section className="relative max-w-[95%] mx-auto px-6 border-b border-gray-100 pb-16 mb-16">
        <h1 className="text-3xl md:text-5xl font-light text-[#212529] font-heading tracking-[0.2em] uppercase text-center mb-6">
          CONTACT US
        </h1>
        <p className="text-gray-500 text-sm text-center max-w-2xl mx-auto font-light leading-[1.8]">
          Connect with direct RMG manufacturers. Whether you require samples, auditing certifications, or specific fabric custom blends, our Dhaka office is standing by.
        </p>
      </section>

      {/* Main Grid Content */}
      <div className="max-w-[95%] mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
        {/* Left Column: Office Contacts Card info */}
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-8">
            <h3 className="text-[#212529] font-heading font-light tracking-[0.1em] text-lg uppercase border-b border-gray-100 pb-4">
              Headquarters
            </h3>

            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start gap-4">
                <MapPin className="w-4 h-4 text-[#d12026] mt-1 shrink-0" />
                <div className="space-y-1 text-xs md:text-sm">
                  <h4 className="font-medium text-[#212529] uppercase tracking-widest text-[10px]">Office Address</h4>
                  <p className="text-gray-500 font-light leading-[1.8]">
                    House #12, Road #04, Sector #03,<br />
                    Uttara Model Town, Dhaka-1230,<br />
                    Bangladesh.
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <Clock className="w-4 h-4 text-[#d12026] mt-1 shrink-0" />
                <div className="space-y-1 text-xs md:text-sm">
                  <h4 className="font-medium text-[#212529] uppercase tracking-widest text-[10px]">Business Hours</h4>
                  <p className="text-gray-500 font-light leading-[1.8]">
                    Saturday – Thursday:<br />
                    9:00 AM – 6:00 PM (GMT +6)
                  </p>
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-4">
                <Phone className="w-4 h-4 text-[#d12026] mt-1 shrink-0" />
                <div className="space-y-1 text-xs md:text-sm">
                  <h4 className="font-medium text-[#212529] uppercase tracking-widest text-[10px]">Phone</h4>
                  <p className="text-gray-500 font-light leading-[1.8]">
                    Office Desk: +880-2-8959281<br />
                    Mobile: +880-1713-038234
                  </p>
                </div>
              </div>

              {/* Direct Emails */}
              <div className="flex items-start gap-4">
                <Mail className="w-4 h-4 text-[#d12026] mt-1 shrink-0" />
                <div className="space-y-1 text-xs md:text-sm">
                  <h4 className="font-medium text-[#212529] uppercase tracking-widest text-[10px]">Email</h4>
                  <p className="text-gray-500 font-light leading-[1.8]">
                    General: info@qsaapparels.com<br />
                    Procurement: sourcing@qsaapparels.com<br />
                    Careers: hr@qsaapparels.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-3 bg-[#f8f9fa] p-8 md:p-12">
          {submitSuccess ? (
            <div className="text-center py-16 space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-light text-[#212529] font-heading tracking-[0.1em] uppercase">
                Message Sent
              </h3>
              <p className="text-gray-500 text-sm font-light leading-[1.8]">
                Thank you for contacting QSA Apparels. Your inquiry has been forwarded to our support team and you will receive a response shortly.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="bg-[#212529] text-white font-medium text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-[#d12026] transition-colors mt-8"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Honeypot field for anti-spam */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                className="absolute opacity-0 pointer-events-none -z-50"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-[#212529] font-heading font-light tracking-[0.1em] text-lg uppercase">Inquiry Form</h3>
                <p className="text-gray-500 font-light text-xs mt-2">Fill out the details below and we will route it to the appropriate division.</p>
              </div>

              {submitError && (
                <div className="bg-red-50 text-red-500 p-4 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full name */}
                <div className="space-y-3">
                  <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest block">
                    Your Name <span className="text-[#d12026]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 bg-white border border-gray-200 text-sm text-[#212529] placeholder-gray-300 focus:outline-none focus:border-[#d12026] transition-colors font-light"
                    required
                  />
                </div>

                {/* Email address */}
                <div className="space-y-3">
                  <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest block">
                    Email Address <span className="text-[#d12026]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 bg-white border border-gray-200 text-sm text-[#212529] placeholder-gray-300 focus:outline-none focus:border-[#d12026] transition-colors font-light"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-3">
                  <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 012-3456"
                    className="w-full px-4 py-3 bg-white border border-gray-200 text-sm text-[#212529] placeholder-gray-300 focus:outline-none focus:border-[#d12026] transition-colors font-light"
                  />
                </div>

                {/* Subject type */}
                <div className="space-y-3">
                  <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest block">
                    Inquiry Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 text-sm text-[#212529] focus:outline-none focus:border-[#d12026] cursor-pointer transition-colors font-light"
                  >
                    <option value="General Inquiry">General Sourcing Inquiry</option>
                    <option value="Sample Request">Custom Sample Request</option>
                    <option value="Audit Certification">Auditing & Factory Compliance</option>
                    <option value="Partnership Sourcing">Strategic Supply Partnership</option>
                    <option value="Feedback">Website Feedback</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-3">
                <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest block">
                  Detailed Message <span className="text-[#d12026]">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your manufacturing, auditing, or support needs in detail..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 text-sm text-[#212529] placeholder-gray-300 focus:outline-none focus:border-[#d12026] transition-colors font-light resize-none"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-[#212529] text-white hover:bg-[#d12026] disabled:opacity-50 py-4 transition-colors text-[11px] font-medium tracking-[0.2em] uppercase mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

