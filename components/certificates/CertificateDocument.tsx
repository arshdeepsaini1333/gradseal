"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Award, Printer, ShieldCheck } from "lucide-react";
import type { VerifiedCertificate } from "@/lib/certificates";
import { levelLabel } from "@/components/courses/courseFormat";

function formatCertificateNumber(value: string): string {
  return value.replace(/(\d{4})(?=\d)/g, "$1-");
}

export default function CertificateDocument({ certificate }: { certificate: VerifiedCertificate }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 py-10 px-4">
      <div className="no-print mx-auto max-w-4xl flex items-center justify-between mb-6">
        <Link
          href="/certificates/verify"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#475569] hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Verify
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </button>
      </div>

      <div className="mx-auto max-w-4xl rounded-[2rem] p-[3px] bg-gradient-to-br from-slate-300 via-white to-blue-100 shadow-xl print:shadow-none">
        <div className="relative rounded-[calc(2rem-3px)] bg-white px-8 py-12 sm:px-16 sm:py-16 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 10% 10%, #64748B 0%, transparent 35%), radial-gradient(circle at 90% 90%, #3B82F6 0%, transparent 35%)",
            }}
          />
          <div className="absolute inset-4 rounded-[1.5rem] border border-slate-200 pointer-events-none" />

          <div className="relative text-center">
            <div className="relative w-40 h-10 mx-auto mb-1">
              <Image src="/gradsealLogo.png" alt="GradSeal" fill priority className="object-contain" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#94A3B8] font-semibold">
              Certificate of Completion
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-slate-300" />
              <Award className="w-8 h-8 text-[#3B82F6]" strokeWidth={1.5} />
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-slate-300" />
            </div>

            <p className="mt-8 text-xs uppercase tracking-widest text-[#94A3B8]">This certifies that</p>
            <p className="mt-3 text-4xl sm:text-5xl font-extrabold text-[#0F172A] font-serif">
              {certificate.studentName}
            </p>
            <p className="mt-4 text-sm text-[#64748B]">has successfully completed the course</p>
            <p className="mt-3 text-2xl font-bold text-[#1E293B]">{certificate.course.title}</p>
            <p className="mt-1.5 text-xs text-[#94A3B8]">
              {levelLabel[certificate.course.level]} · {certificate.course.duration} ·{" "}
              {certificate.course.totalHours}h
            </p>

            {certificate.course.categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                {certificate.course.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="px-3 py-1 rounded-full bg-blue-50 text-[#1D4ED8] text-[11px] font-semibold"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6 max-w-lg mx-auto">
              <div>
                <p className="font-mono text-sm font-semibold text-[#0F172A]">
                  {formatCertificateNumber(certificate.certificateNumber)}
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Certificate ID</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  {certificate.issuedAt.toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Issue Date</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#2563EB]">{certificate.overallScore}%</p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Overall Score</p>
              </div>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-[#475569]">
              <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
              Issued and verified by GradSeal
            </div>
          </div>
        </div>
      </div>

      <p className="no-print mx-auto max-w-4xl text-center text-xs text-[#94A3B8] mt-6">
        Anyone can verify this certificate on the{" "}
        <Link href="/certificates/verify" className="underline hover:text-[#475569]">
          GradSeal Verify Certificate page
        </Link>{" "}
        using the certificate ID above.
      </p>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
