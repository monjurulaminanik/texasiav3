import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET: Fetch all RFQ inquiries (Admin protected)
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rfqs = await prisma.rFQ.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rfqs);
  } catch (error) {
    console.error("Fetch rfqs error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Public submission of a new RFQ (includes honeypot validation)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companyName,
      contactName,
      email,
      phone,
      country,
      productType,
      quantity,
      targetPrice,
      message,
      honeypot, // Honeypot spam prevention
    } = body;

    // Honeypot spam detection
    if (honeypot) {
      console.warn("Spam submission blocked via honeypot.");
      return NextResponse.json({ success: true, message: "Request received" });
    }

    if (!companyName || !contactName || !email || !message) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const rfq = await prisma.rFQ.create({
      data: {
        companyName,
        contactName,
        email,
        phone,
        country,
        productType,
        quantity,
        targetPrice,
        message,
        status: "new",
      },
    });

    // Try sending notification email if settings have SMTP configured
    try {
      const settings = await prisma.siteSettings.findUnique({
        where: { id: "507f1f77bcf86cd799439011" },
      });
      if (settings && settings.email && settings.smtpHost && settings.smtpUser) {
        // Dynamic importing email helper to avoid bundle size issues
        const { sendMail } = await import("@/lib/email");
        await sendMail({
          to: settings.email,
          subject: `🚨 [New RFQ Alert] Sourcing Request from ${companyName}`,
          html: `
            <h2>New Sourcing RFQ Submitted</h2>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Contact:</strong> ${contactName} (${email})</p>
            <p><strong>Country:</strong> ${country || "N/A"}</p>
            <p><strong>Product Type:</strong> ${productType || "Garment"}</p>
            <p><strong>Quantity:</strong> ${quantity || "N/A"}</p>
            <p><strong>Target Price:</strong> ${targetPrice || "N/A"}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background:#f1f5f9; padding: 12px; border-left: 4px solid #d4a574;">
              ${message.replace(/\n/g, "<br>")}
            </blockquote>
          `,
        });
      }
    } catch (emailErr) {
      console.error("Email notification failed during RFQ submission:", emailErr);
    }

    return NextResponse.json({ success: true, rfq });
  } catch (error) {
    console.error("Public create RFQ error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update RFQ status and internal staff notes (Admin protected)
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "RFQ ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { status, notes } = body;

    const dataToUpdate: any = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (notes !== undefined) dataToUpdate.notes = notes;

    const rfq = await prisma.rFQ.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(rfq);
  } catch (error) {
    console.error("Update RFQ error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
