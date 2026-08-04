import Link from "next/link";
import { categoryEmojis, difficultyColors } from "@/lib/data";
import WishlistButton from "@/components/courses/WishlistButton";
import type { Course } from "@/types";

interface DashboardCourseCardProps {
  course: Course;
  badge?: string;
  footerNote?: string;
  wishlisted?: boolean;
}

export default function DashboardCourseCard({
  course,
  badge,
  footerNote,
  wishlisted = false,
}: DashboardCourseCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      <div className="relative h-32 bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center">
        <span className="text-5xl">{categoryEmojis[course.category] ?? "📚"}</span>
        <WishlistButton
          courseId={course.id}
          courseSlug={course.slug}
          isLoggedIn
          initialWishlisted={wishlisted}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        />
        {badge && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-[#2563EB] text-xs font-semibold shadow-sm">
            {badge}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-[#64748B] font-medium">{course.category}</span>
          <span className="text-slate-300">·</span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColors[course.difficulty]}`}
          >
            {course.difficulty}
          </span>
        </div>

        <h3 className="font-bold text-[#0F172A] leading-snug mb-2">{course.title}</h3>

        {footerNote && <p className="text-xs text-[#64748B] mb-4">{footerNote}</p>}

        <Link
          href={`/courses/${course.slug}`}
          className="mt-auto w-full text-center py-2.5 rounded-xl bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white text-sm font-semibold transition-all"
        >
          View Course →
        </Link>
      </div>
    </div>
  );
}
