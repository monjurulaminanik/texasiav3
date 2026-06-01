import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET: Fetch all contact messages (Admin protected)
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Fetch contacts error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Public submission of contact form
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, honeypot } = body;

    // Honeypot spam blocker
    if (honeypot) {
      console.warn("Contact spam submission blocked.");
      return NextResponse.json({ success: true, message: "Message received" });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject: subject || "General Sourcing Inquiry",
        message,
        status: "new",
      },
    });

    // Try sending alert email if SMTP is configured
    try {
      const settings = await prisma.siteSettings.findUnique({
        where: { id: "507f1f77bcf86cd799439011" },
      });
      if (settings && settings.email && settings.smtpHost && settings.smtpUser) {
        const { sendMail } = await import("@/lib/email");
        await sendMail({
          to: settings.email,
          subject: `📩 [New Contact message] Re: ${subject || "General Sourcing Inquiry"}`,
          html: `
            <h2>New Contact Message Received</h2>
            <p><strong>Sender Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "N/A"}</p>
            <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background:#f1f5f9; padding: 12px; border-left: 4px solid #d4a574;">
              ${message.replace(/\n/g, "<br>")}
            </blockquote>
          `,
        });
      }
    } catch (emailErr) {
      console.error("Email notification failed during contact submission:", emailErr);
    }

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error("Public contact submit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update contact message status (Admin protected)
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    const contact = await prisma.contact.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Update contact error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Delete a contact message (Admin protected)
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
    }

    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete contact error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
