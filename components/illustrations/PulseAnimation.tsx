"use client";

import { motion } from "framer-motion";

interface PulseAnimationProps {
  title?: string;
  subtitle?: string;
  widthClass?: string;
  sceneHeightClass?: string;
}

const ekgPath =
  "M0 40 L28 40 L36 40 L42 10 L50 68 L58 22 L64 40 L74 40 L82 40 L90 20 L96 55 L102 40 L195 40";

export default function PulseAnimation({
  title = "Support Response",
  subtitle = "Avg. reply time: 2 min",
  widthClass = "w-80",
  sceneHeightClass = "h-56",
}: PulseAnimationProps) {
  return (
    <div className={`${widthClass} bg-white rounded-3xl shadow-2xl p-6 border border-slate-100`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white text-lg">
          🎧
        </div>
        <div>
          <p className="font-semibold text-[#0F172A] text-sm">{title}</p>
          <p className="text-xs text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {subtitle}
          </p>
        </div>
      </div>

      <div className={`relative ${sceneHeightClass} rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF] overflow-hidden flex items-center justify-center`}>
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-32 h-32 rounded-full bg-[#2563EB]/15 blur-2xl"
        />

        <svg viewBox="0 0 195 80" className="relative w-56" aria-hidden>
          <defs>
            <linearGradient id="pulseLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          <path d={ekgPath} fill="none" stroke="#E2E8F0" strokeWidth={2} />

          <motion.path
            d={ekgPath}
            fill="none"
            stroke="url(#pulseLineGradient)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="60 400"
            animate={{ strokeDashoffset: [400, -60] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        <motion.span
          aria-hidden
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 right-5 text-xl"
        >
          💙
        </motion.span>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-[#64748B]">
        <span>Team online 24/7</span>
        <span className="font-medium text-[#2563EB]">98% satisfaction</span>
      </div>
    </div>
  );
}
