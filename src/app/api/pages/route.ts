import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET: Fetch all static pages, a single page by slug, or a single page by ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    if (id) {
      let page = await prisma.page.findUnique({
        where: { id },
      });
      if (!page) {
        const product = await prisma.product.findUnique({
          where: { id },
          include: { 
            images: { orderBy: { order: "asc" } },
            category: true,
          },
        });
        if (product) {
          page = {
            id: product.id,
            slug: `products/${product.category.slug}/${product.slug}`,
            title: product.name,
            content: product.description,
            gjsHtml: product.gjsHtml,
            gjsCss: product.gjsCss,
            gjsData: product.gjsData,
            isBuilderPage: product.isBuilderPage,
            metaTitle: product.metaTitle,
            metaDesc: product.metaDesc,
            updatedAt: product.updatedAt,
            images: product.images,
            moq: product.moq,
            leadTime: product.leadTime,
            fabric: product.fabric,
            sizes: product.sizes,
            colors: product.colors,
          } as any;
        }
      }
      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }
      return NextResponse.json(page);
    }

    if (slug) {
      const page = await prisma.page.findUnique({
        where: { slug },
      });
      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }
      return NextResponse.json(page);
    }

    let pages = await prisma.page.findMany({
      orderBy: { slug: "asc" },
    });

    // Auto-create homepage static page record if missing to support GrapesJS builder editing immediately
    const hasHome = pages.some(p => p.slug === "home");
    if (!hasHome) {
      try {
        const homePage = await prisma.page.create({
          data: {
            slug: "home",
            title: "Homepage",
            content: "<p>Welcome to QSA Apparels. Customize this page visually using GrapesJS!</p>",
            metaTitle: "QSA Apparels",
            metaDesc: "Custom garment manufacturer and sourcing partner in Dhaka, Bangladesh.",
          },
        });
        pages = [homePage, ...pages];
      } catch (err) {
        console.error("Auto-create homepage record failed:", err);
      }
    }

    return NextResponse.json(pages);
  } catch (error) {
    console.error("Fetch pages error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update an existing static page (supporting standard and page-builder fields)
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
    const { title, content, metaTitle, metaDesc, gjsHtml, gjsCss, gjsData, isBuilderPage } = body;

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (content !== undefined) dataToUpdate.content = content;
    if (gjsHtml !== undefined) dataToUpdate.gjsHtml = gjsHtml;
    if (gjsCss !== undefined) dataToUpdate.gjsCss = gjsCss;
    if (gjsData !== undefined) dataToUpdate.gjsData = gjsData;
    if (isBuilderPage !== undefined) dataToUpdate.isBuilderPage = isBuilderPage;
    if (metaTitle !== undefined) dataToUpdate.metaTitle = metaTitle;
    if (metaDesc !== undefined) dataToUpdate.metaDesc = metaDesc;

    // Fallback in case we're using visual builder to ensure 'content' field is populated
    if (isBuilderPage && gjsHtml && !content) {
      dataToUpdate.content = gjsHtml;
    }

    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) {
      const product = await prisma.product.findUnique({ where: { id } });
      if (product) {
        const productUpdate = await prisma.product.update({
          where: { id },
          data: {
            gjsHtml,
            gjsCss,
            gjsData,
            isBuilderPage,
            description: content || product.description,
          },
        });
        return NextResponse.json(productUpdate);
      }
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Update page error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
