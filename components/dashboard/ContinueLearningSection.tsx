import Link from "next/link";
import EnrolledCourseCard from "@/components/dashboard/EnrolledCourseCard";
import type { ContinueLearningCourse } from "@/types/dashboard";

interface ContinueLearningSectionProps {
  courses: ContinueLearningCourse[];
}

export default function ContinueLearningSection({ courses }: ContinueLearningSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#0F172A]">Continue Learning</h2>
        <Link
          href="/student/my-learning"
          className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <EnrolledCourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
