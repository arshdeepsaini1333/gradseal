"use client";

import { useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award } from "lucide-react";
import StrengthGraphAnimation from "@/components/illustrations/StrengthGraphAnimation";

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
  { left: "92%", top: "78%", size: 4, duration: 7, delay: 1.8 },
  { left: "55%", top: "8%", size: 3, duration: 6.8, delay: 0.6 },
];

const floatingIcons = [
  { emoji: "🧘", top: "6%", left: "42%" },
  { emoji: "🫀", top: "38%", left: "4%" },
  { emoji: "🏅", top: "70%", left: "8%" },
];

function MagneticButton({
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
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

export default function AboutHero() {
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
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#ECFEFF] pt-16"
    >
      {/* Mouse-follow gradient spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block transition-[background] duration-300 ease-out"
        style={{
          background: `radial-gradient(500px circle at ${spotlight.x}% ${spotlight.y}%, rgba(37,99,235,0.10), transparent 70%)`,
        }}
      />

      {/* Animated gradient blobs */}
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
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 w-[400px] h-[400px] -translate-x-1/2 rounded-full bg-[#3B82F6]/8 blur-3xl pointer-events-none"
      />

      {/* Particle field */}
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

      {/* Floating fitness icons */}
      <div aria-hidden className="absolute inset-0 pointer-events-none hidden md:block">
        {floatingIcons.map((icon, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            className="absolute text-3xl opacity-30"
            style={{ top: icon.top, left: icon.left }}
          >
            {icon.emoji}
          </motion.span>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div>
            <motion.div
              {...fadeUpTransition(0)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
              About GradSeal
            </motion.div>

            <motion.h1
              {...fadeUpTransition(0.1)}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-tight tracking-tight"
            >
              Learn. Get Certified.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#06B6D4]">
                Build Your Fitness Career.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUpTransition(0.2)}
              className="mt-6 text-lg text-[#64748B] leading-relaxed max-w-lg"
            >
              GradSeal empowers aspiring fitness professionals with
              industry-focused certification programs in Gym Training, Yoga,
              Personal Training, Nutrition, and Wellness. Learn from experts,
              earn recognized certifications, and grow your career.
            </motion.p>

            <motion.div {...fadeUpTransition(0.3)} className="mt-8 flex flex-wrap gap-4">
              <MagneticButton
                href="/courses"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
              <MagneticButton
                href="/student/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-semibold text-sm transition-all"
              >
                Become Certified
              </MagneticButton>
            </motion.div>

            <motion.div {...fadeUpTransition(0.4)} className="mt-10 flex items-center gap-3 text-sm text-[#64748B]">
              <Award className="w-5 h-5 text-[#2563EB]" />
              <span>
                Trusted by <strong className="text-[#0F172A]">10,000+</strong>{" "}
                certified professionals
              </span>
            </motion.div>
          </div>

          {/* 3D layered illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:flex items-center justify-center h-[480px]"
          >
            {/* Base layer */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute z-10"
            >
              <StrengthGraphAnimation
                title="Career Growth"
                subtitle="Skill progression over time"
                widthClass="w-72"
                sceneHeightClass="h-48"
              />
            </motion.div>

            {/* Certificate card */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute -top-6 -right-2 w-52 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 z-20"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🏅</span>
                <p className="text-xs font-bold text-[#0F172A]">Certificate</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-amber-50 to-white border border-amber-200/60 p-2 text-center">
                <p className="text-[10px] text-[#64748B]">Verified &amp; Issued</p>
                <p className="text-xs font-semibold text-amber-600">GradSeal Certified</p>
              </div>
            </motion.div>

            {/* Yoga pose badge */}
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute bottom-6 -left-8 w-24 h-24 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center justify-center text-4xl z-20"
            >
              🧘
            </motion.div>

            {/* Dumbbell badge */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
              className="absolute -bottom-8 right-6 w-20 h-20 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center justify-center text-3xl z-20"
            >
              🏋️
            </motion.div>

            {/* Heart rate badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              className="absolute top-10 -left-10 bg-white rounded-2xl shadow-xl px-3 py-2.5 border border-slate-100 flex items-center gap-2 z-20"
            >
              <span className="text-lg">🫀</span>
              <div>
                <p className="text-xs font-bold text-[#0F172A]">128 bpm</p>
                <p className="text-[10px] text-[#64748B]">Active zone</p>
              </div>
            </motion.div>

            {/* Achievement badge */}
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute top-2 right-1/4 w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-xl flex items-center justify-center text-2xl z-30"
            >
              🏆
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#64748B]"
        aria-hidden
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#2563EB]/30 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
        </div>
      </motion.div>
    </section>
  );
}
