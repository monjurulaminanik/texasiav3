import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET: Fetch global settings (Publicly accessible for website header/footer info)
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "507f1f77bcf86cd799439011" },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update global settings or send test email (Admin protected)
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, testEmail, ...dataToUpdate } = body;

    // Handle "Send Test Email" request
    if (action === "test_email") {
      if (!testEmail) {
        return NextResponse.json({ error: "Target email address is required" }, { status: 400 });
      }

      // Check if SMTP is fully configured in database
      const { sendTestEmail } = await import("@/lib/email");
      await sendTestEmail(testEmail);
      return NextResponse.json({ success: true, message: "Test email transmitted successfully!" });
    }

    // Cast Port to number if provided
    if (dataToUpdate.smtpPort !== undefined) {
      dataToUpdate.smtpPort = Number(dataToUpdate.smtpPort) || 587;
    }

    const settings = await prisma.siteSettings.update({
      where: { id: "507f1f77bcf86cd799439011" },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
