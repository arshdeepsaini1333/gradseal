import "server-only";
import { prisma } from "@/lib/prisma";
import type { ContinueLearningCourse } from "@/types/dashboard";

export async function isEnrolled(studentId: string, courseId: string): Promise<boolean> {
  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
    select: { id: true },
  });
  return enrollment !== null;
}

export async function getEnrolledCourses(studentId: string): Promise<ContinueLearningCourse[]> {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    orderBy: { enrolledAt: "desc" },
    include: {
      course: {
        select: {
          id: true,
          slug: true,
          title: true,
          categories: { select: { name: true }, take: 1 },
          uploadedBy: { select: { fullName: true } },
        },
      },
    },
  });

  return enrollments.map((enrollment) => ({
    id: enrollment.course.id,
    slug: enrollment.course.slug,
    title: enrollment.course.title,
    instructor: enrollment.course.uploadedBy.fullName,
    category: enrollment.course.categories[0]?.name ?? "General",
    progressPercent: Math.round(enrollment.progress),
  }));
}
