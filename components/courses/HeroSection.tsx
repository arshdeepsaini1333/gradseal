"use client";

import { useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award } from "lucide-react";
import CourseStatsAnimation from "@/components/illustrations/CourseStatsAnimation";

const fadeUpTransition = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

// Deterministic particle positions to avoid hydration mismatches.
const particles = [
  { left: "8%", top: "18%", size: 5, duration: 7, delay: 0 },
  { left: "22%", top: "72%", size: 3, duration: 9, delay: 0.5 },
  { left: "35%", top: "12%", size: 4, duration: 6.5, delay: 1 },
  { left: "48%", top: "85%", size: 3, duration: 8, delay: 1.5 },
  { left: "62%", top: "30%", size: 5, duration: 7.5, delay: 0.3 },
  { left: "75%", top: "60%", size: 3, duration: 9.5, delay: 0.8 },
  { left: "88%", top: "22%", size: 4, duration: 6, delay: 1.2 },
  { left: "15%", top: "45%", size: 3, duration: 8.5, delay: 2 },
];

const floatingIcons = [
  { emoji: "🧘", top: "8%", left: "44%" },
  { emoji: "🏅", top: "68%", left: "6%" },
  { emoji: "📘", top: "20%", left: "90%" },
  { emoji: "🎓", top: "78%", left: "48%" },
];

function MagneticButton({ children, ...props }: React.ComponentProps<typeof Link>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    setOffset({ x, y });
  };

  return (
    <motion.span
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.4 }}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      className="inline-block"
    >
      <Link ref={ref} {...props}>
        {children}
      </Link>
    </motion.span>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#ECFEFF] pt-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block transition-[background] duration-300 ease-out"
        style={{
          background: `radial-gradient(500px circle at ${spotlight.x}% ${spotlight.y}%, rgba(37,99,235,0.10), transparent 70%)`,
        }}
      />

      <motion.div
        aria-hidden
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#2563EB]/10 blur-3xl pointer-events-none"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#06B6D4]/10 blur-3xl pointer-events-none"
      />

      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -18, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full bg-[#2563EB]/40"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          />
        ))}
      </div>

      <div aria-hidden className="absolute inset-0 pointer-events-none hidden md:block">
        {floatingIcons.map((icon, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            className="absolute text-3xl opacity-25"
            style={{ top: icon.top, left: icon.left }}
          >
            {icon.emoji}
          </motion.span>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              {...fadeUpTransition(0)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
              50+ Certification Courses
            </motion.div>

            <motion.h1
              {...fadeUpTransition(0.1)}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-tight tracking-tight"
            >
              Become Certified.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#06B6D4]">
                Build Your Fitness Career.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUpTransition(0.2)}
              className="mt-6 text-lg text-[#64748B] leading-relaxed max-w-lg"
            >
              Explore professional certification courses designed by fitness
              experts. Learn at your own pace, earn recognized certificates,
              and transform your passion into a successful career.
            </motion.p>

            <motion.div {...fadeUpTransition(0.3)} className="mt-8 flex flex-wrap gap-4">
              <MagneticButton
                href="#browse-courses"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Explore All Courses
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
              <MagneticButton
                href="/certificates"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-semibold text-sm transition-all"
              >
                View Certifications
              </MagneticButton>
            </motion.div>

            <motion.div {...fadeUpTransition(0.4)} className="mt-10 flex items-center gap-3 text-sm text-[#64748B]">
              <Award className="w-5 h-5 text-[#2563EB]" />
              <span>
                Trusted by <strong className="text-[#0F172A]">10,000+</strong> certified professionals
              </span>
            </motion.div>
          </div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:flex items-center justify-center h-[460px]"
          >
            {/* Base card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute z-10"
            >
              <CourseStatsAnimation
                title="Skill Breakdown"
                subtitle="Most popular categories"
                widthClass="w-80"
                sceneHeightClass="h-56"
              />
            </motion.div>

            {/* Certificate badge */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute -top-6 -right-4 w-24 h-24 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center justify-center text-4xl z-20"
            >
              🏅
            </motion.div>

            {/* Dumbbell badge */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
              className="absolute -bottom-8 right-10 w-20 h-20 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center justify-center text-3xl z-20"
            >
              🏋️
            </motion.div>

            {/* Yoga badge */}
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute bottom-6 -left-10 w-20 h-20 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center justify-center text-3xl z-20"
            >
              🧘
            </motion.div>

            {/* Achievement badge */}
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute top-4 -left-8 bg-white rounded-2xl shadow-xl px-3 py-2.5 border border-slate-100 flex items-center gap-2 z-20"
            >
              <span className="text-lg">🏆</span>
              <span className="text-xs font-semibold text-[#0F172A]">Top Rated Courses</span>
            </motion.div>

            <div aria-hidden className="absolute -z-10 w-72 h-72 rounded-full bg-[#2563EB]/15 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
