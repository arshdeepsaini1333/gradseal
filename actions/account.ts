"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getStudentSession, destroyStudentSession } from "@/lib/auth/session";
import { OTP_EXPIRY_MINUTES } from "@/lib/auth/otp";
import { issueOtp, checkOtp, checkResendCooldown } from "@/lib/auth/otp-service";
import { sendEmail } from "@/lib/email/send-email";
import { createPasswordOtpEmailTemplate } from "@/lib/email/templates/otp-email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  changePasswordSchema,
  createPasswordSchema,
  deleteAccountSchema,
} from "@/lib/validations/account";

// ---------------------------------------------------------------------------
// Change password (accounts that already have one)
// ---------------------------------------------------------------------------

export type ChangePasswordState =
  | { success?: boolean; message?: string; errors?: Record<string, string[]> }
  | undefined;

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await getStudentSession();
  if (!session) redirect("/student/login");

  const ip = await getClientIp();
  const limit = rateLimit(`change-password:${session.id}:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      message: `Too many attempts. Please try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const validated = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const student = await prisma.student.findUnique({
    where: { id: session.id },
    select: { password: true },
  });
  if (!student?.password) {
    return { message: "This account doesn't have a password set yet." };
  }

  const matches = await verifyPassword(validated.data.currentPassword, student.password);
  if (!matches) {
    return { errors: { currentPassword: ["Current password is incorrect."] } };
  }

  const hashed = await hashPassword(validated.data.newPassword);
  await prisma.student.update({ where: { id: session.id }, data: { password: hashed } });

  return { success: true, message: "Your password has been updated." };
}

// ---------------------------------------------------------------------------
// Create password (Google-only accounts) — OTP-gated
// ---------------------------------------------------------------------------

export type RequestOtpState =
  | { error?: string; message?: string; cooldownSeconds?: number }
  | undefined;

export async function requestCreatePasswordOtp(): Promise<RequestOtpState> {
  const session = await getStudentSession();
  if (!session) redirect("/student/login");

  const ip = await getClientIp();
  const limit = rateLimit(`create-password-otp:${session.id}:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      error: `Too many attempts. Please try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const student = await prisma.student.findUnique({
    where: { id: session.id },
    select: { id: true, firstName: true, email: true, password: true, lastOtpSentAt: true },
  });
  if (!student) redirect("/student/login");
  if (student.password) {
    return { error: "This account already has a password set." };
  }

  const cooldown = checkResendCooldown(student.lastOtpSentAt);
  if (!cooldown.ok) {
    return { error: cooldown.error, cooldownSeconds: cooldown.cooldownSeconds };
  }

  const otp = await issueOtp(student.id);
  const { subject, html } = createPasswordOtpEmailTemplate({
    firstName: student.firstName,
    otp,
    expiryMinutes: OTP_EXPIRY_MINUTES,
  });
  await sendEmail({ to: student.email, subject, html });

  return { message: "We've sent a verification code to your email." };
}

export type VerifyCreatePasswordOtpState = { success?: boolean; error?: string } | undefined;

// Checks the code without consuming it, so the create-password UI can gate
// the password fields behind a verified code. createPassword() below
// re-checks the same code server-side before actually setting the
// password — this step is a UX gate, not the security boundary.
export async function verifyCreatePasswordOtp(
  _prevState: VerifyCreatePasswordOtpState,
  formData: FormData
): Promise<VerifyCreatePasswordOtpState> {
  const session = await getStudentSession();
  if (!session) redirect("/student/login");

  const ip = await getClientIp();
  const limit = rateLimit(`verify-create-password-otp:${session.id}:${ip}`, 10, 15 * 60 * 1000);
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
    where: { id: session.id },
    select: { id: true, password: true, emailOtp: true, otpExpiresAt: true, otpAttempts: true },
  });
  if (!student) redirect("/student/login");
  if (student.password) {
    return { error: "This account already has a password set." };
  }

  const result = await checkOtp(student, otp);
  if (!result.ok) {
    return { error: result.error };
  }

  return { success: true };
}

export type CreatePasswordState =
  | { success?: boolean; message?: string; errors?: Record<string, string[]> }
  | undefined;

export async function createPassword(
  _prevState: CreatePasswordState,
  formData: FormData
): Promise<CreatePasswordState> {
  const session = await getStudentSession();
  if (!session) redirect("/student/login");

  const ip = await getClientIp();
  const limit = rateLimit(`create-password:${session.id}:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      message: `Too many attempts. Please try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const validated = createPasswordSchema.safeParse({
    otp: formData.get("otp"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const student = await prisma.student.findUnique({
    where: { id: session.id },
    select: { id: true, password: true, emailOtp: true, otpExpiresAt: true, otpAttempts: true },
  });
  if (!student) redirect("/student/login");
  if (student.password) {
    return { message: "This account already has a password set." };
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
    message: "Password created! You can now also sign in with your email and password.",
  };
}

// ---------------------------------------------------------------------------
// Delete account
// ---------------------------------------------------------------------------

export type DeleteAccountState = { error?: string } | undefined;

export async function deleteAccount(
  _prevState: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  const session = await getStudentSession();
  if (!session) redirect("/student/login");

  const ip = await getClientIp();
  const limit = rateLimit(`delete-account:${session.id}:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      error: `Too many attempts. Please try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const validated = deleteAccountSchema.safeParse({ confirmText: formData.get("confirmText") });
  if (!validated.success) {
    return { error: 'Type "DELETE" to confirm account deletion.' };
  }

  // Enrollments, certificates, lesson progress, and sessions cascade-delete
  // with the student. Orders are kept for revenue accounting but detached
  // (student_id set to null) rather than deleted — see the Order model.
  await prisma.student.delete({ where: { id: session.id } });

  await destroyStudentSession();
  redirect("/student/login?deleted=1");
}
