"use client";

import { motion } from "framer-motion";

interface ActivityRingsAnimationProps {
  title?: string;
  subtitle?: string;
  widthClass?: string;
  sceneHeightClass?: string;
}

const rings = [
  { radius: 70, color: "#2563EB", target: 0.92, delay: 0 },
  { radius: 54, color: "#06B6D4", target: 0.78, delay: 0.2 },
  { radius: 38, color: "#F59E0B", target: 0.64, delay: 0.4 },
];

const stats = [
  { label: "Move", value: "620 kcal", icon: "🔥" },
  { label: "Train", value: "48 min", icon: "🏋️" },
  { label: "Stand", value: "10 hrs", icon: "⏱️" },
];

export default function ActivityRingsAnimation({
  title = "Today's Activity",
  subtitle = "Move. Train. Achieve.",
  widthClass = "w-full max-w-md",
  sceneHeightClass = "h-64",
}: ActivityRingsAnimationProps) {
  const size = 180;
  const center = size / 2;

  return (
    <div className={`${widthClass} bg-white rounded-3xl shadow-2xl p-8 border border-slate-100`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white text-xl">
          💪
        </div>
        <div>
          <p className="font-semibold text-[#0F172A] text-sm">{title}</p>
          <p className="text-xs text-[#64748B]">{subtitle}</p>
        </div>
      </div>

      <div className={`relative ${sceneHeightClass} rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF] overflow-hidden flex items-center justify-center`}>
        <motion.div
          aria-hidden
          animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-40 h-40 rounded-full bg-[#2563EB]/15 blur-2xl"
        />

        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative -rotate-90">
          {rings.map((ring) => {
            const circumference = 2 * Math.PI * ring.radius;
            return (
              <g key={ring.radius}>
                <circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  fill="none"
                  stroke="#EEF2F7"
                  strokeWidth={11}
                />
                <motion.circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={11}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{
                    strokeDashoffset: [
                      circumference,
                      circumference * (1 - ring.target),
                      circumference * (1 - ring.target),
                      circumference,
                    ],
                  }}
                  transition={{
                    duration: 4.5,
                    delay: ring.delay,
                    repeat: Infinity,
                    times: [0, 0.35, 0.85, 1],
                    ease: "easeInOut",
                  }}
                />
              </g>
            );
          })}
        </svg>

        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute text-3xl"
        >
          🔥
        </motion.div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-[#F8FAFC] px-2 py-2.5 text-center">
            <p className="text-sm">{stat.icon}</p>
            <p className="text-xs font-semibold text-[#0F172A] mt-1">{stat.value}</p>
            <p className="text-[10px] text-[#64748B]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
