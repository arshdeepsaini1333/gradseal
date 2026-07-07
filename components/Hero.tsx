"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUpTransition = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#F0F9FF] pt-16">
      {/* Background decorative blobs */}
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#2563EB]/8 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#60A5FA]/10 blur-3xl pointer-events-none"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div>
            {/* Badge */}
            <motion.div
              {...fadeUpTransition(0)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
              India&apos;s Trusted Fitness Certification Platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUpTransition(0.1)}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-tight tracking-tight"
            >
              Learn.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#60A5FA]">
                Get Certified.
              </span>
              <br />
              Build Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#60A5FA]">
                Fitness Career.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              {...fadeUpTransition(0.2)}
              className="mt-6 text-lg text-[#64748B] leading-relaxed max-w-lg"
            >
              GradSeal offers professional certification courses for gym
              trainers, personal trainers, nutrition coaches, yoga instructors,
              and sports professionals. Study at your own pace and earn
              industry-recognized digital certificates.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              {...fadeUpTransition(0.3)}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Explore Courses
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
              <Link
                href="/student/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-semibold text-sm transition-all"
              >
                Student Login
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              {...fadeUpTransition(0.4)}
              className="mt-10 flex items-center gap-6"
            >
              <div className="flex -space-x-2">
                {["A", "B", "C", "D"].map((letter, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: `hsl(${220 + i * 15}, 70%, 55%)` }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      className="w-4 h-4 text-amber-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Trusted by <strong>12,000+</strong> students
                </p>
              </div>
            </motion.div>
          </div>

          {/* Hero illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Main card */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "loop",
              }}
              className="relative w-full max-w-md"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                {/* Course progress mock */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white text-xl">
                    🏋️
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F172A] text-sm">
                      Certified Personal Trainer
                    </p>
                    <p className="text-xs text-[#64748B]">Week 8 of 12</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[#64748B] mb-2">
                    <span>Progress</span>
                    <span className="font-medium text-[#2563EB]">67%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "67%" }}
                      transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { label: "Anatomy Basics", done: true },
                    { label: "Training Principles", done: true },
                    { label: "Program Design", done: false },
                  ].map(({ label, done }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          done
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {done ? (
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 12 12"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2 6l3 3 5-5"
                            />
                          </svg>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        )}
                      </div>
                      <span
                        className={`text-xs ${done ? "text-[#0F172A]" : "text-[#64748B]"}`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate floating badge */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                  repeatType: "loop",
                }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-lg">
                  🏅
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0F172A]">
                    Certificate Ready
                  </p>
                  <p className="text-xs text-[#64748B]">After assessment</p>
                </div>
              </motion.div>

              {/* Rating floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                  repeatType: "loop",
                }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100"
              >
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-amber-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-bold text-[#0F172A]">4.9</span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">Top Rated</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
