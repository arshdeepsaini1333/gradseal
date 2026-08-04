import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth/session";
import { getCourseForLearner, getQuizForLesson } from "@/lib/learning";
import LearnSidebar from "@/components/learn/LearnSidebar";
import LessonView from "@/components/learn/LessonView";
import RightRail from "@/components/learn/RightRail";
import type { LearnerLessonDetail } from "@/types/learning";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const student = await getStudentSession();
  if (!student) return { title: "Learning – GradSeal" };

  const course = await getCourseForLearner(slug, student.id);
  const lesson = course?.modules.flatMap((mod) => mod.lessons).find((l) => l.id === lessonId);
  return { title: lesson ? `${lesson.title} – GradSeal` : "Learning – GradSeal" };
}

export default async function LearnLessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;

  const student = await getStudentSession();
  if (!student) redirect("/student/login");

  const course = await getCourseForLearner(slug, student.id);
  if (!course) notFound();

  const flatLessons = course.modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({ ...lesson, moduleTitle: mod.title }))
  );
  const index = flatLessons.findIndex((lesson) => lesson.id === lessonId);
  if (index === -1 || flatLessons[index].locked) notFound();

  const lesson = flatLessons[index];
  const quiz = lesson.hasQuiz ? await getQuizForLesson(lesson.id) : null;

  const lessonDetail: LearnerLessonDetail = {
    ...lesson,
    quiz,
    nextLessonId: flatLessons[index + 1]?.id ?? null,
  };

  return (
    <div className="flex">
      <LearnSidebar course={course} currentLessonId={lessonId} />
      <main className="min-w-0 flex-1">
        <LessonView key={lessonId} courseSlug={slug} lesson={lessonDetail} />
      </main>
      <RightRail
        course={course}
        lesson={lessonDetail}
        studentName={`${student.firstName} ${student.lastName}`}
      />
    </div>
  );
}
