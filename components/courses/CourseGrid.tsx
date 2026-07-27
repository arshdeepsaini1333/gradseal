"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Clock, Users, Award, X, BookOpen } from "lucide-react";
import { getInstructor } from "@/lib/mockCourses";
import { useCourseFilters } from "./CourseFilterProvider";
import { formatPrice, formatCount } from "./courseFormat";
import StarRating from "./StarRating";
import type { Course } from "@/types/course-catalog";

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white overflow-hidden">
      <div className="h-40 animate-shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 rounded animate-shimmer" />
        <div className="h-4 w-4/5 rounded animate-shimmer" />
        <div className="h-3 w-full rounded animate-shimmer" />
        <div className="h-8 w-full rounded-xl animate-shimmer mt-4" />
      </div>
    </div>
  );
}

function CourseCard({
  course,
  onQuickView,
}: {
  course: Course;
  onQuickView: (course: Course) => void;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const instructor = getInstructor(course.instructorId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6 }}
      className={`group rounded-3xl bg-gradient-to-br ${course.gradient} p-[1.5px] shadow-sm hover:shadow-xl transition-shadow`}
    >
      <div className="flex h-full flex-col rounded-[22px] bg-white overflow-hidden">
        <div className={`relative h-36 overflow-hidden bg-gradient-to-br ${course.gradient}`}>
          <span className="absolute inset-0 flex items-center justify-center text-5xl transition-transform duration-500 group-hover:scale-110">
            {course.icon}
          </span>
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 text-[#0F172A] text-[10px] font-semibold shadow-sm">
            {course.category}
          </span>
          <button
            onClick={() => setBookmarked((v) => !v)}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark course"}
            aria-pressed={bookmarked}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-[#2563EB] text-[#2563EB]" : "text-[#64748B]"}`} />
          </button>
          {course.hasCertificate && (
            <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[#2563EB] text-[10px] font-semibold shadow-sm">
              <Award className="w-3 h-3" />
              Certificate
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${levelColors[course.level]}`}>
              {course.level}
            </span>
          </div>

          <h3 className="font-bold text-[#0F172A] text-sm leading-snug mb-1.5 line-clamp-2">{course.title}</h3>
          <p className="text-[11px] text-[#64748B] mb-2 truncate">{instructor.name}</p>

          <StarRating rating={course.rating} size="sm" />

          <div className="flex items-center gap-3 mt-2 text-[10px] text-[#64748B]">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-3 h-3" />
              {formatCount(course.studentsEnrolled)}
            </span>
          </div>

          <div className="mt-auto pt-3 flex items-center justify-between gap-2">
            <span className="font-extrabold text-[#0F172A] text-sm">{formatPrice(course.price)}</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onQuickView(course)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] text-[11px] font-semibold transition-colors"
              >
                Quick View
              </button>
              <Link
                href={`/courses/${course.slug}`}
                className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-bold transition-colors"
              >
                Enroll
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function QuickViewModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const instructor = getInstructor(course.instructorId);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className={`relative h-40 bg-gradient-to-br ${course.gradient} flex items-center justify-center text-6xl`}>
          {course.icon}
          <button
            onClick={onClose}
            aria-label="Close quick view"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <X className="w-4 h-4 text-[#0F172A]" />
          </button>
        </div>
        <div className="p-6">
          <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 ${levelColors[course.level]}`}>
            {course.level} · {course.category}
          </span>
          <h3 className="text-xl font-extrabold text-[#0F172A] mb-2">{course.title}</h3>
          <p className="text-sm text-[#64748B] leading-relaxed mb-4">{course.description}</p>

          <div className="flex items-center gap-2 mb-4">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: instructor.color }}
            >
              {instructor.initials}
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">{instructor.name}</p>
              <p className="text-xs text-[#64748B]">{instructor.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5 text-center">
            <div className="rounded-xl bg-[#F8FAFC] p-3">
              <Clock className="w-4 h-4 text-[#2563EB] mx-auto mb-1" />
              <p className="text-xs font-semibold text-[#0F172A]">{course.duration}</p>
            </div>
            <div className="rounded-xl bg-[#F8FAFC] p-3">
              <BookOpen className="w-4 h-4 text-[#2563EB] mx-auto mb-1" />
              <p className="text-xs font-semibold text-[#0F172A]">{course.lessons} lessons</p>
            </div>
            <div className="rounded-xl bg-[#F8FAFC] p-3">
              <Users className="w-4 h-4 text-[#2563EB] mx-auto mb-1" />
              <p className="text-xs font-semibold text-[#0F172A]">{formatCount(course.studentsEnrolled)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-[#0F172A]">{formatPrice(course.price)}</span>
            <Link
              href={`/courses/${course.slug}`}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all"
            >
              View Full Course
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CourseGrid() {
  const { filteredCourses } = useCourseFilters();
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewCourse, setQuickViewCourse] = useState<Course | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="browse-courses" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 scroll-mt-32">
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <h3 className="text-xl font-bold text-[#0F172A] mb-2">No courses found</h3>
          <p className="text-[#64748B]">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onQuickView={setQuickViewCourse} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {quickViewCourse && (
          <QuickViewModal course={quickViewCourse} onClose={() => setQuickViewCourse(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
