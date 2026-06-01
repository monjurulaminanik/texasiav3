import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import BlogForm from "@/components/admin/BlogForm";

interface EditBlogPageProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  return <BlogForm initialData={post} />;
}
