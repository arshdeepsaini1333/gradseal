import "server-only";
import { prisma } from "@/lib/prisma";
import type { CourseLevel } from "@/generated/prisma/enums";

export async function getWishlistedCourseIds(studentId: string): Promise<string[]> {
  const items = await prisma.wishlist.findMany({ where: { studentId }, select: { courseId: true } });
  return items.map((item) => item.courseId);
}

export async function isCourseWishlisted(studentId: string, courseId: string): Promise<boolean> {
  const item = await prisma.wishlist.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
    select: { id: true },
  });
  return item !== null;
}

export type WishlistCourse = {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  thumbnail: string;
  category: string;
  level: CourseLevel;
  price: number;
  discountedPrice: number | null;
};

export async function getWishlistCourses(studentId: string): Promise<WishlistCourse[]> {
  const items = await prisma.wishlist.findMany({
    where: { studentId },
    orderBy: { addedAt: "desc" },
    include: {
      course: {
        select: {
          slug: true,
          title: true,
          thumbnail: true,
          level: true,
          price: true,
          discountedPrice: true,
          categories: { select: { name: true }, take: 1 },
        },
      },
    },
  });

  return items.map((item) => ({
    id: item.id,
    courseId: item.courseId,
    slug: item.course.slug,
    title: item.course.title,
    thumbnail: item.course.thumbnail,
    category: item.course.categories[0]?.name ?? "General",
    level: item.course.level,
    price: Number(item.course.price),
    discountedPrice: item.course.discountedPrice ? Number(item.course.discountedPrice) : null,
  }));
}
