import "server-only";
import { randomBytes, createHash } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "student_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface SessionStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
}

export async function createStudentSession(studentId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.studentSession.create({
    data: { tokenHash: hashToken(token), studentId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export const getStudentSession = cache(async (): Promise<SessionStudent | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.studentSession.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      expiresAt: true,
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isActive: true,
          profileImage: true,
        },
      },
    },
  });

  if (!session || !session.student.isActive || session.expiresAt.getTime() < Date.now()) {
    return null;
  }

  const { id, firstName, lastName, email, profileImage } = session.student;
  return { id, firstName, lastName, email, profileImage };
});

export async function destroyStudentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await prisma.studentSession.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}
