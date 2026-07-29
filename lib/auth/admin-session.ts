import "server-only";
import { randomBytes, createHash } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export const ADMIN_SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface SessionAdmin {
  id: string;
  fullName: string;
  email: string;
}

export async function createAdminSession(adminId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.adminSession.create({
    data: { tokenHash: hashToken(token), adminId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export const getAdminSession = cache(async (): Promise<SessionAdmin | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      expiresAt: true,
      admin: {
        select: { id: true, fullName: true, email: true, isActive: true },
      },
    },
  });

  if (!session || !session.admin.isActive || session.expiresAt.getTime() < Date.now()) {
    return null;
  }

  const { id, fullName, email } = session.admin;
  return { id, fullName, email };
});

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (token) {
    await prisma.adminSession.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
}
