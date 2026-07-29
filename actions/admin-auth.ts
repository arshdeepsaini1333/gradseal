"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createAdminSession, destroyAdminSession } from "@/lib/auth/admin-session";
import { issueAdminOtp, checkAdminOtp } from "@/lib/auth/admin-otp-service";
import { checkResendCooldown } from "@/lib/auth/otp-service";
import { OTP_EXPIRY_MINUTES } from "@/lib/auth/otp";
import { sendEmail } from "@/lib/email/send-email";
import { loginOtpEmailTemplate } from "@/lib/email/templates/otp-email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { adminLoginSchema } from "@/lib/validations/admin-login";

const otpCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, { error: "Enter the 6-digit code" });

// ---------------------------------------------------------------------------
// Login, step 1: password
// ---------------------------------------------------------------------------

export type AdminLoginFormState = { error?: string } | undefined;

const GENERIC_LOGIN_ERROR = "Invalid email or password.";

export async function loginAdmin(
  _prevState: AdminLoginFormState,
  formData: FormData
): Promise<AdminLoginFormState> {
  const ip = await getClientIp();
  const limit = rateLimit(`admin-login:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      error: `Too many login attempts. Please try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const validated = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validated.success) {
    return { error: GENERIC_LOGIN_ERROR };
  }
  const { email, password } = validated.data;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return { error: GENERIC_LOGIN_ERROR };
  }

  const passwordMatches = await verifyPassword(password, admin.password);
  if (!passwordMatches) {
    return { error: GENERIC_LOGIN_ERROR };
  }

  if (!admin.isActive) {
    return { error: "This admin account has been deactivated." };
  }

  const otp = await issueAdminOtp(admin.id);
  const { subject, html } = loginOtpEmailTemplate({
    firstName: admin.fullName,
    otp,
    expiryMinutes: OTP_EXPIRY_MINUTES,
  });
  await sendEmail({ to: admin.email, subject, html });

  redirect(`/admin/verify-login-otp?email=${encodeURIComponent(admin.email)}`);
}

// ---------------------------------------------------------------------------
// Login, step 2: email OTP
// ---------------------------------------------------------------------------

export type AdminOtpFormState = { error?: string } | undefined;
export type AdminResendOtpState =
  | { error?: string; message?: string; cooldownSeconds?: number }
  | undefined;

export async function verifyAdminLoginOtp(
  email: string,
  _prevState: AdminOtpFormState,
  formData: FormData
): Promise<AdminOtpFormState> {
  const ip = await getClientIp();
  const limit = rateLimit(`admin-verify-login-otp:${ip}`, 15, 15 * 60 * 1000);
  if (!limit.success) {
    return { error: "Too many attempts. Please try again later." };
  }

  const parsed = otpCodeSchema.safeParse(formData.get("otp"));
  if (!parsed.success) {
    return { error: "Enter the 6-digit code" };
  }
  const otp = parsed.data;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !admin.isActive) {
    return { error: "Account not found. Please log in again." };
  }

  const result = await checkAdminOtp(admin, otp);
  if (!result.ok) {
    return { error: result.error };
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { emailOtp: null, otpExpiresAt: null, otpAttempts: 0 },
  });

  await createAdminSession(admin.id);
  redirect("/admin/dashboard");
}

export async function resendAdminLoginOtp(email: string): Promise<AdminResendOtpState> {
  const ip = await getClientIp();
  const limit = rateLimit(`admin-resend-login-otp:${ip}:${email}`, 5, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      error: `Too many resend requests. Try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !admin.isActive) {
    return { error: "Account not found. Please log in again." };
  }

  const cooldown = checkResendCooldown(admin.lastOtpSentAt);
  if (!cooldown.ok) {
    return { error: cooldown.error, cooldownSeconds: cooldown.cooldownSeconds };
  }

  const otp = await issueAdminOtp(admin.id);
  const { subject, html } = loginOtpEmailTemplate({
    firstName: admin.fullName,
    otp,
    expiryMinutes: OTP_EXPIRY_MINUTES,
  });
  await sendEmail({ to: admin.email, subject, html });

  return { message: "A new verification code has been sent to your email." };
}

export async function logoutAdmin(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}
