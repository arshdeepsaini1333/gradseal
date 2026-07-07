"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/lib/data";

function AnimatedNumber({ value }: { value: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;

    const numeric = parseInt(value.replace(/\D/g, ""), 10);
    const suffix = value.replace(/[0-9,]/g, "");
    const duration = 1600;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += numeric / steps;
      if (current >= numeric) {
        current = numeric;
        clearInterval(timer);
      }
      setDisplay(Math.floor(current).toLocaleString() + suffix);
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}

export default function Stats() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#60A5FA]">
              Thousands
            </span>{" "}
            of Professionals
          </h2>
          <p className="mt-3 text-[#64748B] text-lg">
            Numbers that reflect our commitment to quality education.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-gradient-to-br from-[#EFF6FF] to-white rounded-2xl p-6 text-center border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#2563EB]/30" />
              <p className="text-3xl sm:text-4xl font-extrabold text-[#2563EB]">
                <AnimatedNumber value={stat.value} />
              </p>
              <p className="mt-2 text-sm font-medium text-[#64748B]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
