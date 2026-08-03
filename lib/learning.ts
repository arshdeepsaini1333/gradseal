import "server-only";
import { prisma } from "@/lib/prisma";
import type { LearnerCourse, LearnerLesson, QuizForClient } from "@/types/learning";

type CourseTree = NonNullable<Awaited<ReturnType<typeof loadCourseTree>>>;

async function loadCourseTree(slug: string, studentId: string) {
  return prisma.course.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      isPublished: true,
      modules: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              videoUrl: true,
              images: true,
              duration: true,
              position: true,
              isFree: true,
              moduleId: true,
              progresses: {
                where: { studentId },
                select: { watched: true, scrollPercent: true },
                take: 1,
              },
              test: {
                select: {
                  id: true,
                  title: true,
                  passingScore: true,
                  questions: { select: { id: true } },
                  attempts: {
                    where: { studentId, passed: true },
                    select: { id: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

/**
 * Flattens modules into a single lesson sequence and computes, purely
 * server-side, which lessons are locked: lesson 0 is always open, every
 * later lesson requires the previous one to be watched and (if it has a
 * quiz) passed. Never trust a client-supplied lock/completed flag.
 */
function buildLearnerCourse(
  course: CourseTree,
  enrollment: { progress: number; completed: boolean; lastLessonId: string | null }
): LearnerCourse {
  const flatLessons = course.modules.flatMap((mod) => mod.lessons);

  const lessonById = new Map<string, LearnerLesson>();
  let previousCleared = true;

  flatLessons.forEach((lesson, index) => {
    const progress = lesson.progresses[0];
    const completed = progress?.watched ?? false;
    const hasQuiz = lesson.test !== null;
    const quizPassed = hasQuiz ? lesson.test!.attempts.length > 0 : true;

    const locked = index === 0 ? false : !previousCleared;
    previousCleared = !locked && completed && quizPassed;

    lessonById.set(lesson.id, {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      images: lesson.images,
      duration: lesson.duration,
      position: lesson.position,
      isFree: lesson.isFree,
      moduleId: lesson.moduleId,
      locked,
      completed,
      scrollPercent: progress?.scrollPercent ?? 0,
      hasQuiz,
      quizPassed,
      test: lesson.test
        ? {
            id: lesson.test.id,
            title: lesson.test.title,
            passingScore: lesson.test.passingScore,
            questionCount: lesson.test.questions.length,
          }
        : null,
    });
  });

  const totalLessons = flatLessons.length;
  const completedLessons = [...lessonById.values()].filter((l) => l.completed).length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const lastLesson = enrollment.lastLessonId ? lessonById.get(enrollment.lastLessonId) : undefined;
  const resumeLessonId = lastLesson && !lastLesson.locked ? lastLesson.id : (flatLessons[0]?.id ?? null);

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    progressPercent,
    completed: enrollment.completed,
    resumeLessonId,
    modules: course.modules.map((mod) => ({
      id: mod.id,
      title: mod.title,
      position: mod.position,
      lessons: mod.lessons.map((lesson) => lessonById.get(lesson.id)!),
    })),
  };
}

/** Returns null if the course doesn't exist, isn't published, or this student isn't enrolled. */
export async function getCourseForLearner(
  slug: string,
  studentId: string
): Promise<LearnerCourse | null> {
  const course = await loadCourseTree(slug, studentId);
  if (!course || !course.isPublished) return null;

  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId: course.id } },
    select: { progress: true, completed: true, lastLessonId: true },
  });
  if (!enrollment) return null;

  return buildLearnerCourse(course, enrollment);
}

/**
 * Quiz questions/options for a lesson's test, with `isCorrect` deliberately
 * never selected — this data is passed straight to a client component and
 * must not leak the answer key. Returns null if the lesson has no test.
 */
export async function getQuizForLesson(lessonId: string): Promise<QuizForClient | null> {
  return prisma.test.findUnique({
    where: { lessonId },
    select: {
      id: true,
      title: true,
      passingScore: true,
      questions: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          text: true,
          position: true,
          options: {
            orderBy: { position: "asc" },
            select: { id: true, text: true, position: true },
          },
        },
      },
    },
  });
}

export interface LessonAccess {
  locked: boolean;
  watched: boolean;
  scrollPercent: number;
  courseId: string;
  courseSlug: string;
}

/** Same lock computation as getCourseForLearner, keyed by lessonId instead of slug — used by mutating actions that only receive a lessonId from the client. */
export async function getLessonAccess(
  lessonId: string,
  studentId: string
): Promise<LessonAccess | null> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { module: { select: { course: { select: { id: true, slug: true } } } } },
  });
  if (!lesson) return null;

  const course = await getCourseForLearner(lesson.module.course.slug, studentId);
  if (!course) return null;

  const target = course.modules.flatMap((mod) => mod.lessons).find((l) => l.id === lessonId);
  if (!target) return null;

  return {
    locked: target.locked,
    watched: target.completed,
    scrollPercent: target.scrollPercent,
    courseId: lesson.module.course.id,
    courseSlug: lesson.module.course.slug,
  };
}

export async function computeEnrollmentProgress(
  studentId: string,
  courseId: string
): Promise<{ progress: number; completed: boolean }> {
  const [totalLessons, completedLessons] = await Promise.all([
    prisma.lesson.count({ where: { module: { courseId } } }),
    prisma.lessonProgress.count({
      where: { studentId, watched: true, lesson: { module: { courseId } } },
    }),
  ]);

  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  return { progress, completed: totalLessons > 0 && completedLessons === totalLessons };
}
