import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth/session";
import { getCourseForLearner } from "@/lib/learning";

export const metadata: Metadata = { title: "Learning – GradSeal" };

export default async function LearnLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const student = await getStudentSession();
  if (!student) redirect("/student/login");

  const course = await getCourseForLearner(slug, student.id);
  if (!course) notFound();

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-100 bg-white/95 px-4 backdrop-blur sm:px-6">
        <Link
          href="/student/my-learning"
          className="ml-10 text-sm font-semibold text-[#64748B] hover:text-[#2563EB] lg:ml-0"
        >
          &larr; Back to My Learning
        </Link>
        <span className="truncate font-bold text-[#0F172A]">{course.title}</span>
      </header>
      {children}
    </div>
  );
}
