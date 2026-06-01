import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import slugify from "slugify";

// GET: Fetch all active/inactive categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { order: "asc" },
      include: {
        children: {
          orderBy: { order: "asc" },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a new category
export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, heroImage, metaTitle, metaDesc, order, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug is unique
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({ error: "A category with a similar name already exists" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        heroImage,
        metaTitle: metaTitle || `${name} Manufacturer Bangladesh`,
        metaDesc: metaDesc || `Order wholesale custom ${name} from certified RMG partner.`,
        order: Number(order) || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update an existing category
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, heroImage, metaTitle, metaDesc, order, isActive } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) {
      dataToUpdate.name = name;
      dataToUpdate.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) dataToUpdate.description = description;
    if (heroImage !== undefined) dataToUpdate.heroImage = heroImage;
    if (metaTitle !== undefined) dataToUpdate.metaTitle = metaTitle;
    if (metaDesc !== undefined) dataToUpdate.metaDesc = metaDesc;
    if (order !== undefined) dataToUpdate.order = Number(order);
    if (isActive !== undefined) dataToUpdate.isActive = isActive;

    const category = await prisma.category.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Delete an existing category
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // Check if category has dependent products
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category containing active products. Reassign products first." },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
