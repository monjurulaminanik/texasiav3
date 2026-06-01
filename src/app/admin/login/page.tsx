"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";

const loginSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.success("Successfully logged in!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#040d1a] relative overflow-hidden px-4">
      {/* Decorative modern glass background elements */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#0b2545]/20 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#d4a574]/10 blur-[120px]" />

      <div className="w-full max-w-md bg-[#081a33]/60 backdrop-blur-xl border border-[#0f2545] rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-tr from-[#0b2545] to-[#d4a574] p-[1px] mb-4">
            <div className="w-full h-full bg-[#081a33] rounded-[11px] flex items-center justify-center">
              <span className="text-[#d4a574] text-2xl font-bold font-heading">TX</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-tight">
            Texasia CMS
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Access your administrative control panel
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                {...register("email")}
                type="email"
                placeholder="admin@texasia.local"
                className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] focus:ring-1 focus:ring-[#d4a574] transition-premium"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-[#040d1a]/80 border border-[#0f2545] rounded-xl py-3 pl-10 pr-10 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4a574] focus:ring-1 focus:ring-[#d4a574] transition-premium"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] font-semibold rounded-xl py-3 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[#d4a574]/20 transition-premium disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500">
            For support contact admin@texasiafashion.com
          </p>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[#040d1a] relative overflow-hidden px-4">
          <Loader2 className="w-8 h-8 text-[#d4a574] animate-spin" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

