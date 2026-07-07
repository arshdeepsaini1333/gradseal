import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
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
          href="/student/dashboard/my-learning"
          className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-28 bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white/90 text-sm font-semibold">
              {course.category}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#0F172A] leading-snug">{course.title}</h3>
              <p className="mt-1 text-sm text-[#64748B]">{course.instructor}</p>

              <div className="mt-4">
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#2563EB]"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs font-semibold text-[#64748B]">
                  {course.progressPercent}% Complete
                </p>
              </div>

              <Link href={`/student/dashboard/learn/${course.slug}`} className="block mt-4">
                <Button variant="primary" className="w-full">
                  Continue
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
