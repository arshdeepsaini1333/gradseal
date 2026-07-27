"use client";

import { motion } from "framer-motion";

interface CourseStatsAnimationProps {
  title?: string;
  subtitle?: string;
  widthClass?: string;
  sceneHeightClass?: string;
}

const bars = [
  { label: "🏋️ Gym", height: 62, delay: 0 },
  { label: "🧘 Yoga", height: 88, delay: 0.15 },
  { label: "🥗 Diet", height: 45, delay: 0.3 },
  { label: "🏃 Cardio", height: 74, delay: 0.45 },
];

export default function CourseStatsAnimation({
  title = "Skill Breakdown",
  subtitle = "Most popular categories",
  widthClass = "w-80",
  sceneHeightClass = "h-56",
}: CourseStatsAnimationProps) {
  return (
    <div className={`${widthClass} bg-white rounded-3xl shadow-2xl p-6 border border-slate-100`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white text-lg">
          📊
        </div>
        <div>
          <p className="font-semibold text-[#0F172A] text-sm">{title}</p>
          <p className="text-xs text-[#64748B]">{subtitle}</p>
        </div>
      </div>

      <div className={`relative ${sceneHeightClass} rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF] overflow-hidden flex items-end justify-center gap-4 px-6 pb-4`}>
        {bars.map((bar) => (
          <div key={bar.label} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
            <div className="relative w-full max-w-10 h-full rounded-t-lg bg-slate-100 overflow-hidden flex items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: [`0%`, `${bar.height}%`, `${bar.height}%`, "0%"] }}
                transition={{
                  duration: 3.2,
                  delay: bar.delay,
                  repeat: Infinity,
                  repeatDelay: 0.6,
                  times: [0, 0.35, 0.85, 1],
                  ease: "easeInOut",
                }}
                className="w-full rounded-t-lg bg-gradient-to-t from-[#2563EB] to-[#06B6D4]"
              />
            </div>
            <span className="text-[10px] font-medium text-[#64748B] whitespace-nowrap">{bar.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-[#64748B]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live enrollment data
        </span>
        <span className="font-medium text-[#2563EB]">50+ courses</span>
      </div>
    </div>
  );
}
