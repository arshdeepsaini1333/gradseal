import "server-only";
import bcrypt from "bcryptjs";
import { OTP_LENGTH, OTP_EXPIRY_MINUTES } from "@/lib/auth/otp-constants";

export * from "@/lib/auth/otp-constants";

const OTP_HASH_ROUNDS = 10;

export function generateOtp(): string {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  const code = Math.floor(min + Math.random() * (max - min + 1));
  return code.toString();
}

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, OTP_HASH_ROUNDS);
}

export async function verifyOtpHash(
  otp: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}

export function otpExpiryDate(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

export function secondsUntil(date: Date): number {
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 1000));
}
