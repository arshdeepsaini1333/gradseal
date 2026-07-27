"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const floatingItems = ["🏅", "🏋️", "🧘", "📜", "🥗"];

export default function AboutCTA() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#0891B2] rounded-3xl px-8 py-16 sm:py-20 text-center overflow-hidden shadow-2xl shadow-blue-500/30"
        >
          {/* Background circles */}
          <div aria-hidden className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
          <div aria-hidden className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

          {/* Floating certificates / fitness icons */}
          <div aria-hidden className="absolute inset-0 pointer-events-none hidden sm:block">
            {floatingItems.map((item, i) => (
              <motion.span
                key={item + i}
                animate={{ y: [0, -16, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                className="absolute text-3xl opacity-25"
                style={{
                  top: `${15 + i * 15}%`,
                  left: i % 2 === 0 ? `${6 + i * 4}%` : undefined,
                  right: i % 2 !== 0 ? `${6 + i * 4}%` : undefined,
                }}
              >
                {item}
              </motion.span>
            ))}
          </div>

          {/* Particles */}
          <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.1, 0.5, 0.1] }}
                transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                className="absolute w-1.5 h-1.5 rounded-full bg-white"
                style={{ left: `${(i * 9.7) % 100}%`, top: `${(i * 17.3) % 100}%` }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight"
            >
              Ready to Transform Your Future?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-4 text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Join thousands of learners building successful careers in
              fitness and wellness with GradSeal.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.26 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#2563EB] font-bold text-sm hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/student/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white font-bold text-sm hover:border-white hover:bg-white/10 transition-all"
              >
                Get Certified
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
