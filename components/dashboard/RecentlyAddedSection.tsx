import Link from "next/link";
import DashboardCourseCard from "@/components/dashboard/DashboardCourseCard";
import type { Course } from "@/types";

interface RecentlyAddedSectionProps {
  courses: Course[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecentlyAddedSection({ courses }: RecentlyAddedSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Recently Added</h2>
          <p className="mt-1 text-sm text-[#64748B]">Freshly published on GradSeal.</p>
        </div>
        <Link
          href="/courses"
          className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <DashboardCourseCard
            key={course.id}
            course={course}
            badge="🆕 New"
            footerNote={`Added ${formatDate(course.createdAt)}`}
          />
        ))}
      </div>
    </section>
  );
}
