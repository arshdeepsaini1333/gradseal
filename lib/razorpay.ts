import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";

const globalForRazorpay = globalThis as unknown as {
  razorpay: Razorpay | undefined;
};

export function getRazorpayClient(): Razorpay {
  if (globalForRazorpay.razorpay) return globalForRazorpay.razorpay;

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not configured");
  }

  const client = new Razorpay({ key_id, key_secret });
  if (process.env.NODE_ENV !== "production") {
    globalForRazorpay.razorpay = client;
  }
  return client;
}

/** Verifies the `razorpay_signature` returned by Checkout after a successful payment. */
export function verifyRazorpayPaymentSignature(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("RAZORPAY_KEY_SECRET is not configured");

  const expected = createHmac("sha256", secret)
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(input.razorpaySignature, "hex");
  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
}
