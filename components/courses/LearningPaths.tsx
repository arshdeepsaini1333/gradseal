"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { learningPaths } from "@/lib/mockCourses";

export default function LearningPaths() {
  const [activeId, setActiveId] = useState(learningPaths[0].id);
  const activePath = learningPaths.find((p) => p.id === activeId) ?? learningPaths[0];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
            Learning Paths
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Popular{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Learning Roadmaps
            </span>
          </h2>
          <p className="mt-4 text-[#64748B] text-lg max-w-2xl mx-auto">
            Follow a guided sequence of courses to become a certified specialist.
          </p>
        </motion.div>

        {/* Path tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {learningPaths.map((path) => (
            <button
              key={path.id}
              onClick={() => setActiveId(path.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeId === path.id
                  ? `bg-gradient-to-r ${path.gradient} text-white shadow-lg`
                  : "bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100"
              }`}
            >
              <span>{path.icon}</span>
              {path.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePath.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <div className="text-center mb-10">
              <span className="text-xs font-semibold text-[#64748B] bg-[#F8FAFC] px-3 py-1 rounded-full">
                Total duration: {activePath.totalDuration}
              </span>
            </div>

            {/* Desktop horizontal timeline */}
            <div className="hidden lg:block relative">
              <div className="absolute top-8 left-0 right-0 h-0.5 bg-slate-100">
                <motion.div
                  key={`${activePath.id}-line`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                  className={`h-full bg-gradient-to-r ${activePath.gradient}`}
                />
              </div>
              <div className="grid grid-cols-5 gap-4">
                {activePath.steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="text-center"
                  >
                    <div className="relative z-10 mx-auto w-16 h-16 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-md text-lg font-bold">
                      <span className={`bg-gradient-to-br ${activePath.gradient} bg-clip-text text-transparent`}>
                        {index + 1}
                      </span>
                    </div>
                    <p className="mt-4 font-bold text-[#0F172A] text-sm">{step.title}</p>
                    <p className="mt-1 text-xs text-[#64748B] leading-relaxed">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile vertical timeline */}
            <div className="lg:hidden relative pl-10">
              <div className="absolute top-2 bottom-2 left-4 w-0.5 bg-slate-100">
                <motion.div
                  key={`${activePath.id}-vline`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{ transformOrigin: "top" }}
                  className={`w-full h-full bg-gradient-to-b ${activePath.gradient}`}
                />
              </div>
              <div className="space-y-8">
                {activePath.steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="relative"
                  >
                    <div
                      className={`absolute -left-10 top-0 w-8 h-8 rounded-full bg-gradient-to-br ${activePath.gradient} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {index + 1}
                    </div>
                    <p className="font-bold text-[#0F172A] text-sm">{step.title}</p>
                    <p className="mt-1 text-sm text-[#64748B] leading-relaxed">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
