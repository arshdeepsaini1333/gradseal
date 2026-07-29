import "server-only";

import { prisma } from "@/lib/prisma";
import {
  generateOtp,
  hashOtp,
  verifyOtpHash,
  otpExpiryDate,
  MAX_OTP_VERIFY_ATTEMPTS,
} from "@/lib/auth/otp";

// Mirrors lib/auth/otp-service.ts but scoped to Admin — kept separate rather
// than parameterized since Admin and Student are deliberately independent
// tables (see prisma/schema.prisma).

export async function issueAdminOtp(adminId: string): Promise<string> {
  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);
  await prisma.admin.update({
    where: { id: adminId },
    data: {
      emailOtp: hashedOtp,
      otpExpiresAt: otpExpiryDate(),
      otpAttempts: 0,
      lastOtpSentAt: new Date(),
    },
  });
  return otp;
}

export async function checkAdminOtp(
  admin: { id: string; emailOtp: string | null; otpExpiresAt: Date | null; otpAttempts: number },
  otp: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!admin.emailOtp || !admin.otpExpiresAt) {
    return { ok: false, error: "No verification code found. Please request a new one." };
  }
  if (admin.otpExpiresAt.getTime() < Date.now()) {
    return { ok: false, error: "This code has expired. Please request a new one." };
  }
  if (admin.otpAttempts >= MAX_OTP_VERIFY_ATTEMPTS) {
    return { ok: false, error: "Too many incorrect attempts. Please request a new code." };
  }

  const isValid = await verifyOtpHash(otp, admin.emailOtp);
  if (!isValid) {
    await prisma.admin.update({
      where: { id: admin.id },
      data: { otpAttempts: { increment: 1 } },
    });
    const attemptsLeft = MAX_OTP_VERIFY_ATTEMPTS - admin.otpAttempts - 1;
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
