"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";
import { successStories } from "@/lib/about-data";

const roleEmojis: Record<string, string> = {
  "Certified Personal Trainer": "🏋️",
  "Yoga Instructor": "🧘",
  "Gym Coach": "💪",
  "Nutrition Consultant": "🥗",
};

export default function StudentSuccess() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % successStories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Large image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto rounded-[2rem] bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#06B6D4] p-10 shadow-2xl flex items-center justify-center overflow-hidden">
              <div aria-hidden className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
              <div aria-hidden className="absolute -bottom-14 -left-14 w-52 h-52 rounded-full bg-white/10" />
              <motion.span
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl relative z-10"
              >
                🏆
              </motion.span>
            </div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="absolute -bottom-4 left-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100 flex items-center gap-2"
            >
              <span className="text-lg">✅</span>
              <div>
                <p className="text-xs font-bold text-[#0F172A]">98% Completion</p>
                <p className="text-[10px] text-[#64748B]">Course success rate</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Success story cards */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
              Student Success
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-8">
              Careers Built on{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
                GradSeal
              </span>
            </h2>

            <div className="relative min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="bg-gradient-to-br from-[#EFF6FF] to-white rounded-2xl p-8 border border-blue-100 shadow-sm"
                >
                  <Quote className="w-8 h-8 text-[#2563EB]/25 mb-4" />
                  <p className="text-[#0F172A] text-lg leading-relaxed mb-6">
                    &ldquo;{successStories[active].quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-xl shadow-md">
                      {roleEmojis[successStories[active].role] ?? "🎓"}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A] text-sm">
                        {successStories[active].name}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {successStories[active].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-2 mt-6">
              {successStories.map((story, i) => (
                <button
                  key={story.name}
                  aria-label={`Show story from ${story.name}`}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? "w-8 bg-[#2563EB]" : "w-2 bg-slate-200 hover:bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
