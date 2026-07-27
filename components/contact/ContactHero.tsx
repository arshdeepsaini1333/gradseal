"use client";

import { useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import PulseAnimation from "@/components/illustrations/PulseAnimation";

const fadeUpTransition = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

// Deterministic particle positions to avoid hydration mismatches.
const particles = [
  { left: "10%", top: "20%", size: 4, duration: 7, delay: 0 },
  { left: "25%", top: "75%", size: 3, duration: 9, delay: 0.5 },
  { left: "40%", top: "15%", size: 5, duration: 6.5, delay: 1 },
  { left: "58%", top: "82%", size: 3, duration: 8, delay: 1.5 },
  { left: "70%", top: "35%", size: 4, duration: 7.5, delay: 0.3 },
  { left: "85%", top: "60%", size: 3, duration: 9.5, delay: 0.8 },
  { left: "92%", top: "20%", size: 4, duration: 6, delay: 1.2 },
  { left: "15%", top: "48%", size: 3, duration: 8.5, delay: 2 },
];

const floatingIcons = [
  { emoji: "🏋️", top: "10%", left: "45%" },
  { emoji: "🧘", top: "68%", left: "6%" },
  { emoji: "🏅", top: "30%", left: "3%" },
  { emoji: "🎓", top: "78%", left: "50%" },
  { emoji: "📘", top: "18%", left: "88%" },
  { emoji: "🏆", top: "55%", left: "92%" },
  { emoji: "🫀", top: "42%", left: "78%" },
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

export default function ContactHero() {
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
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 }}
            className="absolute text-3xl opacity-25"
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
              We&apos;re Here to Help
            </motion.div>

            <motion.h1
              {...fadeUpTransition(0.1)}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-tight tracking-tight"
            >
              We&apos;d Love to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#06B6D4]">
                Hear From You
              </span>
            </motion.h1>

            <motion.p
              {...fadeUpTransition(0.2)}
              className="mt-6 text-lg text-[#64748B] leading-relaxed max-w-lg"
            >
              Whether you&apos;re looking to enroll in a course, verify a
              certificate, partner with us, or simply have a question, the
              GradSeal team is here to help.
            </motion.p>

            <motion.div {...fadeUpTransition(0.3)} className="mt-8 flex flex-wrap gap-4">
              <MagneticButton
                href="#contact-form"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Contact Support
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
              <MagneticButton
                href="/courses"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-semibold text-sm transition-all"
              >
                Explore Courses
              </MagneticButton>
            </motion.div>
          </div>

          {/* Illustration: student chatting with support */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:flex items-center justify-center h-[480px]"
          >
            {/* Base card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute z-10"
            >
              <PulseAnimation
                title="Support Team"
                subtitle="Online now, ask us anything"
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

            {/* Chat bubble icon */}
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute bottom-4 -left-10 bg-white rounded-2xl shadow-xl px-3 py-2.5 border border-slate-100 flex items-center gap-2 z-20"
            >
              <MessageCircle className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xs font-semibold text-[#0F172A]">24/7 Support</span>
            </motion.div>

            {/* Laptop icon */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
              className="absolute -bottom-8 right-8 w-20 h-20 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center justify-center text-3xl z-20"
            >
              💻
            </motion.div>

            {/* Glow */}
            <div
              aria-hidden
              className="absolute -z-10 w-72 h-72 rounded-full bg-[#2563EB]/15 blur-3xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
