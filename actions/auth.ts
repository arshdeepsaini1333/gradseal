"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { saveProfileImage } from "@/lib/uploads";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { generateOtp, hashOtp, otpExpiryDate, OTP_EXPIRY_MINUTES } from "@/lib/auth/otp";
import { issueOtp, checkResendCooldown, checkOtp } from "@/lib/auth/otp-service";
import { createStudentSession, destroyStudentSession } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email/send-email";
import { otpEmailTemplate, loginOtpEmailTemplate } from "@/lib/email/templates/otp-email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { studentSignupSchema } from "@/lib/validations/student-signup";
import { studentLoginSchema } from "@/lib/validations/student-login";
import type { Gender, HighestQualification } from "@/generated/prisma/enums";

const otpCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, { error: "Enter the 6-digit code" });

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

export type SignupFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

export async function registerStudent(
  _prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const ip = await getClientIp();
  const limit = rateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      message: `Too many registration attempts. Please try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const validated = studentSignupSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    country: formData.get("country"),
    state: formData.get("state"),
    city: formData.get("city"),
    pincode: formData.get("pincode"),
    address: formData.get("address"),
    highestQualification: formData.get("highestQualification"),
    collegeOrUniversity: formData.get("collegeOrUniversity"),
    currentOccupation: formData.get("currentOccupation"),
    fieldOfStudy: formData.get("fieldOfStudy"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = validated.data;

  const existing = await prisma.student.findUnique({
    where: { email: data.email },
    select: { id: true, password: true },
  });
  if (existing) {
    return {
      errors: {
        email: [
          existing.password
            ? "An account with this email already exists"
            : "This email is linked to a Google account. Please continue with Google to sign in.",
        ],
      },
    };
  }

  let profileImagePath: string | null = null;
  const profileImageFile = formData.get("profileImage");
  if (profileImageFile instanceof File && profileImageFile.size > 0) {
    try {
      profileImagePath = await saveProfileImage(profileImageFile);
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "Could not process profile picture",
      };
    }
  }

  const hashedPassword = await hashPassword(data.password);
  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);

  const student = await prisma.student.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      profileImage: profileImagePath,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender as Gender,
      country: data.country,
      state: data.state,
      city: data.city,
      pincode: data.pincode,
      address: data.address || null,
      highestQualification: data.highestQualification as HighestQualification,
      collegeOrUniversity: data.collegeOrUniversity || null,
      currentOccupation: data.currentOccupation || null,
      fieldOfStudy: data.fieldOfStudy || null,
      emailOtp: hashedOtp,
      otpExpiresAt: otpExpiryDate(),
      lastOtpSentAt: new Date(),
    },
    select: { firstName: true, email: true },
  });

  const { subject, html } = otpEmailTemplate({
    firstName: student.firstName,
    otp,
    expiryMinutes: OTP_EXPIRY_MINUTES,
  });
  await sendEmail({ to: student.email, subject, html });

  redirect(`/student/verify-otp?email=${encodeURIComponent(student.email)}`);
}

// ---------------------------------------------------------------------------
// OTP verification
// ---------------------------------------------------------------------------

export type OtpFormState = { error?: string } | undefined;

export async function verifyOtp(
  email: string,
  _prevState: OtpFormState,
  formData: FormData
): Promise<OtpFormState> {
  const ip = await getClientIp();
  const limit = rateLimit(`verify-otp:${ip}`, 15, 15 * 60 * 1000);
  if (!limit.success) {
    return { error: "Too many attempts. Please try again later." };
  }

  const parsed = otpCodeSchema.safeParse(formData.get("otp"));
  if (!parsed.success) {
    return { error: "Enter the 6-digit code" };
  }
  const otp = parsed.data;

  const student = await prisma.student.findUnique({ where: { email } });
  if (!student) {
    return { error: "Account not found. Please register again." };
  }

  if (student.isVerified) {
    redirect("/student/login?verified=1");
  }

  const result = await checkOtp(student, otp);
  if (!result.ok) {
    return { error: result.error };
  }

  await prisma.student.update({
    where: { id: student.id },
    data: {
      isVerified: true,
      emailOtp: null,
      otpExpiresAt: null,
      otpAttempts: 0,
    },
  });

  redirect("/student/login?verified=1");
}

// ---------------------------------------------------------------------------
// OTP resend
// ---------------------------------------------------------------------------

export type ResendOtpState =
  | { error?: string; message?: string; cooldownSeconds?: number }
  | undefined;

export async function resendOtp(email: string): Promise<ResendOtpState> {
  const ip = await getClientIp();
  const limit = rateLimit(`resend-otp:${ip}:${email}`, 5, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      error: `Too many resend requests. Try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const student = await prisma.student.findUnique({ where: { email } });
  if (!student) {
    return { error: "Account not found. Please register again." };
  }
  if (student.isVerified) {
    return { error: "This account is already verified." };
  }

  const cooldown = checkResendCooldown(student.lastOtpSentAt);
  if (!cooldown.ok) {
    return { error: cooldown.error, cooldownSeconds: cooldown.cooldownSeconds };
  }

  const otp = await issueOtp(student.id);
  const { subject, html } = otpEmailTemplate({
    firstName: student.firstName,
    otp,
    expiryMinutes: OTP_EXPIRY_MINUTES,
  });
  await sendEmail({ to: student.email, subject, html });

  return { message: "A new verification code has been sent to your email." };
}

// ---------------------------------------------------------------------------
// Login (password + OTP two-factor)
// ---------------------------------------------------------------------------

export type LoginFormState = { error?: string } | undefined;

const GENERIC_LOGIN_ERROR = "Invalid email or password.";

export async function loginStudent(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const ip = await getClientIp();
  const limit = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      error: `Too many login attempts. Please try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const validated = studentLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validated.success) {
    return { error: GENERIC_LOGIN_ERROR };
  }
  const { email, password } = validated.data;

  const student = await prisma.student.findUnique({ where: { email } });
  if (!student) {
    return { error: GENERIC_LOGIN_ERROR };
  }

  if (!student.password) {
    return { error: "This account uses Google Sign-In. Please continue with Google to sign in." };
  }

  const passwordMatches = await verifyPassword(password, student.password);
  if (!passwordMatches) {
    return { error: GENERIC_LOGIN_ERROR };
  }

  if (!student.isActive) {
    return { error: "Your account has been deactivated. Please contact support." };
  }

  if (!student.isVerified) {
    const cooldown = checkResendCooldown(student.lastOtpSentAt);
    if (cooldown.ok) {
      const otp = await issueOtp(student.id);
      const { subject, html } = otpEmailTemplate({
        firstName: student.firstName,
        otp,
        expiryMinutes: OTP_EXPIRY_MINUTES,
      });
      await sendEmail({ to: student.email, subject, html });
    }
    redirect(`/student/verify-otp?email=${encodeURIComponent(student.email)}`);
  }

  const otp = await issueOtp(student.id);
  const { subject, html } = loginOtpEmailTemplate({
    firstName: student.firstName,
    otp,
    expiryMinutes: OTP_EXPIRY_MINUTES,
  });
  await sendEmail({ to: student.email, subject, html });

  redirect(`/student/verify-login-otp?email=${encodeURIComponent(student.email)}`);
}

export async function verifyLoginOtp(
  email: string,
  _prevState: OtpFormState,
  formData: FormData
): Promise<OtpFormState> {
  const ip = await getClientIp();
  const limit = rateLimit(`verify-login-otp:${ip}`, 15, 15 * 60 * 1000);
  if (!limit.success) {
    return { error: "Too many attempts. Please try again later." };
  }

  const parsed = otpCodeSchema.safeParse(formData.get("otp"));
  if (!parsed.success) {
    return { error: "Enter the 6-digit code" };
  }
  const otp = parsed.data;

  const student = await prisma.student.findUnique({ where: { email } });
  if (!student || !student.isActive) {
    return { error: "Account not found. Please log in again." };
  }

  if (!student.isVerified) {
    return { error: "Please verify your email before signing in." };
  }

  const result = await checkOtp(student, otp);
  if (!result.ok) {
    return { error: result.error };
  }

  await prisma.student.update({
    where: { id: student.id },
    data: { emailOtp: null, otpExpiresAt: null, otpAttempts: 0 },
  });

  await createStudentSession(student.id);
  redirect("/student/dashboard");
}

export async function resendLoginOtp(email: string): Promise<ResendOtpState> {
  const ip = await getClientIp();
  const limit = rateLimit(`resend-login-otp:${ip}:${email}`, 5, 15 * 60 * 1000);
  if (!limit.success) {
    return {
      error: `Too many resend requests. Try again in ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} minute(s).`,
    };
  }

  const student = await prisma.student.findUnique({ where: { email } });
  if (!student || !student.isActive || !student.isVerified) {
    return { error: "Account not found. Please log in again." };
  }

  const cooldown = checkResendCooldown(student.lastOtpSentAt);
  if (!cooldown.ok) {
    return { error: cooldown.error, cooldownSeconds: cooldown.cooldownSeconds };
  }

  const otp = await issueOtp(student.id);
  const { subject, html } = loginOtpEmailTemplate({
    firstName: student.firstName,
    otp,
    expiryMinutes: OTP_EXPIRY_MINUTES,
  });
  await sendEmail({ to: student.email, subject, html });

  return { message: "A new verification code has been sent to your email." };
}

export async function logoutStudent(): Promise<void> {
  await destroyStudentSession();
  redirect("/student/login");
}
