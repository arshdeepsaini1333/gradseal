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

function revalidateCartSurfaces(courseSlug?: string) {
  revalidatePath("/student/cart");
  revalidatePath("/student", "layout");
  if (courseSlug) revalidatePath(`/courses/${courseSlug}`);
}

export async function addToCart(courseId: string, courseSlug?: string): Promise<void> {
  const session = await requireStudent();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, isPublished: true },
  });
  if (!course || !course.isPublished) {
    throw new Error("This course is not available.");
  }

  const alreadyEnrolled = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId: session.id, courseId } },
    select: { id: true },
  });
  if (alreadyEnrolled) {
    throw new Error("You're already enrolled in this course.");
  }

  await prisma.cartItem.upsert({
    where: { studentId_courseId: { studentId: session.id, courseId } },
    create: { studentId: session.id, courseId },
    update: {},
  });

  revalidateCartSurfaces(courseSlug);
}

export async function removeFromCart(courseId: string, courseSlug?: string): Promise<void> {
  const session = await requireStudent();

  await prisma.cartItem.deleteMany({
    where: { studentId: session.id, courseId },
  });

  revalidateCartSurfaces(courseSlug);
}
