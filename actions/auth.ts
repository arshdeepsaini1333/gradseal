"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import {
  generateOtp,
  hashOtp,
  verifyOtpHash,
  otpExpiryDate,
  OTP_EXPIRY_MINUTES,
  OTP_RESEND_COOLDOWN_SECONDS,
  MAX_OTP_VERIFY_ATTEMPTS,
} from "@/lib/auth/otp";
import { sendEmail } from "@/lib/email/send-email";
import { otpEmailTemplate } from "@/lib/email/templates/otp-email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { studentSignupSchema } from "@/lib/validations/student-signup";
import type { Gender, HighestQualification } from "@/generated/prisma/enums";

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

export type SignupFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

const MAX_PROFILE_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function saveProfileImage(file: File): Promise<string | null> {
  if (file.size === 0) return null;

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Profile picture must be a JPEG, PNG, or WEBP image");
  }
  if (file.size > MAX_PROFILE_IMAGE_BYTES) {
    throw new Error("Profile picture must be smaller than 2MB");
  }

  const extension = file.type.split("/")[1];
  const filename = `${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "students");
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  // NOTE: local disk storage works for a single-instance/dev deployment only.
  // Swap this for S3/Cloudinary/Vercel Blob before deploying to serverless infra.
  return `/uploads/students/${filename}`;
}

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
    select: { id: true },
  });
  if (existing) {
    return { errors: { email: ["An account with this email already exists"] } };
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

const otpCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, { error: "Enter the 6-digit code" });

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

  if (!student.emailOtp || !student.otpExpiresAt) {
    return { error: "No verification code found. Please request a new one." };
  }

  if (student.otpExpiresAt.getTime() < Date.now()) {
    return { error: "This code has expired. Please request a new one." };
  }

  if (student.otpAttempts >= MAX_OTP_VERIFY_ATTEMPTS) {
    return { error: "Too many incorrect attempts. Please request a new code." };
  }

  const isValid = await verifyOtpHash(otp, student.emailOtp);
  if (!isValid) {
    await prisma.student.update({
      where: { id: student.id },
      data: { otpAttempts: { increment: 1 } },
    });
    const attemptsLeft = MAX_OTP_VERIFY_ATTEMPTS - student.otpAttempts - 1;
    return {
      error:
        attemptsLeft > 0
          ? `Incorrect code. ${attemptsLeft} attempt(s) remaining.`
          : "Too many incorrect attempts. Please request a new code.",
    };
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

  if (student.lastOtpSentAt) {
    const secondsSinceLastSend =
      (Date.now() - student.lastOtpSentAt.getTime()) / 1000;
    if (secondsSinceLastSend < OTP_RESEND_COOLDOWN_SECONDS) {
      return {
        error: "Please wait before requesting another code.",
        cooldownSeconds: Math.ceil(
          OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLastSend
        ),
      };
    }
  }

  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);

  await prisma.student.update({
    where: { id: student.id },
    data: {
      emailOtp: hashedOtp,
      otpExpiresAt: otpExpiryDate(),
      otpAttempts: 0,
      lastOtpSentAt: new Date(),
    },
  });

  const { subject, html } = otpEmailTemplate({
    firstName: student.firstName,
    otp,
    expiryMinutes: OTP_EXPIRY_MINUTES,
  });
  await sendEmail({ to: student.email, subject, html });

  return { message: "A new verification code has been sent to your email." };
}
