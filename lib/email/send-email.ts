import "server-only";
import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  return transporter;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const client = getTransporter();

  if (!client) {
    // No SMTP configured (e.g. local development) — log instead of failing
    // so the registration flow can still be exercised end-to-end.
    console.log(`\n[email:dev] To: ${to}\n[email:dev] Subject: ${subject}\n${html}\n`);
    return;
  }

  await client.sendMail({
    from: process.env.SMTP_FROM || "GradSeal <no-reply@gradseal.com>",
    to,
    subject,
    html,
  });
}
