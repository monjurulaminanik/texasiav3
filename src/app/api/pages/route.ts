import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET: Fetch all static pages or a single page by slug
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const page = await prisma.page.findUnique({
        where: { slug },
      });
      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }
      return NextResponse.json(page);
    }

    const pages = await prisma.page.findMany({
      orderBy: { slug: "asc" },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Fetch pages error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update an existing static page
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { title, content, metaTitle, metaDesc } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        title,
        content,
        metaTitle: metaTitle || `${title} | Texasia International`,
        metaDesc: metaDesc || `Learn about our ${title.toLowerCase()} details.`,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Update page error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
