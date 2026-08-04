"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, BookOpen, Award } from "lucide-react";
import { formatPrice, discountPercent, levelLabel } from "./courseFormat";
import WishlistButton from "./WishlistButton";
import type { CatalogCourse } from "@/lib/courses";

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

function FeaturedCard({
  course,
  index,
  isLoggedIn,
  wishlisted,
}: {
  course: CatalogCourse;
  index: number;
  isLoggedIn: boolean;
  wishlisted: boolean;
}) {
  const level = levelLabel[course.level];
  const salePrice = course.discountedPrice ?? course.price;
  const discount = discountPercent(salePrice, course.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-2xl transition-all overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden bg-[#F8FAFC]">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-contain p-10 transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {course.categories.slice(0, 2).map((cat) => (
            <span
              key={cat.id}
              className="px-2.5 py-1 rounded-full bg-white/90 text-[#0F172A] text-[11px] font-semibold shadow-sm"
            >
              {cat.name}
            </span>
          ))}
        </div>

        <WishlistButton
          courseId={course.id}
          courseSlug={course.slug}
          isLoggedIn={isLoggedIn}
          initialWishlisted={wishlisted}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        />

        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-[#2563EB] text-[11px] font-semibold shadow-sm">
          <Award className="w-3 h-3" />
          Certificate
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${levelColors[level]}`}>
            {level}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-[11px] text-[#64748B]">{course.language}</span>
        </div>

        <h3 className="font-bold text-[#0F172A] text-base leading-snug mb-1.5 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs text-[#64748B] leading-relaxed mb-3 line-clamp-2">{course.shortDescription}</p>

        <div className="flex items-center gap-3 mt-3 text-[11px] text-[#64748B]">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {course.totalLessons} lessons
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-[#0F172A] text-lg">{formatPrice(salePrice)}</span>
              {discount > 0 && (
                <span className="text-xs text-[#94A3B8] line-through">{formatPrice(course.price)}</span>
              )}
            </div>
            {discount > 0 && <span className="text-[10px] font-semibold text-emerald-600">{discount}% off</span>}
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedCourses({
  courses,
  viewAllHref,
  isLoggedIn = false,
  wishlistedCourseIds = [],
}: {
  courses: CatalogCourse[];
  viewAllHref?: string;
  isLoggedIn?: boolean;
  wishlistedCourseIds?: string[];
}) {
  if (courses.length === 0) return null;

  const wishlistedSet = new Set(wishlistedCourseIds);

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
            Featured Courses
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Handpicked by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Our Experts
            </span>
          </h2>
          <p className="mt-4 text-[#64748B] text-lg max-w-2xl mx-auto">
            Our most popular and highest-rated certification programs.
          </p>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="mt-6 inline-block px-5 py-2.5 rounded-xl border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white text-sm font-semibold transition-all"
            >
              View All Courses →
            </Link>
          )}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <FeaturedCard
              key={course.id}
              course={course}
              index={index}
              isLoggedIn={isLoggedIn}
              wishlisted={wishlistedSet.has(course.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
