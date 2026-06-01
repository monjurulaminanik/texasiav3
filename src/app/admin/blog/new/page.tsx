export const dynamic = 'force-dynamic'

import React from "react";
import BlogForm from "@/components/admin/BlogForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewBlogPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  return <BlogForm />;
}

