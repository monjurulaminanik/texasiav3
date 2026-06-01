"use client";

import React from "react";
import QueryProvider from "./QueryProvider";
import ToastProvider from "./ToastProvider";
import SessionProvider from "./SessionProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
        <ToastProvider />
      </QueryProvider>
    </SessionProvider>
  );
}
