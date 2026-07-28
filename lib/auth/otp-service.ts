import "server-only";

import { prisma } from "@/lib/prisma";
import {
  generateOtp,
  hashOtp,
  verifyOtpHash,
  otpExpiryDate,
  OTP_RESEND_COOLDOWN_SECONDS,
  MAX_OTP_VERIFY_ATTEMPTS,
} from "@/lib/auth/otp";

// Prisma-backed OTP helpers shared across auth flows (registration, login
// 2FA, password creation, resends). Deliberately kept out of any "use
// server" module — every export from a "use server" file becomes a public,
// unauthenticated RPC, and `issueOtp` returns the raw code to its caller.

export async function issueOtp(studentId: string): Promise<string> {
  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);
  await prisma.student.update({
    where: { id: studentId },
    data: {
      emailOtp: hashedOtp,
      otpExpiresAt: otpExpiryDate(),
      otpAttempts: 0,
      lastOtpSentAt: new Date(),
    },
  });
  return otp;
}

export function checkResendCooldown(
  lastOtpSentAt: Date | null
): { ok: true } | { ok: false; error: string; cooldownSeconds: number } {
  if (!lastOtpSentAt) return { ok: true };

  const secondsSinceLastSend = (Date.now() - lastOtpSentAt.getTime()) / 1000;
  if (secondsSinceLastSend >= OTP_RESEND_COOLDOWN_SECONDS) return { ok: true };

  return {
    ok: false,
    error: "Please wait before requesting another code.",
    cooldownSeconds: Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLastSend),
  };
}

export async function checkOtp(
  student: { id: string; emailOtp: string | null; otpExpiresAt: Date | null; otpAttempts: number },
  otp: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!student.emailOtp || !student.otpExpiresAt) {
    return { ok: false, error: "No verification code found. Please request a new one." };
  }
  if (student.otpExpiresAt.getTime() < Date.now()) {
    return { ok: false, error: "This code has expired. Please request a new one." };
  }
  if (student.otpAttempts >= MAX_OTP_VERIFY_ATTEMPTS) {
    return { ok: false, error: "Too many incorrect attempts. Please request a new code." };
  }

  const isValid = await verifyOtpHash(otp, student.emailOtp);
  if (!isValid) {
    await prisma.student.update({
      where: { id: student.id },
      data: { otpAttempts: { increment: 1 } },
    });
    const attemptsLeft = MAX_OTP_VERIFY_ATTEMPTS - student.otpAttempts - 1;
    return {
      ok: false,
      error:
        attemptsLeft > 0
          ? `Incorrect code. ${attemptsLeft} attempt(s) remaining.`
          : "Too many incorrect attempts. Please request a new code.",
    };
  }

  return { ok: true };
}
