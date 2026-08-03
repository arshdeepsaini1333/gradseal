import { z } from "zod";

export const courseLevelSchema = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);

export const answerOptionSchema = z.object({
  text: z.string().trim().min(1, { error: "Option text is required" }),
  isCorrect: z.boolean(),
});

export const questionSchema = z
  .object({
    text: z.string().trim().min(1, { error: "Question text is required" }),
    options: z
      .array(answerOptionSchema)
      .min(2, { error: "Each question needs at least 2 options" })
      .max(6, { error: "Each question can have at most 6 options" }),
  })
  .refine((q) => q.options.filter((o) => o.isCorrect).length === 1, {
    error: "Mark exactly one option as correct",
    path: ["options"],
  });

export const testSchema = z.object({
  passingScore: z.number().int().min(1).max(100),
  questions: z.array(questionSchema).min(1, { error: "Add at least one question" }),
});

export const lessonSchema = z.object({
  title: z.string().trim().min(1, { error: "Lesson title is required" }),
  description: z.string().trim().optional(),
  videoUrl: z.url().optional(),
  images: z.array(z.url()).default([]),
  duration: z.number().int().min(1, { error: "Duration must be at least 1 minute" }),
  isFree: z.boolean().default(false),
  test: testSchema,
});

export const courseDraftSchema = z.object({
  title: z.string().trim().min(1, { error: "Title is required" }),
  shortDescription: z.string().trim().min(1, { error: "Short description is required" }),
  description: z.string().trim().min(1, { error: "Description is required" }),
  thumbnail: z.url({ error: "Upload a course thumbnail" }),
  previewVideo: z.url().optional(),
  price: z.number().min(0),
  discountedPrice: z.number().min(0).optional(),
  duration: z.string().trim().min(1, { error: "Duration is required" }),
  language: z.string().trim().min(1, { error: "Language is required" }),
  level: courseLevelSchema,
  categoryIds: z.array(z.string()).min(1, { error: "Select at least one category" }),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  lessons: z.array(lessonSchema).min(1, { error: "Add at least one lesson" }),
});

export type CourseDraftInput = z.infer<typeof courseDraftSchema>;

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, { error: "Category name is required" }),
});
