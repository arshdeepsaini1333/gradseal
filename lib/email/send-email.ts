import "server-only";
import nodemailer from "nodemailer";
import { Resend } from "resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;
let resendClient: Resend | null = null;

function getResendClient() {
  if (resendClient) return resendClient;

  const { RESEND_API_KEY } = process.env;
  if (!RESEND_API_KEY) return null;

  resendClient = new Resend(RESEND_API_KEY);
  return resendClient;
}

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
  const from = process.env.SMTP_FROM || "GradSeal <no-reply@gradseal.com>";

  const resend = getResendClient();
  if (resend) {
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) {
      throw new Error(`Failed to send email via Resend: ${error.message}`);
    }
    return;
  }

  const client = getTransporter();

  if (!client) {
    // No email provider configured (e.g. local development) — log instead
    // of failing so the registration flow can still be exercised end-to-end.
    console.log(`\n[email:dev] To: ${to}\n[email:dev] Subject: ${subject}\n${html}\n`);
    return;
  }

  await client.sendMail({ from, to, subject, html });
}
