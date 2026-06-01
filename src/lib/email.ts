import nodemailer from "nodemailer";
import prisma from "./prisma";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  // Always query active SMTP settings dynamically from singleton settings
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!settings || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) {
    console.warn("SMTP settings are incomplete. Skipping email transmission.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort || 587,
    secure: (settings.smtpPort || 587) === 465, // true for 465, false for others
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPass,
    },
  });

  const mailOptions = {
    from: `"${settings.smtpFromName || settings.siteName}" <${settings.smtpFromAddr || settings.email}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Nodemailer transmission failure:", error);
    throw error;
  }
}

export async function sendTestEmail(targetEmail: string) {
  return sendMail({
    to: targetEmail,
    subject: "Texasia CMS — SMTP Configuration test success!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background:#f8fafc;">
        <h2 style="color: #0b2545; font-size: 20px; border-bottom: 2px solid #d4a574; padding-bottom: 8px;">SMTP Test Success</h2>
        <p>This is a verification email from your Texasia International administrative control panel.</p>
        <p>Your SMTP mail configuration is fully functional and ready to deliver real-time RFQs and contact message alerts.</p>
        <div style="margin-top: 24px; font-size: 11px; color: #64748b;">
          This is an automated system email. Please do not reply directly.
        </div>
      </div>
    `,
  });
}
