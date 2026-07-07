"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { courses } from "@/lib/data";
import type { Course } from "@/types";

const difficultyColors: Record<Course["difficulty"], string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

const categoryEmojis: Record<string, string> = {
  "Personal Training": "🏋️",
  Nutrition: "🥗",
  Yoga: "🧘",
  Sports: "⚡",
  "Gym Training": "💪",
  "Physical Education": "🏃",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-amber-400" : "text-slate-200"} fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs font-medium text-[#64748B] ml-1">
        {rating.toFixed(1)} ({(courses.find(c => c.rating === rating)?.reviewCount ?? 0).toLocaleString()})
      </span>
    </div>
  );
}

function CourseCard({ course, index }: { course: Course; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
    >
      {/* Course image / gradient placeholder */}
      <div className="relative h-44 bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center">
        <span className="text-6xl">
          {categoryEmojis[course.category] ?? "📚"}
        </span>
        {course.hasCertificate && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-[#2563EB] text-xs font-semibold shadow-sm">
            🏅 Certificate
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Category + Difficulty */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-[#64748B] font-medium">{course.category}</span>
          <span className="text-slate-300">·</span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColors[course.difficulty]}`}
          >
            {course.difficulty}
          </span>
        </div>

        <h3 className="font-bold text-[#0F172A] text-base leading-snug mb-2">
          {course.title}
        </h3>
        <p className="text-xs text-[#64748B] leading-relaxed mb-3 flex-1">
          {course.description}
        </p>

        {/* Duration + Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.duration}
          </div>
          <StarRating rating={course.rating} />
        </div>

        <Link
          href={`/courses/${course.slug}`}
          className="w-full text-center py-2.5 rounded-xl bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white text-sm font-semibold transition-all"
        >
          Explore Course →
        </Link>
      </div>
    </motion.div>
  );
}

export default function CoursePreview() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-3">
              Featured Courses
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              Start Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#60A5FA]">
                Journey Today
              </span>
            </h2>
            <p className="mt-3 text-[#64748B]">
              Explore our most popular professional certification courses.
            </p>
          </div>
          <Link
            href="/courses"
            className="shrink-0 px-5 py-2.5 rounded-xl border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white text-sm font-semibold transition-all"
          >
            View All Courses →
          </Link>
        </motion.div>

        {/* Course grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
