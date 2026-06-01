import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import slugify from "slugify";

// GET: Fetch all active/inactive job openings
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Fetch jobs error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a new job opening
export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, department, location, type, description, requirements, isActive } = body;

    if (!title || !description || !requirements) {
      return NextResponse.json({ error: "Title, description, and requirements are required" }, { status: 400 });
    }

    const slug = slugify(title, { lower: true, strict: true });

    // Check if slug is unique
    const existing = await prisma.job.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({ error: "A job opening with a similar title already exists" }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        slug,
        department,
        location,
        type,
        description,
        requirements,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update an existing job opening
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { title, department, location, type, description, requirements, isActive } = body;

    const dataToUpdate: any = {};
    if (title !== undefined) {
      dataToUpdate.title = title;
      dataToUpdate.slug = slugify(title, { lower: true, strict: true });
    }
    if (department !== undefined) dataToUpdate.department = department;
    if (location !== undefined) dataToUpdate.location = location;
    if (type !== undefined) dataToUpdate.type = type;
    if (description !== undefined) dataToUpdate.description = description;
    if (requirements !== undefined) dataToUpdate.requirements = requirements;
    if (isActive !== undefined) dataToUpdate.isActive = isActive;

    const job = await prisma.job.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Delete an existing job opening
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
