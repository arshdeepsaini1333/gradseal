import { prisma } from "@/lib/prisma";
import type { CourseLevel } from "@/generated/prisma/enums";
import type { Course as DashboardCourse } from "@/types";

export type CatalogCourse = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  price: number;
  discountedPrice: number | null;
  duration: string;
  language: string;
  level: CourseLevel;
  totalLessons: number;
  totalHours: number;
  createdAt: Date;
  categories: { id: string; name: string; slug: string }[];
};

export async function getPublishedCourses(): Promise<CatalogCourse[]> {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: { categories: true },
    orderBy: { createdAt: "desc" },
  });

  return courses.map((course) => ({
    ...course,
    price: Number(course.price),
    discountedPrice: course.discountedPrice ? Number(course.discountedPrice) : null,
  }));
}

function mapCourseLevel(level: CourseLevel): DashboardCourse["difficulty"] {
  if (level === "BEGINNER") return "Beginner";
  if (level === "INTERMEDIATE") return "Intermediate";
  return "Advanced";
}

function toDashboardCourse(course: CatalogCourse & { enrollmentCount: number }): DashboardCourse {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.shortDescription,
    duration: course.duration,
    difficulty: mapCourseLevel(course.level),
    rating: 0,
    reviewCount: 0,
    image: course.thumbnail,
    category: course.categories[0]?.name ?? "General",
    hasCertificate: true,
    purchaseCount: course.enrollmentCount,
    createdAt: course.createdAt.toISOString(),
  };
}

export type DashboardCourseSections = {
  discover: DashboardCourse[];
  trending: DashboardCourse[];
  recentlyAdded: DashboardCourse[];
};

/** Only real, published DB courses — no mock/placeholder data — split into the three dashboard sections. */
export async function getDashboardCourseSections(): Promise<DashboardCourseSections> {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      categories: true,
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped = courses.map((course) =>
    toDashboardCourse({
      ...course,
      price: Number(course.price),
      discountedPrice: course.discountedPrice ? Number(course.discountedPrice) : null,
      enrollmentCount: course._count.enrollments,
    }),
  );

  const trending = [...mapped].sort((a, b) => b.purchaseCount - a.purchaseCount).slice(0, 3);
  const trendingIds = new Set(trending.map((course) => course.id));
  const nonTrending = mapped.filter((course) => !trendingIds.has(course.id));
  // Small catalogs can have every course already claimed by "Trending" — fall back to
  // showing all courses here too rather than leaving the section empty.
  const discover = (nonTrending.length > 0 ? nonTrending : mapped).slice(0, 3);
  const recentlyAdded = [...mapped]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return { discover, trending, recentlyAdded };
}

export async function getFeaturedCourses(limit = 8): Promise<CatalogCourse[]> {
  const featured = await prisma.course.findMany({
    where: { isPublished: true, isFeatured: true },
    include: { categories: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const courses = featured.length > 0 ? featured : await prisma.course.findMany({
    where: { isPublished: true },
    include: { categories: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return courses.map((course) => ({
    ...course,
    price: Number(course.price),
    discountedPrice: course.discountedPrice ? Number(course.discountedPrice) : null,
  }));
}

export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
};

/** Every category created in the admin portal, with a live published-course count (0 for categories with nothing published yet). Sorted by course count descending, so the most active categories lead the bar. */
export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { courses: { where: { isPublished: true } } } },
    },
  });

  return categories
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      courseCount: category._count.courses,
    }))
    .sort((a, b) => b.courseCount - a.courseCount || a.name.localeCompare(b.name));
}

export type CourseDetailLesson = {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  position: number;
  isFree: boolean;
  videoUrl: string | null;
  test: {
    id: string;
    title: string;
    passingScore: number;
    questionCount: number;
  } | null;
};

export type CourseDetail = CatalogCourse & {
  modules: {
    id: string;
    title: string;
    position: number;
    lessons: CourseDetailLesson[];
  }[];
};

export async function getCourseBySlug(slug: string): Promise<CourseDetail | null> {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      categories: true,
      modules: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
            include: {
              test: {
                select: {
                  id: true,
                  title: true,
                  passingScore: true,
                  _count: { select: { questions: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course || !course.isPublished) return null;

  return {
    ...course,
    price: Number(course.price),
    discountedPrice: course.discountedPrice ? Number(course.discountedPrice) : null,
    modules: course.modules.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((lesson) => ({
        ...lesson,
        test: lesson.test
          ? {
              id: lesson.test.id,
              title: lesson.test.title,
              passingScore: lesson.test.passingScore,
              questionCount: lesson.test._count.questions,
            }
          : null,
      })),
    })),
  };
}
