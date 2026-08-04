import "server-only";
import { prisma } from "@/lib/prisma";

export type StudentNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  courseSlug: string | null;
  read: boolean;
};

/** Broadcasts a "new course added" notification to every student. Call this right after a course is published. */
export async function createCourseAddedNotification(courseId: string, courseTitle: string): Promise<void> {
  await prisma.notification.create({
    data: {
      title: "New Course Added",
      message: `${courseTitle} is now available on GradSeal.`,
      courseId,
    },
  });
}

export async function getStudentNotifications(studentId: string): Promise<StudentNotification[]> {
  const [notifications, reads] = await Promise.all([
    prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      include: { course: { select: { slug: true } } },
    }),
    prisma.notificationRead.findMany({ where: { studentId }, select: { notificationId: true } }),
  ]);

  const readIds = new Set(reads.map((r) => r.notificationId));

  return notifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    createdAt: notification.createdAt,
    courseSlug: notification.course?.slug ?? null,
    read: readIds.has(notification.id),
  }));
}

export async function getUnreadNotificationCount(studentId: string): Promise<number> {
  const [totalCount, readCount] = await Promise.all([
    prisma.notification.count(),
    prisma.notificationRead.count({ where: { studentId } }),
  ]);
  return Math.max(0, totalCount - readCount);
}

/** Marks every notification the student hasn't seen yet as read — called when they open the notifications page. */
export async function markAllNotificationsRead(studentId: string): Promise<void> {
  const unread = await prisma.notification.findMany({
    where: { reads: { none: { studentId } } },
    select: { id: true },
  });
  if (unread.length === 0) return;

  await prisma.notificationRead.createMany({
    data: unread.map((notification) => ({ notificationId: notification.id, studentId })),
    skipDuplicates: true,
  });
}
