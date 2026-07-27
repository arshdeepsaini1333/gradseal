"use client";

import { motion } from "framer-motion";
import { CourseFilterProvider } from "./CourseFilterProvider";
import SearchFilterBar from "./SearchFilterBar";
import CourseGrid from "./CourseGrid";

export default function BrowseCoursesSection() {
  return (
    <CourseFilterProvider>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
              Full Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              Browse All{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
                Courses
              </span>
            </h2>
            <p className="mt-4 text-[#64748B] text-lg max-w-2xl mx-auto">
              Search, filter, and sort through our complete certification catalog.
            </p>
          </motion.div>
        </div>

        <SearchFilterBar />
        <CourseGrid />
      </section>
    </CourseFilterProvider>
  );
}
