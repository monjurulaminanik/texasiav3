import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import slugify from "slugify";

// GET: Fetch all blog posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublished = searchParams.get("isPublished");

    const where: any = {};
    if (isPublished !== null) {
      where.isPublished = isPublished === "true";
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Fetch blog posts error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a new blog post
export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, excerpt, content, coverImage, tags, metaTitle, metaDesc, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const slug = slugify(title, { lower: true, strict: true });

    // Check if slug is unique
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({ error: "A post with a similar title already exists" }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        authorId: session.user?.id as string,
        tags,
        metaTitle: metaTitle || `${title} | QSA Apparels Insights`,
        metaDesc: metaDesc || excerpt || `Read our latest insight regarding ${title}`,
        isPublished: isPublished !== undefined ? isPublished : false,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Create blog post error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update an existing blog post
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { title, excerpt, content, coverImage, tags, metaTitle, metaDesc, isPublished } = body;

    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const dataToUpdate: any = {};
    if (title !== undefined) {
      dataToUpdate.title = title;
      dataToUpdate.slug = slugify(title, { lower: true, strict: true });
    }
    if (excerpt !== undefined) dataToUpdate.excerpt = excerpt;
    if (content !== undefined) dataToUpdate.content = content;
    if (coverImage !== undefined) dataToUpdate.coverImage = coverImage;
    if (tags !== undefined) dataToUpdate.tags = tags;
    if (metaTitle !== undefined) dataToUpdate.metaTitle = metaTitle;
    if (metaDesc !== undefined) dataToUpdate.metaDesc = metaDesc;

    if (isPublished !== undefined) {
      dataToUpdate.isPublished = isPublished;
      // If toggled from draft to published, set publishedAt date
      if (isPublished && !existingPost.isPublished) {
        dataToUpdate.publishedAt = new Date();
      } else if (!isPublished) {
        dataToUpdate.publishedAt = null;
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Update blog post error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Delete an existing blog post
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete blog post error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
