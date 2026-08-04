"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/admin-session";
import { createUploadUrl } from "@/lib/aws/s3";
import { slugify } from "@/lib/format";
import { createCourseAddedNotification } from "@/lib/notifications";
import {
  courseDraftSchema,
  createCategorySchema,
} from "@/lib/validations/admin-course";
import type { CourseDraft, CourseCategoryOption, UploadKind } from "@/types/course";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const UPLOAD_RULES: Record<UploadKind, { prefix: string; allowedTypes: string[] }> = {
  thumbnail: { prefix: "courseimages", allowedTypes: IMAGE_TYPES },
  "preview-video": { prefix: "coursevideo", allowedTypes: VIDEO_TYPES },
  "lesson-video": { prefix: "coursevideo", allowedTypes: VIDEO_TYPES },
  "lesson-image": { prefix: "courseimages", allowedTypes: IMAGE_TYPES },
};

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requestCourseUploadUrl(input: {
  fileName: string;
  contentType: string;
  kind: UploadKind;
}): Promise<{ uploadUrl: string; publicUrl: string }> {
  await requireAdmin();

  const rule = UPLOAD_RULES[input.kind];
  if (!rule || !rule.allowedTypes.includes(input.contentType)) {
    throw new Error("Unsupported file type");
  }

  const extension = input.fileName.split(".").pop()?.toLowerCase() || "bin";
  const key = `${rule.prefix}/${randomUUID()}.${extension}`;

  return createUploadUrl(key, input.contentType);
}

export async function createCourseCategory(
  input: unknown
): Promise<CourseCategoryOption> {
  await requireAdmin();

  const validated = createCategorySchema.safeParse(input);
  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message ?? "Invalid category");
  }

  const baseSlug = slugify(validated.data.name);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const category = await prisma.category.create({
    data: { name: validated.data.name, slug },
    select: { id: true, name: true },
  });

  revalidatePath("/admin/courses/new");
  return category;
}

async function uniqueCourseSlug(title: string): Promise<string> {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.course.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
  return slug;
}

export async function createCourse(payload: CourseDraft): Promise<void> {
  const session = await requireAdmin();

  const validated = courseDraftSchema.safeParse(payload);
  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message ?? "Invalid course data");
  }
  const data = validated.data;

  const slug = await uniqueCourseSlug(data.title);
  const totalLessons = data.lessons.length;
  const totalHours = Math.max(
    1,
    Math.ceil(data.lessons.reduce((sum, lesson) => sum + lesson.duration, 0) / 60)
  );

  const course = await prisma.course.create({
    data: {
      title: data.title,
      slug,
      shortDescription: data.shortDescription,
      description: data.description,
      thumbnail: data.thumbnail,
      previewVideo: data.previewVideo,
      price: data.price,
      discountedPrice: data.discountedPrice,
      duration: data.duration,
      language: data.language,
      level: data.level,
      totalLessons,
      totalHours,
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,
      categories: { connect: data.categoryIds.map((id) => ({ id })) },
      uploadedById: session.id,
      modules: {
        create: {
          title: "Course Content",
          position: 1,
          lessons: {
            create: data.lessons.map((lesson, index) => ({
              title: lesson.title,
              description: lesson.description,
              videoUrl: lesson.videoUrl,
              images: lesson.images,
              duration: lesson.duration,
              position: index + 1,
              isFree: lesson.isFree,
              test: {
                create: {
                  title: `${lesson.title} Quiz`,
                  passingScore: lesson.test.passingScore,
                  questions: {
                    create: lesson.test.questions.map((question, qIndex) => ({
                      text: question.text,
                      position: qIndex + 1,
                      options: {
                        create: question.options.map((option, oIndex) => ({
                          text: option.text,
                          isCorrect: option.isCorrect,
                          position: oIndex + 1,
                        })),
                      },
                    })),
                  },
                },
              },
            })),
          },
        },
      },
    },
  });

  if (data.isPublished) {
    await createCourseAddedNotification(course.id, course.title);
  }

  revalidatePath("/admin/courses");
  redirect("/admin/courses");
}
