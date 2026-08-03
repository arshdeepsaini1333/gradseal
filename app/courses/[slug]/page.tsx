import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Award, BookOpen, Clock, Globe, ListChecks } from "lucide-react";
import AppNavbar from "@/components/navbar/AppNavbar";
import Footer from "@/components/Footer";
import { getCourseBySlug } from "@/lib/courses";
import { formatPrice, discountPercent } from "@/components/courses/courseFormat";
import { getStudentSession } from "@/lib/auth/session";
import { isEnrolled } from "@/lib/enrollments";
import { isCourseInCart } from "@/lib/cart";
import CourseBuyBox from "@/components/checkout/CourseBuyBox";

const levelLabel: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const levelColors: Record<string, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-700",
  INTERMEDIATE: "bg-amber-100 text-amber-700",
  ADVANCED: "bg-red-100 text-red-700",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course Not Found – GradSeal" };
  return {
    title: `${course.title} – GradSeal`,
    description: course.shortDescription,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const student = await getStudentSession();
  const [enrolled, inCart] = student
    ? await Promise.all([isEnrolled(student.id, course.id), isCourseInCart(student.id, course.id)])
    : [false, false];

  const salePrice = course.discountedPrice ?? course.price;
  const discount = discountPercent(salePrice, course.price);

  return (
    <>
      <AppNavbar />
      <main className="flex-1 bg-white pt-16">
        <section className="bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#ECFEFF] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelColors[course.level]}`}>
                  {levelLabel[course.level]}
                </span>
                {course.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-[#2563EB] shadow-sm"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] leading-tight">
                {course.title}
              </h1>
              <p className="mt-4 text-lg text-[#64748B] leading-relaxed">{course.shortDescription}</p>

              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-[#64748B]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {course.totalLessons} lessons
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  {course.language}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#2563EB] font-semibold">
                  <Award className="w-4 h-4" />
                  Certificate included
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#0F172A]">{formatPrice(salePrice)}</span>
                  {discount > 0 && (
                    <>
                      <span className="text-base text-[#94A3B8] line-through">{formatPrice(course.price)}</span>
                      <span className="text-sm font-semibold text-emerald-600">{discount}% off</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <CourseBuyBox
                  courseId={course.id}
                  courseSlug={course.slug}
                  isLoggedIn={student !== null}
                  isEnrolled={enrolled}
                  initialInCart={inCart}
                />
              </div>
            </div>

            <div className="relative h-72 sm:h-96 rounded-3xl bg-white shadow-lg border border-slate-100 overflow-hidden">
              <Image src={course.thumbnail} alt={course.title} fill className="object-contain p-16" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-extrabold text-[#0F172A] mb-3">About this course</h2>
          <p className="text-[#64748B] leading-relaxed whitespace-pre-line">{course.description}</p>
        </section>

        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-24">
          <h2 className="text-2xl font-extrabold text-[#0F172A] mb-6">Curriculum</h2>
          <div className="space-y-4">
            {course.modules.flatMap((mod) => mod.lessons).map((lesson, i) => (
              <div
                key={lesson.id}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#2563EB]/10 text-[#2563EB] font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-[#0F172A]">{lesson.title}</h3>
                  {lesson.description && (
                    <p className="mt-1 text-sm text-[#64748B] leading-relaxed">{lesson.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {lesson.duration} min
                    </span>
                    {lesson.test && (
                      <span className="inline-flex items-center gap-1">
                        <ListChecks className="w-3.5 h-3.5" />
                        Quiz &middot; {lesson.test.questionCount} questions
                      </span>
                    )}
                    {lesson.isFree && (
                      <span className="font-semibold text-emerald-600">Free preview</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
