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
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 space-y-12">
      {/* Intro Banner */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#d4a574]/10 border border-[#d4a574]/30 px-3 py-1 rounded-full text-[10px] font-bold text-[#d4a574] uppercase tracking-wider">
          📞 Direct B2B Communication
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
          Contact Our Global Sourcing Desk
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Connect with direct RMG manufacturers. Whether you require samples, auditing certifications, or specific fabric custom blends, our Dhaka office is standing by.
        </p>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Left Column: Office Contacts Card info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#081a33]/40 border border-[#0f2545]/60 rounded-3xl p-6 md:p-8 space-y-8">
            <h3 className="text-white font-heading font-extrabold text-lg border-b border-[#0f2545]/50 pb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#d4a574]" /> Headquarters & Merchandising Office
            </h3>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#0b2545]/50 border border-[#0f2545] text-[#d4a574] mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs md:text-sm space-y-1">
                  <h4 className="font-extrabold text-white">Office Address</h4>
                  <p className="text-slate-300 leading-relaxed">
                    House #12, Road #04, Sector #03,<br />
                    Uttara Model Town, Dhaka-1230,<br />
                    Bangladesh.
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#0b2545]/50 border border-[#0f2545] text-[#d4a574] mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-xs md:text-sm space-y-1">
                  <h4 className="font-extrabold text-white">Business Hours</h4>
                  <p className="text-slate-300">
                    Saturday – Thursday:<br />
                    9:00 AM – 6:00 PM (GMT +6)
                  </p>
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#0b2545]/50 border border-[#0f2545] text-[#d4a574] mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-xs md:text-sm space-y-1">
                  <h4 className="font-extrabold text-white">Phone Support</h4>
                  <p className="text-slate-300 font-medium">
                    Office Desk: +880-2-8959281<br />
                    Mobile / WhatsApp: +880-1713-038234
                  </p>
                </div>
              </div>

              {/* Direct Emails */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#0b2545]/50 border border-[#0f2545] text-[#d4a574] mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-xs md:text-sm space-y-1">
                  <h4 className="font-extrabold text-white">Email Addresses</h4>
                  <p className="text-slate-300 font-semibold font-mono">
                    General: info@texasiabd.com<br />
                    Procurement: sourcing@texasiabd.com<br />
                    Careers: hr@texasiabd.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-3 bg-[#081a33]/20 border border-[#0f2545]/50 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-[#d4a574]/5 via-transparent to-transparent pointer-events-none -z-10" />

          {submitSuccess ? (
            <div className="text-center py-12 space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white font-heading">
                Message Sent Successfully!
              </h3>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Thank you for contacting Texasia International. Your inquiry has been forwarded to our support team and you will receive a response shortly.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="bg-[#d4a574] text-[#040d1a] font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#c39463] cursor-pointer transition-premium mt-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="border-b border-[#0f2545]/30 pb-4">
                <h3 className="text-white font-heading font-extrabold text-base">Inquiry Form</h3>
                <p className="text-slate-400 text-[11px]">Fill out the details below and we will route it to the appropriate division.</p>
              </div>

              {submitError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-2 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Sarah Jenkins"
                      className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                      required
                    />
                  </div>
                </div>

                {/* Email address */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="sourcing@brand.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 012-3456"
                      className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                    />
                  </div>
                </div>

                {/* Subject type */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    Inquiry Subject
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4a574]" />
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-[#d4a574] cursor-pointer appearance-none transition-premium"
                    >
                      <option value="General Inquiry" className="bg-[#040d1a]">General Sourcing Inquiry</option>
                      <option value="Sample Request" className="bg-[#040d1a]">Custom Sample Request</option>
                      <option value="Audit Certification" className="bg-[#040d1a]">Auditing & Factory Compliance</option>
                      <option value="Partnership Sourcing" className="bg-[#040d1a]">Strategic Supply Partnership</option>
                      <option value="Feedback" className="bg-[#040d1a]">Website Feedback</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  Detailed Message <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-4.5 w-4 h-4 text-slate-500" />
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your manufacturing, auditing, or support needs in detail..."
                    className="w-full pl-10 pr-4 py-3 bg-[#040d1a]/50 border border-[#0f2545] rounded-xl text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4a574] transition-premium"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#d4a574] text-[#040d1a] hover:bg-[#c39463] disabled:opacity-50 py-3.5 rounded-xl cursor-pointer transition-premium text-xs md:text-sm font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing Transmission...
                  </>
                ) : (
                  <>
                    Transmit Inquiry Message <Send className="w-4 h-4" />
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

