import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET: Fetch all active/inactive FAQs
export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Fetch faqs error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a new FAQ
export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { question, answer, category, order, isActive } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category: category || "General",
        order: Number(order) || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.error("Create faq error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update an existing FAQ
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "FAQ ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { question, answer, category, order, isActive } = body;

    const dataToUpdate: any = {};
    if (question !== undefined) dataToUpdate.question = question;
    if (answer !== undefined) dataToUpdate.answer = answer;
    if (category !== undefined) dataToUpdate.category = category;
    if (order !== undefined) dataToUpdate.order = Number(order);
    if (isActive !== undefined) dataToUpdate.isActive = isActive;

    const faq = await prisma.fAQ.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.error("Update faq error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Delete an existing FAQ
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "FAQ ID is required" }, { status: 400 });
    }

    await prisma.fAQ.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete faq error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
