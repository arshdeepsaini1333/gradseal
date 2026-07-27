"use client";

import { motion } from "framer-motion";
import {
  Compass,
  ClipboardCheck,
  Play,
  Target,
  Award,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { timelineSteps } from "@/lib/about-data";

const iconMap: Record<string, LucideIcon> = {
  Compass,
  ClipboardCheck,
  Play,
  Target,
  Award,
  Rocket,
};

export default function LearningTimeline() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Learning Journey
            </span>
          </h2>
        </motion.div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block relative">
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-slate-100">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
              className="h-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
            />
          </div>
          <div className="grid grid-cols-6 gap-4">
            {timelineSteps.map((step, index) => {
              const Icon = iconMap[step.icon];
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  whileHover={{ y: -4 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto w-16 h-16 rounded-full bg-white border-2 border-[#2563EB] flex items-center justify-center shadow-md">
                    <Icon className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <p className="mt-4 font-bold text-[#0F172A] text-sm">
                    {step.title}
                  </p>
                  <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile / Tablet: vertical timeline */}
        <div className="lg:hidden relative pl-10">
          <div className="absolute top-2 bottom-2 left-4 w-0.5 bg-slate-100">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
              className="w-full h-full bg-gradient-to-b from-[#2563EB] to-[#06B6D4]"
            />
          </div>
          <div className="space-y-8">
            {timelineSteps.map((step, index) => {
              const Icon = iconMap[step.icon];
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative"
                >
                  <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-white border-2 border-[#2563EB] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <p className="font-bold text-[#0F172A] text-sm">{step.title}</p>
                  <p className="mt-1 text-sm text-[#64748B] leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
