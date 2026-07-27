"use client";

import { motion } from "framer-motion";
import {
  Award,
  Users,
  Clock,
  ClipboardCheck,
  Infinity as InfinityIcon,
  Smartphone,
  Download,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Award, title: "Industry-recognized Certifications", description: "Credentials employers and clients trust and can verify instantly." },
  { icon: Users, title: "Expert Trainers", description: "Learn from certified professionals with real industry experience." },
  { icon: Clock, title: "Flexible Online Learning", description: "Study whenever it suits you — no fixed schedules or missed classes." },
  { icon: ClipboardCheck, title: "Practical Assessments", description: "Hands-on evaluations that reinforce real, applicable skills." },
  { icon: InfinityIcon, title: "Lifetime Access", description: "Revisit your course materials anytime, even after certifying." },
  { icon: Smartphone, title: "Mobile Learning", description: "Learn on any device — desktop, tablet, or phone, seamlessly." },
  { icon: Download, title: "Downloadable Resources", description: "Worksheets, templates, and guides you can keep and reuse." },
  { icon: Briefcase, title: "Career Guidance", description: "Support and resources to help you launch your fitness career." },
];

export default function WhyGradSeal() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative lg:sticky lg:top-28"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
              Why GradSeal
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-6">
              Why Learn With{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
                GradSeal
              </span>
            </h2>
            <p className="text-[#64748B] text-lg leading-relaxed mb-8 max-w-md">
              A marketplace built specifically for fitness professionals — with
              the credibility, flexibility, and support to make certification
              worth your time.
            </p>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white text-xl">
                  🎓
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A] text-sm">50+ Courses</p>
                  <p className="text-xs text-[#64748B]">Across 8 specializations</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["🏋️ Gym", "🧘 Yoga", "🥗 Diet", "⚡ S&C"].map((label) => (
                  <div key={label} className="rounded-xl bg-[#F8FAFC] px-3 py-2.5 text-xs font-medium text-[#0F172A] text-center">
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <h3 className="font-bold text-[#0F172A] text-base mb-1.5">{feature.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
