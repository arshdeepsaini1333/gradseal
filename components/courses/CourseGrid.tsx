"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Clock, Award, X, BookOpen } from "lucide-react";
import { useCourseFilters } from "./CourseFilterProvider";
import { formatPrice, discountPercent, levelLabel } from "./courseFormat";
import type { CatalogCourse } from "@/lib/courses";

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
  course: CatalogCourse;
  onQuickView: (course: CatalogCourse) => void;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const level = levelLabel[course.level];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6 }}
      className="group rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] p-[1.5px] shadow-sm hover:shadow-xl transition-shadow"
    >
      <div className="flex h-full flex-col rounded-[22px] bg-white overflow-hidden">
        <div className="relative h-36 overflow-hidden bg-[#F8FAFC]">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
          />
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 text-[#0F172A] text-[10px] font-semibold shadow-sm">
            {course.categories[0]?.name ?? "General"}
          </span>
          <button
            onClick={() => setBookmarked((v) => !v)}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark course"}
            aria-pressed={bookmarked}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-[#2563EB] text-[#2563EB]" : "text-[#64748B]"}`} />
          </button>
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[#2563EB] text-[10px] font-semibold shadow-sm">
            <Award className="w-3 h-3" />
            Certificate
          </span>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${levelColors[level]}`}>
              {level}
            </span>
          </div>

          <h3 className="font-bold text-[#0F172A] text-sm leading-snug mb-1.5 line-clamp-2">{course.title}</h3>
          <p className="text-[11px] text-[#64748B] mb-2 line-clamp-2">{course.shortDescription}</p>

          <div className="flex items-center gap-3 mt-2 text-[10px] text-[#64748B]">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {course.totalLessons} lessons
            </span>
          </div>

          <div className="mt-auto pt-3 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-[#0F172A] text-sm">{formatPrice(course.discountedPrice ?? course.price)}</span>
              {course.discountedPrice && (
                <span className="text-[10px] text-[#94A3B8] line-through">{formatPrice(course.price)}</span>
              )}
            </div>
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

function QuickViewModal({ course, onClose }: { course: CatalogCourse; onClose: () => void }) {
  const level = levelLabel[course.level];
  const discount = discountPercent(course.discountedPrice ?? course.price, course.price);

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
        <div className="relative h-40 bg-[#F8FAFC] flex items-center justify-center">
          <Image src={course.thumbnail} alt={course.title} fill className="object-contain p-10" />
          <button
            onClick={onClose}
            aria-label="Close quick view"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform z-10"
          >
            <X className="w-4 h-4 text-[#0F172A]" />
          </button>
        </div>
        <div className="p-6">
          <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 ${levelColors[level]}`}>
            {level} · {course.categories.map((c) => c.name).join(", ")}
          </span>
          <h3 className="text-xl font-extrabold text-[#0F172A] mb-2">{course.title}</h3>
          <p className="text-sm text-[#64748B] leading-relaxed mb-4">{course.shortDescription}</p>

          <div className="grid grid-cols-2 gap-3 mb-5 text-center">
            <div className="rounded-xl bg-[#F8FAFC] p-3">
              <Clock className="w-4 h-4 text-[#2563EB] mx-auto mb-1" />
              <p className="text-xs font-semibold text-[#0F172A]">{course.duration}</p>
            </div>
            <div className="rounded-xl bg-[#F8FAFC] p-3">
              <BookOpen className="w-4 h-4 text-[#2563EB] mx-auto mb-1" />
              <p className="text-xs font-semibold text-[#0F172A]">{course.totalLessons} lessons</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-extrabold text-[#0F172A]">
                {formatPrice(course.discountedPrice ?? course.price)}
              </span>
              {course.discountedPrice && (
                <>
                  <span className="ml-2 text-sm text-[#94A3B8] line-through">{formatPrice(course.price)}</span>
                  {discount > 0 && <span className="ml-2 text-xs font-semibold text-emerald-600">{discount}% off</span>}
                </>
              )}
            </div>
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
  const { filteredCourses, categories: selectedCategories } = useCourseFilters();
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewCourse, setQuickViewCourse] = useState<CatalogCourse | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="browse-courses" className="py-8 scroll-mt-32">
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          {selectedCategories.length > 0 ? (
            <>
              <p className="text-4xl mb-4">🚧</p>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Coming soon</h3>
              <p className="text-[#64748B]">
                We don&apos;t have a course in{" "}
                <span className="font-semibold text-[#0F172A]">{selectedCategories.join(", ")}</span> yet — check
                back soon, or browse another category.
              </p>
            </>
          ) : (
            <>
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">No courses found</h3>
              <p className="text-[#64748B]">Try adjusting your search or filters.</p>
            </>
          )}
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
