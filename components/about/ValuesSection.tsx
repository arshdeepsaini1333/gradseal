"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Lightbulb,
  TrendingUp,
  Rocket,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { values } from "@/lib/about-data";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  ShieldCheck,
  Lightbulb,
  TrendingUp,
  Rocket,
  Handshake,
};

export default function ValuesSection() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#ECFEFF] overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#2563EB]/8 blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
            Our Values
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            What We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Stand For
            </span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = iconMap[value.icon];
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-lg p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center mb-4 shadow-md"
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="font-bold text-[#0F172A] text-lg mb-2">
                  {value.title}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
