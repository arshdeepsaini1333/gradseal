"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { CatalogCourse } from "@/lib/courses";

interface CourseFilterContextValue {
  /** Selected category names. Empty = "All" — every course shows. A course matches if it belongs to ANY selected category (union, not intersection). */
  categories: string[];
  toggleCategory: (name: string) => void;
  clearCategories: () => void;
  filteredCourses: CatalogCourse[];
  totalCount: number;
}

const CourseFilterContext = createContext<CourseFilterContextValue | null>(null);

export function CourseFilterProvider({
  courses,
  children,
}: {
  courses: CatalogCourse[];
  children: ReactNode;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  const toggleCategory = (name: string) =>
    setCategories((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));
  const clearCategories = () => setCategories([]);

  const filteredCourses = useMemo(() => {
    const result =
      categories.length === 0
        ? courses
        : courses.filter((course) => course.categories.some((c) => categories.includes(c.name)));

    return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [courses, categories]);

  const value: CourseFilterContextValue = {
    categories,
    toggleCategory,
    clearCategories,
    filteredCourses,
    totalCount: courses.length,
  };

  return <CourseFilterContext.Provider value={value}>{children}</CourseFilterContext.Provider>;
}

export function useCourseFilters(): CourseFilterContextValue {
  const ctx = useContext(CourseFilterContext);
  if (!ctx) throw new Error("useCourseFilters must be used within a CourseFilterProvider");
  return ctx;
}
