"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { subscribeNewsletter } from "@/actions/contact";

export default function Newsletter() {
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, undefined);
  const [error, setError] = useState<string | null>(null);
  const id = useId();

  useEffect(() => {
    if (state?.errors?.email?.[0]) {
      setError(state.errors.email[0]);
    } else if (state?.success) {
      setError(null);
    }
  }, [state]);

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl p-8 sm:p-12 text-center shadow-xl"
        >
          <div
            aria-hidden
            className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#2563EB]/10 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-[#06B6D4]/10 blur-3xl pointer-events-none"
          />

          <div className="relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white mb-5 shadow-lg shadow-blue-500/30">
              <Mail className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
              Stay Updated
            </h2>
            <p className="mt-3 text-[#64748B] max-w-md mx-auto">
              Receive updates about new courses, certifications, webinars, and
              fitness tips.
            </p>

            <div className="mt-8 max-w-md mx-auto">
              <AnimatePresence mode="wait">
                {state?.success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-5 py-4 text-emerald-600 font-semibold text-sm"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {state.message ?? "You're subscribed!"}
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    action={formAction}
                    onSubmit={() => setError(null)}
                    noValidate
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <label htmlFor={id} className="sr-only">
                      Email address
                    </label>
                    <input
                      id={id}
                      name="email"
                      type="email"
                      required
                      inputMode="email"
                      placeholder="you@example.com"
                      onChange={() => error && setError(null)}
                      className={`w-full flex-1 rounded-xl border bg-white px-4 py-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] ${
                        error ? "border-red-400" : "border-slate-200"
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Subscribe
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
              {error && (
                <p role="alert" className="mt-2 text-xs font-medium text-red-500">
                  {error}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
