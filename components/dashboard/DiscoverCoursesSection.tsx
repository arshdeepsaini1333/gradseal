import Link from "next/link";
import DashboardCourseCard from "@/components/dashboard/DashboardCourseCard";
import type { Course } from "@/types";

interface DiscoverCoursesSectionProps {
  courses: Course[];
}

export default function DiscoverCoursesSection({ courses }: DiscoverCoursesSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Discover New Courses</h2>
          <p className="mt-1 text-sm text-[#64748B]">Certifications you haven&apos;t explored yet.</p>
        </div>
        <Link
          href="/courses"
          className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
        >
          Browse All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <DashboardCourseCard key={course.id} course={course} badge="New to You" />
        ))}
      </div>
    </section>
  );
}
