"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { courseCategories } from "@/lib/about-data";

export default function CourseCategories() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
            Course Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Explore Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Certification Tracks
            </span>
          </h2>
          <p className="mt-4 text-[#64748B] text-lg max-w-2xl mx-auto">
            Eight specialized paths designed to launch or elevate your career
            in fitness and wellness.
          </p>
        </motion.div>

        {/* Mobile: horizontal scroll, Desktop: grid */}
        <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0">
          {courseCategories.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative min-w-[240px] sm:min-w-0 snap-start rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:border-transparent overflow-hidden"
            >
              {/* Glow on hover */}
              <div
                aria-hidden
                className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${cat.gradient} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20`}
              />
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-3xl mb-4 shadow-md`}
                >
                  {cat.icon}
                </motion.div>
                <h3 className="font-bold text-[#0F172A] text-lg mb-2">{cat.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed mb-4">
                  {cat.description}
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] group-hover:gap-2.5 transition-all"
                >
                  Explore
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
