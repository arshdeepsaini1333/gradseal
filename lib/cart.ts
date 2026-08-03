import "server-only";
import { prisma } from "@/lib/prisma";

export type CartLine = {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  thumbnail: string;
  category: string;
  price: number;
  discountedPrice: number | null;
};

export async function getCartItems(studentId: string): Promise<CartLine[]> {
  const items = await prisma.cartItem.findMany({
    where: { studentId },
    orderBy: { addedAt: "desc" },
    include: {
      course: {
        select: {
          slug: true,
          title: true,
          thumbnail: true,
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
    price: Number(item.course.price),
    discountedPrice: item.course.discountedPrice ? Number(item.course.discountedPrice) : null,
  }));
}

export async function getCartCount(studentId: string): Promise<number> {
  return prisma.cartItem.count({ where: { studentId } });
}

export async function isCourseInCart(studentId: string, courseId: string): Promise<boolean> {
  const item = await prisma.cartItem.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
    select: { id: true },
  });
  return item !== null;
}
