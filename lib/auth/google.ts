import "server-only";

import { prisma } from "@/lib/prisma";

export const GOOGLE_STATE_COOKIE_NAME = "google_oauth_state";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function getGoogleAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
}

interface GoogleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
}

async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<GoogleTokenResponse> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!response.ok) {
    throw new Error(`Google token exchange failed (${response.status})`);
  }
  return response.json();
}

async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Google userinfo fetch failed (${response.status})`);
  }
  return response.json();
}

export type GoogleSignInResult = { ok: true; studentId: string } | { ok: false; error: string };

// Exchanges the OAuth code for a Google profile, then finds, links, or
// creates the matching Student. Deliberately free of redirect() calls —
// redirect() throws internally in Next.js, so the route handler is the only
// place that should call it, exactly once, after this promise settles.
export async function completeGoogleSignIn(
  code: string,
  redirectUri: string
): Promise<GoogleSignInResult> {
  let profile: GoogleUserInfo;
  try {
    const tokens = await exchangeCodeForTokens(code, redirectUri);
    profile = await fetchGoogleUserInfo(tokens.access_token);
  } catch (error) {
    console.error("Google OAuth exchange failed", error);
    return { ok: false, error: "google_failed" };
  }

  if (!profile.email || !profile.email_verified) {
    return { ok: false, error: "google_unverified_email" };
  }
  const email = profile.email.toLowerCase();

  let student = await prisma.student.findUnique({ where: { googleId: profile.sub } });

  if (!student) {
    const existingByEmail = await prisma.student.findUnique({ where: { email } });
    // An existing password account with the same address: Google has already
    // verified ownership of that inbox, so it's safe to link the two rather
    // than bounce the user into "email already exists".
    student = existingByEmail
      ? await prisma.student.update({
          where: { id: existingByEmail.id },
          data: { googleId: profile.sub, isVerified: true },
        })
      : await prisma.student.create({
          data: {
            googleId: profile.sub,
            email,
            firstName: profile.given_name || profile.name?.split(" ")[0] || "Student",
            lastName: profile.family_name || profile.name?.split(" ").slice(1).join(" ") || "",
            profileImage: profile.picture ?? null,
            isVerified: true,
          },
        });
  }

  if (!student.isActive) {
    return { ok: false, error: "account_deactivated" };
  }

  return { ok: true, studentId: student.id };
}
