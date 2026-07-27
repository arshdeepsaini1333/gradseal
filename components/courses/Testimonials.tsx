"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { courseTestimonials } from "@/lib/mockCourses";

function TestimonialCard({ t }: { t: (typeof courseTestimonials)[number] }) {
  return (
    <div className="w-[340px] sm:w-[380px] shrink-0 bg-white rounded-2xl p-6 border border-slate-100 shadow-md flex flex-col">
      <Quote className="w-8 h-8 text-[#2563EB]/20 mb-4" />
      <p className="text-[#0F172A] text-sm leading-relaxed flex-1 mb-6">&ldquo;{t.review}&rdquo;</p>
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
        ))}
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: t.color }}
        >
          {t.initials}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[#0F172A] text-sm truncate">{t.name}</p>
          <p className="text-xs text-[#64748B] truncate">{t.profession}</p>
          <p className="text-[11px] text-[#2563EB] font-medium truncate">{t.course}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const loop = [...courseTestimonials, ...courseTestimonials];

  return (
    <section className="py-24 bg-[#F8FAFC] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Careers Built on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              GradSeal
            </span>
          </h2>
        </motion.div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10" />
        <div className="flex gap-6 animate-marquee w-max px-4 sm:px-6">
          {loop.map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
