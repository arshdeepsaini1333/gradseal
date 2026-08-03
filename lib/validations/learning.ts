import { z } from "zod";

export const updateLessonProgressSchema = z.object({
  lessonId: z.string().min(1),
  scrollPercent: z.number().int().min(0).max(100),
});

export const markLessonCompleteSchema = z.object({
  lessonId: z.string().min(1),
});

export const submitQuizSchema = z.object({
  testId: z.string().min(1),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        optionId: z.string().min(1),
      })
    )
    .min(1, { error: "Answer at least one question" }),
});
