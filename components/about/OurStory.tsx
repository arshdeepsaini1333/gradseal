"use client";

import { motion } from "framer-motion";

const storyIcons = [
  { emoji: "💻", label: "Online Learning" },
  { emoji: "🏋️", label: "Fitness" },
  { emoji: "🎓", label: "Graduation Cap" },
  { emoji: "🏅", label: "Certificates" },
];

export default function OurStory() {
  return (
    <section className="py-24 bg-[#F8FAFC] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-5 max-w-md mx-auto">
              {storyIcons.map((icon, i) => (
                <motion.div
                  key={icon.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className={`bg-white rounded-3xl shadow-lg border border-slate-100 p-8 flex flex-col items-center justify-center gap-3 ${
                    i % 2 === 1 ? "mt-8" : ""
                  }`}
                >
                  <motion.span
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.5 + i, repeat: Infinity, ease: "easeInOut" }}
                    className="text-4xl"
                  >
                    {icon.emoji}
                  </motion.span>
                  <p className="text-xs font-semibold text-[#64748B] text-center">
                    {icon.label}
                  </p>
                </motion.div>
              ))}
            </div>
            <div
              aria-hidden
              className="absolute -z-10 top-1/2 left-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563EB]/8 blur-3xl"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
              Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-6">
              Who We Are
            </h2>
            <div className="space-y-4 text-[#64748B] text-lg leading-relaxed">
              <p>
                GradSeal was created with a simple mission: make quality
                fitness education accessible to everyone.
              </p>
              <p>
                Whether you&apos;re beginning your fitness journey or becoming
                a professional trainer, our platform provides practical
                learning experiences designed by industry experts.
              </p>
              <p>
                From Yoga to Strength Training, Personal Fitness, Nutrition,
                and Wellness Coaching, every course is structured to help
                students gain real-world skills along with professional
                certification.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
