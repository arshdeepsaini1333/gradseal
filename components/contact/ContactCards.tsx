"use client";

import { motion } from "framer-motion";
import { contactCards } from "@/lib/contact-data";

export default function ContactCards() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            How Can We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Help You?
            </span>
          </h2>
          <p className="mt-3 text-[#64748B] text-lg">
            Pick the option that fits best — we&apos;ll route you to the right team.
          </p>
        </motion.div>

        <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0">
          {contactCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group relative min-w-[250px] sm:min-w-0 snap-start rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:border-transparent overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20"
              />
              <div className="relative">
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center text-3xl mb-4"
                >
                  {card.icon}
                </motion.div>
                <h3 className="font-bold text-[#0F172A] text-lg mb-2">{card.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed mb-5 min-h-[40px]">
                  {card.description}
                </p>
                <a
                  href={card.href}
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-[#2563EB]/5 text-[#2563EB] text-sm font-semibold group-hover:bg-[#2563EB] group-hover:text-white transition-colors"
                >
                  {card.buttonLabel}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
