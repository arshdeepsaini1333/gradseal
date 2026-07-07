// Shared between server logic (lib/auth/otp.ts) and client components —
// deliberately has no "server-only" import so it can be bundled for the browser.
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const MAX_OTP_VERIFY_ATTEMPTS = 5;
