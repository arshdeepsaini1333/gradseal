"use server";

import { revalidatePath } from "next/cache";

import { getStudentSession } from "@/lib/auth/session";
import { createSupportTicket } from "@/lib/support";
import { sendEmail } from "@/lib/email/send-email";
import { supportRequestEmail, supportConfirmationEmail } from "@/lib/email/templates/support-email";
import { rateLimit } from "@/lib/rate-limit";
import { supportRequestSchema } from "@/lib/validations/support";

const SUPPORT_NOTIFY_EMAIL = process.env.SUPPORT_NOTIFY_EMAIL || "arsh@bldsindia.com";

export type SupportRequestState =
  | { success?: boolean; message?: string; errors?: Record<string, string[]> }
  | undefined;

export async function submitSupportRequest(
  _prevState: SupportRequestState,
  formData: FormData
): Promise<SupportRequestState> {
  const session = await getStudentSession();
  if (!session) {
    return { message: "Please log in again and retry." };
  }

  const limit = rateLimit(`support:${session.id}`, 5, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      message: `Too many messages sent. Please try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const validated = supportRequestSchema.safeParse({
    subject: formData.get("subject"),
    orderId: formData.get("orderId"),
    message: formData.get("message"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = validated.data;
  const studentName = `${session.firstName} ${session.lastName}`;

  await createSupportTicket({
    studentId: session.id,
    subject: data.subject,
    orderId: data.orderId || null,
    message: data.message,
  });

  const notification = supportRequestEmail({
    studentName,
    studentEmail: session.email,
    subject: data.subject,
    orderId: data.orderId || null,
    message: data.message,
  });
  await sendEmail({ to: SUPPORT_NOTIFY_EMAIL, subject: notification.subject, html: notification.html });

  const confirmation = supportConfirmationEmail({ firstName: session.firstName });
  await sendEmail({ to: session.email, subject: confirmation.subject, html: confirmation.html });

  revalidatePath("/admin/notifications");

  return { success: true, message: "Your message has been sent. We'll be in touch soon!" };
}
