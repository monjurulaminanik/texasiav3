import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import slugify from "slugify";

// GET: Fetch a single product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: { order: "asc" } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Fetch single product error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update a single product by ID (handles image transaction swaps)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();

    const {
      name,
      categoryId,
      shortDesc,
      description,
      features,
      moq,
      leadTime,
      fabric,
      sizes,
      colors,
      metaTitle,
      metaDesc,
      isFeatured,
      isActive,
      images, // If provided, swap/recreate product images
    } = body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const dataToUpdate: any = {};
    if (name !== undefined) {
      dataToUpdate.name = name;
      dataToUpdate.slug = slugify(name, { lower: true, strict: true });
    }
    if (categoryId !== undefined) dataToUpdate.categoryId = categoryId;
    if (shortDesc !== undefined) dataToUpdate.shortDesc = shortDesc;
    if (description !== undefined) dataToUpdate.description = description;
    if (moq !== undefined) dataToUpdate.moq = moq;
    if (leadTime !== undefined) dataToUpdate.leadTime = leadTime;
    if (fabric !== undefined) dataToUpdate.fabric = fabric;
    if (sizes !== undefined) dataToUpdate.sizes = sizes;
    if (colors !== undefined) dataToUpdate.colors = colors;
    if (metaTitle !== undefined) dataToUpdate.metaTitle = metaTitle;
    if (metaDesc !== undefined) dataToUpdate.metaDesc = metaDesc;
    if (isFeatured !== undefined) dataToUpdate.isFeatured = isFeatured;
    if (isActive !== undefined) dataToUpdate.isActive = isActive;

    if (features !== undefined) {
      dataToUpdate.features = Array.isArray(features)
        ? JSON.stringify(features)
        : typeof features === "string"
        ? features
        : "[]";
    }

    // Wrap in a database transaction to safely swap images
    const product = await prisma.$transaction(async (tx) => {
      // If new images array is supplied, clear old ones and re-create them
      if (images !== undefined) {
        await tx.productImage.deleteMany({
          where: { productId: id },
        });

        await tx.productImage.createMany({
          data: images.map((img: any, idx: number) => {
            const url = typeof img === "string" ? img : img.url;
            const alt = typeof img === "string" ? `${name || existingProduct.name} - Image ${idx + 1}` : img.alt;
            const order = typeof img === "string" ? idx : img.order;
            return { productId: id, url, alt, order };
          }),
        });
      }

      return tx.product.update({
        where: { id },
        data: dataToUpdate,
        include: {
          images: { orderBy: { order: "asc" } },
        },
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Delete a single product by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Cascade delete on ProductImage is defined in the schema
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
