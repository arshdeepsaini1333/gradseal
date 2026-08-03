import { notFound, redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth/session";
import { getCourseForLearner } from "@/lib/learning";

export default async function LearnResumePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const student = await getStudentSession();
  if (!student) redirect("/student/login");

  const course = await getCourseForLearner(slug, student.id);
  if (!course) notFound();

  if (!course.resumeLessonId) notFound();

  redirect(`/student/learn/${slug}/${course.resumeLessonId}`);
}
