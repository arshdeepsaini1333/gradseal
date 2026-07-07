"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E3A8A] rounded-3xl px-8 py-16 text-center overflow-hidden shadow-2xl shadow-blue-500/30"
        >
          {/* Background circles */}
          <div
            aria-hidden
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/3 pointer-events-none"
          />

          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Join 12,000+ Students Today
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight"
            >
              Start Building Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93C5FD] to-[#BFDBFE]">
                Fitness Career
              </span>{" "}
              Today
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Join thousands of students who are already building successful
              careers through GradSeal&apos;s professional certification programs.
              No deadlines. No pressure. Just results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/student/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#2563EB] font-bold text-sm hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Register Free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white font-bold text-sm hover:border-white hover:bg-white/10 transition-all"
              >
                Browse Courses
              </Link>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-blue-200 text-xs"
            >
              {[
                "✓ Free to register",
                "✓ No credit card required",
                "✓ Self-paced learning",
                "✓ Lifetime certificate access",
              ].map((item) => (
                <span key={item} className="font-medium">
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
