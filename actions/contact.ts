"use server";

import { sendEmail } from "@/lib/email/send-email";
import {
  contactNotificationEmail,
  contactConfirmationEmail,
  newsletterConfirmationEmail,
} from "@/lib/email/templates/contact-email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { contactFormSchema, newsletterSchema } from "@/lib/validations/contact";

const SUPPORT_EMAIL = process.env.CONTACT_EMAIL_TO || "support@gradseal.com";

export type ContactFormState =
  | {
      success?: boolean;
      message?: string;
      errors?: Record<string, string[]>;
    }
  | undefined;

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const ip = await getClientIp();
  const limit = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      message: `Too many messages sent. Please try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const validated = contactFormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    courseInterest: formData.get("courseInterest"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    agreeToPolicy: formData.get("agreeToPolicy"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = validated.data;

  const notification = contactNotificationEmail({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone || undefined,
    courseInterest: data.courseInterest,
    subject: data.subject,
    message: data.message,
  });
  await sendEmail({ to: SUPPORT_EMAIL, subject: notification.subject, html: notification.html });

  const confirmation = contactConfirmationEmail({ firstName: data.firstName });
  await sendEmail({ to: data.email, subject: confirmation.subject, html: confirmation.html });

  return { success: true, message: "Your message has been sent. We'll be in touch soon!" };
}

export type NewsletterFormState =
  | { success?: boolean; message?: string; errors?: Record<string, string[]> }
  | undefined;

export async function subscribeNewsletter(
  _prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const ip = await getClientIp();
  const limit = rateLimit(`newsletter:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.success) {
    return { message: "Too many attempts. Please try again later." };
  }

  const validated = newsletterSchema.safeParse({ email: formData.get("email") });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { subject, html } = newsletterConfirmationEmail();
  await sendEmail({ to: validated.data.email, subject, html });

  return { success: true, message: "You're subscribed! Check your inbox for confirmation." };
}
