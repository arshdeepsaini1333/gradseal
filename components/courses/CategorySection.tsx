"use client";

import { motion } from "framer-motion";
import { categories, getCategoryCourseCount } from "@/lib/mockCourses";

export default function CategorySection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
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
            Eight certification tracks across fitness, wellness, and sports science.
          </p>
        </motion.div>

        <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0">
          {categories.map((cat, index) => (
            <motion.a
              key={cat.id}
              href="#browse-courses"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative min-w-[230px] sm:min-w-0 snap-start rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:border-transparent overflow-hidden"
            >
              <div
                aria-hidden
                className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${cat.gradient} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20`}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-3xl shadow-md`}
                  >
                    {cat.icon}
                  </motion.div>
                  <span className="px-2.5 py-1 rounded-full bg-[#F8FAFC] text-[#2563EB] text-[11px] font-bold">
                    {getCategoryCourseCount(cat.name)} courses
                  </span>
                </div>
                <h3 className="font-bold text-[#0F172A] text-lg mb-1.5">{cat.name}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{cat.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
