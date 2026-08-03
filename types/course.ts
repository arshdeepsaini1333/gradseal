import type { z } from "zod";
import type {
  courseDraftSchema,
  lessonSchema,
  testSchema,
  questionSchema,
  answerOptionSchema,
  courseLevelSchema,
} from "@/lib/validations/admin-course";

export type CourseDraft = z.infer<typeof courseDraftSchema>;
export type LessonDraft = z.infer<typeof lessonSchema>;
export type TestDraft = z.infer<typeof testSchema>;
export type QuestionDraft = z.infer<typeof questionSchema>;
export type AnswerOptionDraft = z.infer<typeof answerOptionSchema>;
export type CourseLevelValue = z.infer<typeof courseLevelSchema>;

export interface CourseCategoryOption {
  id: string;
  name: string;
}

export type UploadKind = "thumbnail" | "preview-video" | "lesson-video" | "lesson-image";
