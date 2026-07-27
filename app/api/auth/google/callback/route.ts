import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { GOOGLE_STATE_COOKIE_NAME, completeGoogleSignIn } from "@/lib/auth/google";
import { createStudentSession } from "@/lib/auth/session";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(GOOGLE_STATE_COOKIE_NAME)?.value;
  cookieStore.delete(GOOGLE_STATE_COOKIE_NAME);

  if (oauthError || !code || !state || !expectedState || state !== expectedState) {
    redirect("/student/login?error=google_failed");
  }

  const ip = await getClientIp();
  const limit = rateLimit(`google-oauth:${ip}`, 15, 15 * 60 * 1000);
  if (!limit.success) {
    redirect("/student/login?error=google_rate_limited");
  }

  const redirectUri = new URL("/api/auth/google/callback", request.url).toString();
  const result = await completeGoogleSignIn(code, redirectUri);

  if (!result.ok) {
    redirect(`/student/login?error=${result.error}`);
  }

  await createStudentSession(result.studentId);
  redirect("/student/dashboard");
}
