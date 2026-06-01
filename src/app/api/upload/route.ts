import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "products"; // products | blog | pages

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 5MB size limit" }, { status: 400 });
    }

    // Validate type (images only)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save folder path
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    
    // Create folders recursively if they don't exist
    await fs.mkdir(uploadDir, { recursive: true });

    // Build unique filename
    const fileExt = path.extname(file.name) || ".jpg";
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${folder}/${uniqueFilename}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
