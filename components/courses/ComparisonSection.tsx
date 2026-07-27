"use client";

import { motion } from "framer-motion";
import { comparisonTracks, comparisonRows } from "@/lib/mockCourses";

export default function ComparisonSection() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
            Compare Tracks
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Which Certification{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Fits You?
            </span>
          </h2>
          <p className="mt-4 text-[#64748B] text-lg max-w-2xl mx-auto">
            Compare our most popular certification paths side by side.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm"
        >
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white p-5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">
                  Feature
                </th>
                {comparisonTracks.map((track) => (
                  <th key={track.id} className="p-5 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center text-2xl">
                        {track.icon}
                      </span>
                      <span className="font-bold text-[#0F172A] text-sm">{track.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, rowIndex) => (
                <tr key={row.feature} className={rowIndex % 2 === 0 ? "bg-[#F8FAFC]/60" : ""}>
                  <td className="sticky left-0 bg-inherit p-5 font-semibold text-[#0F172A] text-sm whitespace-nowrap">
                    {row.feature}
                  </td>
                  {row.values.map((value, colIndex) => {
                    const isBest = row.highlightBest === colIndex;
                    return (
                      <td key={colIndex} className="p-5 text-center">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                            isBest
                              ? "bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white shadow-sm"
                              : "text-[#334155]"
                          }`}
                        >
                          {value}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
