export const dynamic = 'force-dynamic'

import React from "react";
import ProductForm from "@/components/admin/ProductForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  return <ProductForm />;
}

