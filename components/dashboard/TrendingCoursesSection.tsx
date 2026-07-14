import Link from "next/link";
import DashboardCourseCard from "@/components/dashboard/DashboardCourseCard";
import type { Course } from "@/types";

interface TrendingCoursesSectionProps {
  courses: Course[];
}

export default function TrendingCoursesSection({ courses }: TrendingCoursesSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Trending Courses</h2>
          <p className="mt-1 text-sm text-[#64748B]">Most purchased by learners on GradSeal.</p>
        </div>
        <Link
          href="/courses"
          className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <DashboardCourseCard
            key={course.id}
            course={course}
            badge={`🔥 #${index + 1} Trending`}
            footerNote={`${course.purchaseCount.toLocaleString()}+ students enrolled`}
          />
        ))}
      </div>
    </section>
  );
}
