"use client";

import { motion } from "framer-motion";
import { supportHighlights } from "@/lib/contact-data";

export default function StudentSupport() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
            Support You Can Count On
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Why Students{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Love GradSeal
            </span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportHighlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative rounded-3xl border border-slate-100 bg-gradient-to-br from-[#F8FAFC] to-white p-8 text-center shadow-sm hover:shadow-xl transition-all overflow-hidden"
            >
              <div
                aria-hidden
                className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${item.gradient} opacity-10`}
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5 + index, repeat: Infinity, ease: "easeInOut" }}
                className={`relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-4xl shadow-lg mb-6`}
              >
                {item.icon}
              </motion.div>
              <h3 className="relative font-bold text-[#0F172A] text-xl mb-2">
                {item.title}
              </h3>
              <p className="relative text-[#64748B] text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
