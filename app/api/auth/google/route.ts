import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { GOOGLE_STATE_COOKIE_NAME, getGoogleAuthUrl, isGoogleOAuthConfigured } from "@/lib/auth/google";

const STATE_COOKIE_MAX_AGE_SECONDS = 600;

export async function GET(request: Request) {
  if (!isGoogleOAuthConfigured()) {
    redirect("/student/login?error=google_unavailable");
  }

  const state = randomBytes(24).toString("hex");
  const redirectUri = new URL("/api/auth/google/callback", request.url).toString();

  const cookieStore = await cookies();
  cookieStore.set(GOOGLE_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: STATE_COOKIE_MAX_AGE_SECONDS,
  });

  redirect(getGoogleAuthUrl(redirectUri, state));
}
