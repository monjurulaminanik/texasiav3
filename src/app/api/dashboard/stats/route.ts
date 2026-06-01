import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newRfqsCount = await prisma.rFQ.count({
      where: { status: "new" },
    });

    const newContactsCount = await prisma.contact.count({
      where: { status: "new" },
    });

    const totalProducts = await prisma.product.count({
      where: { isActive: true },
    });

    const totalBlogs = await prisma.blogPost.count({
      where: { isPublished: true },
    });

    return NextResponse.json({
      newRfqsCount,
      newContactsCount,
      totalProducts,
      totalBlogs,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
