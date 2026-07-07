"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const certFeatures = [
  {
    icon: "🔐",
    title: "Digital Verification",
    description:
      "Every certificate has a unique QR code and ID that anyone can verify instantly online.",
  },
  {
    icon: "🆔",
    title: "Unique Certificate ID",
    description:
      "Each certificate carries a tamper-proof unique identifier for authenticity assurance.",
  },
  {
    icon: "♾️",
    title: "Lifetime Validity",
    description:
      "Your GradSeal certificate never expires. Your achievement is permanent.",
  },
  {
    icon: "🔗",
    title: "Shareable Certificate",
    description:
      "Share your certificate on LinkedIn, resumes, and social media with one click.",
  },
];

export default function CertificatePreview() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#1E3A8A] relative overflow-hidden">
      {/* Background decorations */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#60A5FA]/10 blur-3xl pointer-events-none"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Certificate mock */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Certificate card */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white/20">
                {/* Top banner */}
                <div className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] px-8 py-5 text-center">
                  <div className="flex items-center justify-center gap-2 text-white font-bold text-lg">
                    <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-sm font-extrabold">
                      G
                    </span>
                    GradSeal
                  </div>
                  <p className="text-blue-100 text-xs mt-1 tracking-widest uppercase">
                    Certificate of Completion
                  </p>
                </div>

                <div className="px-8 py-6 text-center">
                  <p className="text-[#64748B] text-xs uppercase tracking-wider mb-2">
                    This certifies that
                  </p>
                  <p className="text-2xl font-extrabold text-[#0F172A] mb-1">
                    Priya Sharma
                  </p>
                  <p className="text-[#64748B] text-xs mb-4">
                    has successfully completed
                  </p>
                  <div className="bg-[#EFF6FF] rounded-xl px-6 py-3 mb-4">
                    <p className="font-bold text-[#2563EB] text-base">
                      Certified Personal Trainer
                    </p>
                    <p className="text-[#64748B] text-xs mt-1">12 Weeks · Advanced Curriculum</p>
                  </div>

                  {/* Medal */}
                  <motion.div
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-5xl my-3"
                  >
                    🏅
                  </motion.div>

                  {/* Cert details */}
                  <div className="flex items-center justify-between text-xs text-[#64748B] border-t border-slate-100 pt-4 mt-2">
                    <div>
                      <p className="font-medium text-[#0F172A]">GS-2024-001240</p>
                      <p>Certificate ID</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div>
                      <p className="font-medium text-[#0F172A]">Jan 15, 2024</p>
                      <p>Issue Date</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div>
                      <p className="font-medium text-emerald-600">✓ Verified</p>
                      <p>Status</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating verify badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -right-5 bg-emerald-500 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                <span className="text-white text-xs font-bold">Blockchain Verified</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[#60A5FA] text-sm font-medium mb-4">
                Digital Certificates
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Earn Certificates That{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#93C5FD]">
                  Actually Matter
                </span>
              </h2>
              <p className="mt-4 text-blue-200 text-lg leading-relaxed">
                Our certificates are professionally designed, digitally verified,
                and instantly shareable. Employers trust GradSeal credentials
                because they can verify them in seconds.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {certFeatures.map((feat, index) => (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors"
                  >
                    <div className="text-2xl mb-2">{feat.icon}</div>
                    <h3 className="font-semibold text-white text-sm mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-blue-200 text-xs leading-relaxed">
                      {feat.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/certificates/verify"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#2563EB] font-semibold text-sm hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Verify a Certificate
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/student/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/30 text-white font-semibold text-sm hover:border-white hover:bg-white/10 transition-colors"
                >
                  Get Certified
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
