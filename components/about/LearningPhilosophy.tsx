"use client";

import { motion } from "framer-motion";
import { BookOpen, Dumbbell, ClipboardCheck, Trophy, type LucideIcon } from "lucide-react";
import { philosophySteps } from "@/lib/about-data";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Dumbbell,
  ClipboardCheck,
  Trophy,
};

export default function LearningPhilosophy() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
            Our Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Meet Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Learning Philosophy
            </span>
          </h2>
        </motion.div>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
              className="h-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#06B6D4]"
            />
          </div>

          {philosophySteps.map((step, index) => {
            const Icon = iconMap[step.icon];
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -6 }}
                className="relative bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative z-10 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-lg mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-bold text-[#2563EB]">
                  0{index + 1}
                </span>
                <h3 className="mt-1 font-bold text-[#0F172A] text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
