"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { OTP_EXPIRY_MINUTES } from "@/lib/auth/otp";
import { issueOtp, checkOtp, checkResendCooldown } from "@/lib/auth/otp-service";
import { sendEmail } from "@/lib/email/send-email";
import { resetPasswordOtpEmailTemplate } from "@/lib/email/templates/otp-email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { forgotPasswordEmailSchema, resetPasswordSchema } from "@/lib/validations/forgot-password";

// ---------------------------------------------------------------------------
// Step 1: request an OTP for a registered email
// ---------------------------------------------------------------------------

export type RequestResetOtpState =
  | { success?: boolean; email?: string; error?: string; message?: string; cooldownSeconds?: number }
  | undefined;

export async function requestPasswordResetOtp(
  _prevState: RequestResetOtpState,
  formData: FormData
): Promise<RequestResetOtpState> {
  const ip = await getClientIp();
  const ipLimit = rateLimit(`forgot-password:${ip}`, 5, 15 * 60 * 1000);
  if (!ipLimit.success) {
    return {
      error: `Too many attempts. Please try again in ${Math.ceil(
        ipLimit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const validated = forgotPasswordEmailSchema.safeParse({ email: formData.get("email") });
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Enter a valid email address." };
  }
  const { email } = validated.data;

  const emailLimit = rateLimit(`forgot-password:${email}`, 5, 15 * 60 * 1000);
  if (!emailLimit.success) {
    return {
      error: `Too many attempts. Please try again in ${Math.ceil(
        emailLimit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const student = await prisma.student.findUnique({
    where: { email },
    select: { id: true, firstName: true, email: true, password: true, isActive: true, lastOtpSentAt: true },
  });
  if (!student) {
    return { error: "No account found with that email address." };
  }
  if (!student.isActive) {
    return { error: "Your account has been deactivated. Please contact support." };
  }
  if (!student.password) {
    return { error: "This account uses Google Sign-In. Please continue with Google to sign in." };
  }

  const cooldown = checkResendCooldown(student.lastOtpSentAt);
  if (!cooldown.ok) {
    // A code was already sent recently and is still valid — let the client
    // move to the OTP step instead of dead-ending on the email form.
    return { error: cooldown.error, cooldownSeconds: cooldown.cooldownSeconds, email: student.email };
  }

  const otp = await issueOtp(student.id);
  const { subject, html } = resetPasswordOtpEmailTemplate({
    firstName: student.firstName,
    otp,
    expiryMinutes: OTP_EXPIRY_MINUTES,
  });
  await sendEmail({ to: student.email, subject, html });

  return { success: true, email: student.email, message: "We've sent a verification code to your email." };
}

// ---------------------------------------------------------------------------
// Resend
// ---------------------------------------------------------------------------

export type ResendResetOtpState = { error?: string; message?: string; cooldownSeconds?: number } | undefined;

export async function resendPasswordResetOtp(email: string): Promise<ResendResetOtpState> {
  const ip = await getClientIp();
  const limit = rateLimit(`resend-forgot-password:${ip}:${email}`, 5, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      error: `Too many resend requests. Try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const student = await prisma.student.findUnique({
    where: { email },
    select: { id: true, firstName: true, email: true, password: true, isActive: true, lastOtpSentAt: true },
  });
  if (!student || !student.isActive || !student.password) {
    return { error: "Account not found." };
  }

  const cooldown = checkResendCooldown(student.lastOtpSentAt);
  if (!cooldown.ok) {
    return { error: cooldown.error, cooldownSeconds: cooldown.cooldownSeconds };
  }

  const otp = await issueOtp(student.id);
  const { subject, html } = resetPasswordOtpEmailTemplate({
    firstName: student.firstName,
    otp,
    expiryMinutes: OTP_EXPIRY_MINUTES,
  });
  await sendEmail({ to: student.email, subject, html });

  return { message: "A new verification code has been sent to your email." };
}

// ---------------------------------------------------------------------------
// Step 2: verify the OTP (UX gate — resetPassword() re-checks it for real)
// ---------------------------------------------------------------------------

export type VerifyResetOtpState = { success?: boolean; error?: string } | undefined;

export async function verifyPasswordResetOtp(
  email: string,
  _prevState: VerifyResetOtpState,
  formData: FormData
): Promise<VerifyResetOtpState> {
  const ip = await getClientIp();
  const limit = rateLimit(`verify-forgot-password:${ip}:${email}`, 10, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      error: `Too many attempts. Please try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const otp = formData.get("otp");
  if (typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
    return { error: "Enter the 6-digit code" };
  }

  const student = await prisma.student.findUnique({
    where: { email },
    select: { id: true, password: true, emailOtp: true, otpExpiresAt: true, otpAttempts: true },
  });
  if (!student || !student.password) {
    return { error: "Account not found." };
  }

  const result = await checkOtp(student, otp);
  if (!result.ok) {
    return { error: result.error };
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// Step 3: set the new password
// ---------------------------------------------------------------------------

export type ResetPasswordState =
  | { success?: boolean; message?: string; errors?: Record<string, string[]> }
  | undefined;

export async function resetPassword(
  email: string,
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const ip = await getClientIp();
  const limit = rateLimit(`reset-password:${ip}:${email}`, 10, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      message: `Too many attempts. Please try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const validated = resetPasswordSchema.safeParse({
    otp: formData.get("otp"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const student = await prisma.student.findUnique({
    where: { email },
    select: { id: true, password: true, emailOtp: true, otpExpiresAt: true, otpAttempts: true },
  });
  if (!student || !student.password) {
    return { message: "Account not found." };
  }

  const result = await checkOtp(student, validated.data.otp);
  if (!result.ok) {
    return { errors: { otp: [result.error] } };
  }

  const hashed = await hashPassword(validated.data.newPassword);
  await prisma.student.update({
    where: { id: student.id },
    data: { password: hashed, emailOtp: null, otpExpiresAt: null, otpAttempts: 0 },
  });

  return {
    success: true,
    message: "Your password has been reset. You can now sign in with your new password.",
  };
}
