import type { Metadata } from "next";
import EnrolledCourseCard from "@/components/dashboard/EnrolledCourseCard";
import { continueLearningCourses } from "@/lib/mock-dashboard-data";

export const metadata: Metadata = { title: "My Learning – GradSeal" };

export default function MyLearningPage() {
  const courses = continueLearningCourses;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">My Learning</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          All the courses you&apos;re enrolled in, in one place.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <p className="text-[#0F172A] font-semibold">You haven&apos;t enrolled in any courses yet.</p>
          <p className="mt-1.5 text-sm text-[#64748B]">
            Head over to the course catalog to start your first certification.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <EnrolledCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
