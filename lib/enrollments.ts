import "server-only";
import { prisma } from "@/lib/prisma";

export async function isEnrolled(studentId: string, courseId: string): Promise<boolean> {
  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
    select: { id: true },
  });
  return enrollment !== null;
}
