"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { mockCourses, categories } from "@/lib/mockCourses";
import type { Course } from "@/types/course-catalog";

export const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"] as const;
export const DURATION_OPTIONS = [
  { id: "short", label: "Under 6 Weeks", test: (w: number) => w < 6 },
  { id: "medium", label: "6–10 Weeks", test: (w: number) => w >= 6 && w <= 10 },
  { id: "long", label: "Over 10 Weeks", test: (w: number) => w > 10 },
] as const;
export const LANGUAGE_OPTIONS = ["English", "Hindi", "English, Hindi"] as const;
export const PRICE_OPTIONS = [
  { id: "under-4k", label: "Under ₹4,000", test: (p: number) => p < 4000 },
  { id: "4k-8k", label: "₹4,000 – ₹8,000", test: (p: number) => p >= 4000 && p <= 8000 },
  { id: "above-8k", label: "Above ₹8,000", test: (p: number) => p > 8000 },
] as const;
export const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular" },
  { id: "newest", label: "Newest" },
  { id: "rating", label: "Highest Rated" },
  { id: "duration", label: "Duration" },
  { id: "price", label: "Price" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

interface FilterState {
  search: string;
  category: string | null;
  difficulty: string | null;
  duration: string | null;
  language: string | null;
  price: string | null;
  sort: SortId;
}

interface CourseFilterContextValue extends FilterState {
  setSearch: (v: string) => void;
  setCategory: (v: string | null) => void;
  setDifficulty: (v: string | null) => void;
  setDuration: (v: string | null) => void;
  setLanguage: (v: string | null) => void;
  setPrice: (v: string | null) => void;
  setSort: (v: SortId) => void;
  clearFilters: () => void;
  activeChips: { key: string; label: string; onRemove: () => void }[];
  filteredCourses: Course[];
  totalCount: number;
}

const initialState: FilterState = {
  search: "",
  category: null,
  difficulty: null,
  duration: null,
  language: null,
  price: null,
  sort: "popular",
};

const CourseFilterContext = createContext<CourseFilterContextValue | null>(null);

export function CourseFilterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FilterState>(initialState);

  const setSearch = (v: string) => setState((s) => ({ ...s, search: v }));
  const setCategory = (v: string | null) => setState((s) => ({ ...s, category: v }));
  const setDifficulty = (v: string | null) => setState((s) => ({ ...s, difficulty: v }));
  const setDuration = (v: string | null) => setState((s) => ({ ...s, duration: v }));
  const setLanguage = (v: string | null) => setState((s) => ({ ...s, language: v }));
  const setPrice = (v: string | null) => setState((s) => ({ ...s, price: v }));
  const setSort = (v: SortId) => setState((s) => ({ ...s, sort: v }));
  const clearFilters = () => setState(initialState);

  const filteredCourses = useMemo(() => {
    const durationDef = DURATION_OPTIONS.find((d) => d.id === state.duration);
    const priceDef = PRICE_OPTIONS.find((p) => p.id === state.price);
    const query = state.search.trim().toLowerCase();

    let result = mockCourses.filter((course) => {
      if (query && !course.title.toLowerCase().includes(query) && !course.category.toLowerCase().includes(query)) {
        return false;
      }
      if (state.category && course.category !== state.category) return false;
      if (state.difficulty && course.level !== state.difficulty) return false;
      if (durationDef && !durationDef.test(course.durationWeeks)) return false;
      if (state.language && course.language !== state.language) return false;
      if (priceDef && !priceDef.test(course.price)) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (state.sort) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "rating":
          return b.rating - a.rating;
        case "duration":
          return a.durationWeeks - b.durationWeeks;
        case "price":
          return a.price - b.price;
        case "popular":
        default:
          return b.studentsEnrolled - a.studentsEnrolled;
      }
    });

    return result;
  }, [state]);

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (state.search) chips.push({ key: "search", label: `"${state.search}"`, onRemove: () => setSearch("") });
    if (state.category) chips.push({ key: "category", label: state.category, onRemove: () => setCategory(null) });
    if (state.difficulty) chips.push({ key: "difficulty", label: state.difficulty, onRemove: () => setDifficulty(null) });
    if (state.duration) {
      const def = DURATION_OPTIONS.find((d) => d.id === state.duration);
      if (def) chips.push({ key: "duration", label: def.label, onRemove: () => setDuration(null) });
    }
    if (state.language) chips.push({ key: "language", label: state.language, onRemove: () => setLanguage(null) });
    if (state.price) {
      const def = PRICE_OPTIONS.find((p) => p.id === state.price);
      if (def) chips.push({ key: "price", label: def.label, onRemove: () => setPrice(null) });
    }
    return chips;
  }, [state]);

  const value: CourseFilterContextValue = {
    ...state,
    setSearch,
    setCategory,
    setDifficulty,
    setDuration,
    setLanguage,
    setPrice,
    setSort,
    clearFilters,
    activeChips,
    filteredCourses,
    totalCount: mockCourses.length,
  };

  return <CourseFilterContext.Provider value={value}>{children}</CourseFilterContext.Provider>;
}

export function useCourseFilters(): CourseFilterContextValue {
  const ctx = useContext(CourseFilterContext);
  if (!ctx) throw new Error("useCourseFilters must be used within a CourseFilterProvider");
  return ctx;
}

export const filterCategoryNames = categories.map((c) => c.name);
