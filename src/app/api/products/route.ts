import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import slugify from "slugify";

// GET: Fetch all products with search, category filtering, and images included
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const isFeatured = searchParams.get("isFeatured");
    const search = searchParams.get("search");

    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (isFeatured !== null) {
      where.isFeatured = isFeatured === "true";
    }
    if (search) {
      where.name = {
        contains: search,
      };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a new product (handles relation images automatically)
export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      categoryId,
      shortDesc,
      description,
      features, // JSON string or array
      moq,
      leadTime,
      fabric,
      sizes,
      colors,
      metaTitle,
      metaDesc,
      isFeatured,
      isActive,
      images = [], // Array of string image URLs or { url, alt, order }
    } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: "Product name and category are required" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug is unique
    const existing = await prisma.product.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({ error: "A product with a similar name already exists" }, { status: 400 });
    }

    // Format features as a JSON-serialized string if it's passed as an array
    const featuresStr = Array.isArray(features)
      ? JSON.stringify(features)
      : typeof features === "string"
      ? features
      : "[]";

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        shortDesc,
        description,
        features: featuresStr,
        moq,
        leadTime,
        fabric,
        sizes,
        colors,
        metaTitle: metaTitle || `${name} Custom Garment Manufacturer`,
        metaDesc: metaDesc || shortDesc || `Order wholesale ${name} in bulk.`,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        isActive: isActive !== undefined ? isActive : true,
        images: {
          create: images.map((img: any, idx: number) => {
            const url = typeof img === "string" ? img : img.url;
            const alt = typeof img === "string" ? `${name} - Image ${idx + 1}` : img.alt;
            const order = typeof img === "string" ? idx : img.order;
            return { url, alt, order };
          }),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
