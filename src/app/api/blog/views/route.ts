import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: Increment views count for a blog post dynamically via a client fetch
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    await prisma.blogPost.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Increment views error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
