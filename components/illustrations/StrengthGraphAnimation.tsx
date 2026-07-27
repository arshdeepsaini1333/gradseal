"use client";

import { motion } from "framer-motion";

interface StrengthGraphAnimationProps {
  title?: string;
  subtitle?: string;
  widthClass?: string;
  sceneHeightClass?: string;
}

const points = [
  { x: 10, y: 90 },
  { x: 45, y: 70 },
  { x: 80, y: 78 },
  { x: 115, y: 48 },
  { x: 150, y: 55 },
  { x: 185, y: 20 },
];

const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
const areaPath = `${linePath} L ${points[points.length - 1].x} 110 L ${points[0].x} 110 Z`;

export default function StrengthGraphAnimation({
  title = "Career Growth",
  subtitle = "Skill progression over time",
  widthClass = "w-72",
  sceneHeightClass = "h-48",
}: StrengthGraphAnimationProps) {
  return (
    <div className={`${widthClass} bg-white rounded-3xl shadow-2xl p-6 border border-slate-100`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white text-lg">
          📈
        </div>
        <div>
          <p className="font-semibold text-[#0F172A] text-sm">{title}</p>
          <p className="text-xs text-[#64748B]">{subtitle}</p>
        </div>
      </div>

      <div className={`relative ${sceneHeightClass} rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF] overflow-hidden`}>
        <svg viewBox="0 0 195 110" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="strengthLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="strengthAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
          </defs>

          <motion.path
            d={areaPath}
            fill="url(#strengthAreaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          />

          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#strengthLineGradient)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.4 }}
          />

          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill="#2563EB"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.28, repeat: Infinity, repeatDelay: 2.8 }}
            />
          ))}
        </svg>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="absolute top-3 right-3 rounded-lg bg-white/90 backdrop-blur px-2.5 py-1 shadow-sm border border-slate-100"
        >
          <span className="text-xs font-bold text-emerald-600">+180%</span>
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-[#64748B]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Tracking progress
        </span>
        <span className="font-medium text-[#2563EB]">🏆 Personal best</span>
      </div>
    </div>
  );
}
