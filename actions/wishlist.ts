"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/auth/session";

async function requireStudent() {
  const session = await getStudentSession();
  if (!session) redirect("/student/login");
  return session;
}

function revalidateWishlistSurfaces(courseSlug?: string) {
  revalidatePath("/student/wishlist");
  revalidatePath("/student/dashboard");
  revalidatePath("/courses");
  revalidatePath("/");
  if (courseSlug) revalidatePath(`/courses/${courseSlug}`);
}

export async function addToWishlist(courseId: string, courseSlug?: string): Promise<void> {
  const session = await requireStudent();

  await prisma.wishlist.upsert({
    where: { studentId_courseId: { studentId: session.id, courseId } },
    create: { studentId: session.id, courseId },
    update: {},
  });

  revalidateWishlistSurfaces(courseSlug);
}

export async function removeFromWishlist(courseId: string, courseSlug?: string): Promise<void> {
  const session = await requireStudent();

  await prisma.wishlist.deleteMany({
    where: { studentId: session.id, courseId },
  });

  revalidateWishlistSurfaces(courseSlug);
}
