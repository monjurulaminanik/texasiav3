import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} />;
}
