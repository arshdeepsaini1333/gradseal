"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCourseFilters } from "./CourseFilterProvider";
import CourseGrid from "./CourseGrid";
import type { CatalogCategory } from "@/lib/courses";

export default function CategorySection({ categories }: { categories: CatalogCategory[] }) {
  const { categories: selected, toggleCategory, clearCategories } = useCourseFilters();
  const allSelected = selected.length === 0;

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
            Course Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Specialization
            </span>
          </h2>
          <p className="mt-4 text-[#64748B] text-lg max-w-2xl mx-auto">
            Select a category to filter the courses below.
          </p>
        </motion.div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={clearCategories}
            aria-pressed={allSelected}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap ${
              allSelected
                ? "border-transparent bg-[#2563EB] text-white shadow-sm"
                : "border-slate-200 bg-white text-[#0F172A] hover:border-[#2563EB]/40 hover:bg-[#2563EB]/5"
            }`}
          >
            {allSelected && <Check className="w-3.5 h-3.5" />}
            All Courses
          </button>

          {categories.map((cat) => {
            const isSelected = selected.includes(cat.name);
            const hasCourses = cat.courseCount > 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.name)}
                aria-pressed={isSelected}
                className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? "border-transparent bg-[#2563EB] text-white shadow-sm"
                    : "border-slate-200 bg-white text-[#0F172A] hover:border-[#2563EB]/40 hover:bg-[#2563EB]/5"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {cat.name}
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : hasCourses
                        ? "bg-[#2563EB]/10 text-[#2563EB]"
                        : "bg-slate-100 text-[#94A3B8]"
                  }`}
                >
                  {hasCourses ? `${cat.courseCount} course${cat.courseCount === 1 ? "" : "s"}` : "Soon"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <CourseGrid />
        </div>
      </div>
    </section>
  );
}
