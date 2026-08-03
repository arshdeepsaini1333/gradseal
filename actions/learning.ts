"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/auth/session";
import { getLessonAccess, computeEnrollmentProgress } from "@/lib/learning";
import {
  updateLessonProgressSchema,
  markLessonCompleteSchema,
  submitQuizSchema,
} from "@/lib/validations/learning";
import type { QuizResult } from "@/types/learning";

async function requireStudent() {
  const session = await getStudentSession();
  if (!session) redirect("/student/login");
  return session;
}

function revalidateLearnSurfaces(courseSlug: string) {
  revalidatePath(`/student/learn/${courseSlug}`, "layout");
  revalidatePath("/student/my-learning");
}

export async function updateLessonProgress(input: unknown): Promise<void> {
  const session = await requireStudent();
  const parsed = updateLessonProgressSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  const { lessonId, scrollPercent } = parsed.data;

  const access = await getLessonAccess(lessonId, session.id);
  if (!access || access.locked) throw new Error("This lesson is locked.");

  await prisma.$transaction([
    prisma.lessonProgress.upsert({
      where: { lessonId_studentId: { lessonId, studentId: session.id } },
      create: { lessonId, studentId: session.id, scrollPercent },
      update: { scrollPercent: Math.max(scrollPercent, access.scrollPercent) },
    }),
    prisma.enrollment.update({
      where: { studentId_courseId: { studentId: session.id, courseId: access.courseId } },
      data: { lastLessonId: lessonId, lastAccessedAt: new Date() },
    }),
  ]);
}

export async function markLessonComplete(input: unknown): Promise<void> {
  const session = await requireStudent();
  const parsed = markLessonCompleteSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  const { lessonId } = parsed.data;

  const access = await getLessonAccess(lessonId, session.id);
  if (!access || access.locked) throw new Error("This lesson is locked.");
  if (access.scrollPercent < 95) {
    throw new Error("Finish reading the lesson before marking it complete.");
  }

  await prisma.lessonProgress.upsert({
    where: { lessonId_studentId: { lessonId, studentId: session.id } },
    create: {
      lessonId,
      studentId: session.id,
      watched: true,
      watchedAt: new Date(),
      scrollPercent: 100,
    },
    update: { watched: true, watchedAt: new Date() },
  });

  const { progress, completed } = await computeEnrollmentProgress(session.id, access.courseId);
  await prisma.enrollment.update({
    where: { studentId_courseId: { studentId: session.id, courseId: access.courseId } },
    data: {
      progress,
      completed,
      completedAt: completed ? new Date() : null,
      lastLessonId: lessonId,
      lastAccessedAt: new Date(),
    },
  });

  revalidateLearnSurfaces(access.courseSlug);
}

export async function submitQuiz(input: unknown): Promise<QuizResult> {
  const session = await requireStudent();
  const parsed = submitQuizSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  const { testId, answers } = parsed.data;

  const test = await prisma.test.findUnique({
    where: { id: testId },
    select: {
      passingScore: true,
      lesson: {
        select: { id: true, module: { select: { course: { select: { slug: true } } } } },
      },
      questions: {
        select: { id: true, options: { select: { id: true, isCorrect: true } } },
      },
    },
  });
  if (!test) throw new Error("Quiz not found.");

  const access = await getLessonAccess(test.lesson.id, session.id);
  if (!access || access.locked) throw new Error("This lesson is locked.");
  if (!access.watched) throw new Error("Complete the lesson before taking the quiz.");

  const answerMap = new Map(answers.map((a) => [a.questionId, a.optionId]));
  let correctCount = 0;
  for (const question of test.questions) {
    const chosenOptionId = answerMap.get(question.id);
    const correctOption = question.options.find((o) => o.isCorrect);
    if (chosenOptionId && correctOption && chosenOptionId === correctOption.id) {
      correctCount += 1;
    }
  }

  const score =
    test.questions.length > 0 ? Math.round((correctCount / test.questions.length) * 100) : 0;
  const passed = score >= test.passingScore;

  await prisma.quizAttempt.create({
    data: {
      testId,
      studentId: session.id,
      score,
      passed,
      answers: Object.fromEntries(answerMap),
    },
  });

  revalidateLearnSurfaces(test.lesson.module.course.slug);

  return { score, passed, passingScore: test.passingScore };
}
