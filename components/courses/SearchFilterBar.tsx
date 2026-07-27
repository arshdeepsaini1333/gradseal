"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import {
  useCourseFilters,
  DIFFICULTY_OPTIONS,
  DURATION_OPTIONS,
  LANGUAGE_OPTIONS,
  PRICE_OPTIONS,
  SORT_OPTIONS,
  filterCategoryNames,
  type SortId,
} from "./CourseFilterProvider";

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#64748B]">
      {label}
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function SearchFilterBar() {
  const {
    search, setSearch,
    category, setCategory,
    difficulty, setDifficulty,
    duration, setDuration,
    language, setLanguage,
    price, setPrice,
    sort, setSort,
    clearFilters,
    activeChips,
    filteredCourses,
    totalCount,
  } = useCourseFilters();

  const [panelOpen, setPanelOpen] = useState(false);
  const filtersCount = activeChips.filter((c) => c.key !== "search").length;

  return (
    <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, categories..."
              aria-label="Search courses"
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Filters toggle */}
            <button
              onClick={() => setPanelOpen((v) => !v)}
              aria-expanded={panelOpen}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-[#0F172A] hover:border-[#2563EB] transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {filtersCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold">
                  {filtersCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <label className="hidden sm:flex items-center gap-2 text-sm">
              <ArrowUpDown className="w-4 h-4 text-[#64748B]" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortId)}
                aria-label="Sort courses"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {panelOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPanelOpen(false)}
                className="fixed inset-0 z-30 bg-black/20 sm:hidden"
                aria-hidden
              />
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed inset-x-0 bottom-0 z-40 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:static sm:z-auto sm:mt-4 sm:max-h-none sm:overflow-visible sm:rounded-2xl sm:border sm:border-slate-100 sm:p-5 sm:shadow-md"
              >
                <div className="flex items-center justify-between mb-4 sm:hidden">
                  <p className="font-bold text-[#0F172A]">Filters</p>
                  <button onClick={() => setPanelOpen(false)} aria-label="Close filters">
                    <X className="w-5 h-5 text-[#64748B]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <FilterSelect label="Category" value={category} onChange={setCategory} options={filterCategoryNames} />
                  <FilterSelect
                    label="Difficulty"
                    value={difficulty}
                    onChange={setDifficulty}
                    options={[...DIFFICULTY_OPTIONS]}
                  />
                  <FilterSelect
                    label="Duration"
                    value={duration}
                    onChange={setDuration}
                    options={DURATION_OPTIONS.map((d) => d.id)}
                  />
                  <FilterSelect label="Language" value={language} onChange={setLanguage} options={[...LANGUAGE_OPTIONS]} />
                  <FilterSelect
                    label="Price"
                    value={price}
                    onChange={setPrice}
                    options={PRICE_OPTIONS.map((p) => p.id)}
                  />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    onClick={clearFilters}
                    className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                  >
                    Clear all filters
                  </button>
                  <button
                    onClick={() => setPanelOpen(false)}
                    className="sm:hidden px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold"
                  >
                    Show {filteredCourses.length} results
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Active chips + live count */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <AnimatePresence>
            {activeChips.map((chip) => (
              <motion.button
                key={chip.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold hover:bg-[#2563EB]/20 transition-colors"
              >
                {chip.label}
                <X className="w-3 h-3" />
              </motion.button>
            ))}
          </AnimatePresence>
          {activeChips.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-[#94A3B8] hover:text-[#64748B] transition-colors ml-1"
            >
              Clear all
            </button>
          )}
          <span className="ml-auto text-xs font-medium text-[#64748B]">
            {filteredCourses.length} of {totalCount} courses
          </span>
        </div>
      </div>
    </div>
  );
}
