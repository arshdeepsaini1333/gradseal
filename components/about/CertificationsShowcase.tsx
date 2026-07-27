"use client";

import { motion } from "framer-motion";
import { ShieldCheck, QrCode } from "lucide-react";
import { certificationSamples } from "@/lib/about-data";

export default function CertificationsShowcase() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-[#0B1220] via-[#0F1E3D] to-[#0B1220] overflow-hidden">
      {/* Ambient glows */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#06B6D4]/20 blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-blue-200 text-sm font-medium mb-4">
            Certifications
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Credentials Worth{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#67E8F9]">
              Earning
            </span>
          </h2>
          <p className="mt-4 text-blue-200/70 text-lg max-w-xl mx-auto">
            Every certificate is verifiable, premium, and built to be shared
            with confidence.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificationSamples.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              whileHover={{ rotate: index % 2 === 0 ? -3 : 3, y: -8, scale: 1.02 }}
              className="relative bg-gradient-to-br from-white to-slate-50 rounded-2xl p-5 shadow-2xl border border-white/10"
            >
              {/* Ribbon */}
              <div
                aria-hidden
                className="absolute -top-2 right-6 w-6 h-10 bg-gradient-to-b from-[#2563EB] to-[#1D4ED8]"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)" }}
              />

              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-lg shadow-md">
                  🏅
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>

              <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                Certificate of Completion
              </p>
              <p className="mt-1 font-bold text-[#0F172A] text-base">
                {cert.name}
              </p>
              <p className="text-xs text-[#64748B] mt-0.5">{cert.course}</p>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-dashed border-slate-200">
                <div>
                  <p className="text-[9px] text-slate-400">Certificate ID</p>
                  <p className="text-[11px] font-mono font-semibold text-[#0F172A]">
                    {cert.id}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
