"use client";

import { useState, useTransition, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ShieldCheck, ShieldX, Loader2, Copy, Check, ExternalLink, BadgeCheck } from "lucide-react";
import { verifyCertificateNumber, type VerifyCertificateResult } from "@/app/certificates/verify/actions";
import { levelLabel } from "@/components/courses/courseFormat";

const MAX_LENGTH = 12;

function formatForDisplay(value: string): string {
  return value.replace(/(\d{4})(?=\d)/g, "$1-");
}

function sanitizeInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, MAX_LENGTH);
}

export default function VerifyCertificateForm() {
  const inputId = useId();
  const [rawValue, setRawValue] = useState("");
  const [result, setResult] = useState<VerifyCertificateResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rawValue.length !== MAX_LENGTH) {
      setResult({ status: "invalid" });
      return;
    }
    startTransition(async () => {
      const outcome = await verifyCertificateNumber(rawValue);
      setResult(outcome);
    });
  };

  const handleReset = () => {
    setRawValue("");
    setResult(null);
    setCopied(false);
  };

  const handleCopy = async (certificateNumber: string) => {
    await navigator.clipboard.writeText(certificateNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-slate-100 p-6 sm:p-8"
      >
        <label htmlFor={inputId} className="block text-sm font-semibold text-[#0F172A] mb-2">
          Certificate Number
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            placeholder="e.g. 1234-5678-9012"
            value={formatForDisplay(rawValue)}
            onChange={(e) => setRawValue(sanitizeInput(e.target.value))}
            className="flex-1 px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-[#F8FAFC] text-[#0F172A] font-mono text-lg tracking-[0.15em] placeholder:tracking-normal placeholder:font-sans placeholder:text-base placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={isPending || rawValue.length === 0}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Verify
          </button>
        </div>
        <p className="mt-2.5 text-xs text-[#94A3B8]">
          A 12-digit number found at the bottom of every GradSeal certificate.
        </p>
      </motion.form>

      <AnimatePresence mode="wait">
        {result?.status === "invalid" && (
          <motion.div
            key="invalid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4"
          >
            <ShieldX className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              That doesn&apos;t look like a valid certificate number. It should be exactly 12 digits.
            </p>
          </motion.div>
        )}

        {result?.status === "not_found" && (
          <motion.div
            key="not-found"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-6 text-center"
          >
            <ShieldX className="w-9 h-9 text-rose-500 mx-auto mb-3" />
            <p className="font-bold text-[#0F172A]">This certificate doesn&apos;t exist</p>
            <p className="mt-1 text-sm text-rose-700">
              We couldn&apos;t find a certificate matching{" "}
              <span className="font-mono font-semibold">{formatForDisplay(result.certificateNumber)}</span>.
              Double-check the number and try again.
            </p>
          </motion.div>
        )}

        {result?.status === "found" && (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white ring-1 ring-slate-100">
                <div className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] px-8 py-6 text-center relative overflow-hidden">
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 30%, white 0%, transparent 40%), radial-gradient(circle at 80% 70%, white 0%, transparent 40%)",
                    }}
                  />
                  <div className="relative flex items-center justify-center gap-2 text-white font-bold text-xl">
                    <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm font-extrabold">
                      G
                    </span>
                    GradSeal
                  </div>
                  <p className="relative text-blue-100 text-xs mt-1.5 tracking-[0.2em] uppercase">
                    Certificate of Completion
                  </p>
                </div>

                <div className="px-8 py-8 text-center">
                  <p className="text-[#64748B] text-xs uppercase tracking-wider mb-2">This certifies that</p>
                  <p className="text-3xl font-extrabold text-[#0F172A] mb-1">{result.certificate.studentName}</p>
                  <p className="text-[#64748B] text-xs mb-4">has successfully completed the course</p>

                  <div className="bg-[#EFF6FF] rounded-xl px-6 py-4 mb-5">
                    <p className="font-bold text-[#2563EB] text-lg">{result.certificate.course.title}</p>
                    <p className="text-[#64748B] text-xs mt-1">
                      {levelLabel[result.certificate.course.level]} · {result.certificate.course.duration} ·{" "}
                      {result.certificate.course.totalHours}h
                    </p>
                    {result.certificate.course.categories.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                        {result.certificate.course.categories.map((cat) => (
                          <span
                            key={cat.id}
                            className="px-2.5 py-0.5 rounded-full bg-white text-[#2563EB] text-[11px] font-semibold"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {result.certificate.course.thumbnail && (
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <Image
                        src={result.certificate.course.thumbnail}
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 text-xs text-[#64748B] border-t border-slate-100 pt-4 mt-2">
                    <div>
                      <button
                        type="button"
                        onClick={() => handleCopy(result.certificate.certificateNumber)}
                        className="inline-flex items-center gap-1 font-medium text-[#0F172A] hover:text-[#2563EB] transition-colors"
                      >
                        {formatForDisplay(result.certificate.certificateNumber)}
                        {copied ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-[#94A3B8]" />
                        )}
                      </button>
                      <p>Certificate ID</p>
                    </div>
                    <div>
                      <p className="font-medium text-[#0F172A]">
                        {new Date(result.certificate.issuedAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p>Issue Date</p>
                    </div>
                    <div>
                      <p className="font-medium text-[#0F172A]">{result.certificate.overallScore}%</p>
                      <p>Overall Score</p>
                    </div>
                    <div>
                      <p className="font-medium text-emerald-600">✓ Verified</p>
                      <p>Status</p>
                    </div>
                  </div>

                  {result.certificate.certificateUrl && (
                    <Link
                      href={result.certificate.certificateUrl}
                      target="_blank"
                      className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-semibold transition-colors"
                    >
                      View Full Certificate
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -right-3 sm:-right-5 bg-emerald-500 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-bold">Verified Authentic</span>
              </motion.div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#64748B]">
              <BadgeCheck className="w-4 h-4 text-emerald-500" />
              Issued and verified by GradSeal.
              <button
                type="button"
                onClick={handleReset}
                className="font-semibold text-[#2563EB] hover:underline"
              >
                Verify another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
