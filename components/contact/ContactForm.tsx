"use client";

import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Send, User, Mail, Phone, type LucideIcon } from "lucide-react";

import { submitContactForm } from "@/actions/contact";
import { contactFormSchema, COURSE_INTEREST_OPTIONS, MESSAGE_MAX_LENGTH } from "@/lib/validations/contact";

// ---------------------------------------------------------------------------
// Floating-label field primitives (scoped to the contact form)
// ---------------------------------------------------------------------------

interface FloatingInputProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  name: string;
  error?: string;
  icon?: LucideIcon;
}

function FloatingInput({ label, name, error, icon: Icon, className = "", ...props }: FloatingInputProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]"
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          name={name}
          placeholder=" "
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`peer w-full rounded-xl border bg-white px-4 pt-5 pb-2 text-sm text-[#0F172A] placeholder-transparent transition-all outline-none focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] ${
            Icon ? "pl-10" : ""
          } ${error ? "border-red-400" : "border-slate-200"} ${className}`}
          {...props}
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute top-3.5 text-sm text-[#94A3B8] transition-all peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[#2563EB] peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-[10px] ${
            Icon ? "left-10" : "left-4"
          }`}
        >
          {label}
        </label>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

interface FloatingSelectProps extends ComponentPropsWithoutRef<"select"> {
  label: string;
  name: string;
  error?: string;
  options: readonly string[];
}

function FloatingSelect({ label, name, error, options, className = "", ...props }: FloatingSelectProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <select
          id={id}
          name={name}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`peer w-full appearance-none rounded-xl border bg-white px-4 pt-5 pb-2 text-sm text-[#0F172A] transition-all outline-none focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] ${
            error ? "border-red-400" : "border-slate-200"
          } ${className}`}
          {...props}
        >
          <option value=""></option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-1.5 text-[10px] text-[#2563EB]"
        >
          {label}
        </label>
        <svg
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && (
        <p role="alert" className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ripple + magnetic submit button
// ---------------------------------------------------------------------------

function SubmitButton({ pending }: { pending: boolean }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId = useRef(0);

  const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = rippleId.current++;
    setRipples((prev) => [
      ...prev,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);
  };

  return (
    <motion.button
      type="submit"
      disabled={pending}
      onClick={handleClick}
      whileHover={{ scale: pending ? 1 : 1.02 }}
      whileTap={{ scale: pending ? 1 : 0.98 }}
      className="relative overflow-hidden w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-shadow hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 400, height: 400, opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{ left: r.x, top: r.y }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40"
        />
      ))}
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          Send Message
          <Send className="w-4 h-4" />
        </>
      )}
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, undefined);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      setSubmitted(true);
      formRef.current?.reset();
      setMessage("");
      setAgree(false);
      setFieldErrors({});
    } else if (state?.errors) {
      setFieldErrors(
        Object.fromEntries(
          Object.entries(state.errors)
            .filter(([, msgs]) => msgs && msgs.length > 0)
            .map(([field, msgs]) => [field, msgs![0]])
        )
      );
    }
  }, [state]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const result = contactFormSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      courseInterest: formData.get("courseInterest"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      agreeToPolicy: formData.get("agreeToPolicy"),
    });

    if (!result.success) {
      const { fieldErrors: errors } = result.error.flatten();
      setFieldErrors(
        Object.fromEntries(
          Object.entries(errors)
            .filter(([, msgs]) => msgs && msgs.length > 0)
            .map(([field, msgs]) => [field, msgs![0]])
        )
      );
      e.preventDefault();
    } else {
      setFieldErrors({});
    }
  }

  const charCount = message.length;
  const charLimit = MESSAGE_MAX_LENGTH;
  const charPct = Math.min(100, (charCount / charLimit) * 100);

  return (
    <section id="contact-form" className="py-24 bg-[#F8FAFC] scroll-mt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Send Us a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Message
            </span>
          </h2>
          <p className="mt-4 text-[#64748B] text-lg">
            Fill out the form below and our team will get back to you shortly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 p-6 sm:p-10 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-11 h-11 text-emerald-500" />
                </motion.div>
                <h3 className="text-2xl font-extrabold text-[#0F172A] mb-2">
                  Message Sent!
                </h3>
                <p className="text-[#64748B] max-w-sm mb-8">
                  {state?.message ??
                    "Thanks for reaching out. Our team will get back to you within 24 hours."}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 rounded-xl border-2 border-[#2563EB] text-[#2563EB] text-sm font-semibold hover:bg-[#2563EB] hover:text-white transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                action={formAction}
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-5"
              >
                {state?.message && !state.success && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600"
                  >
                    {state.message}
                  </motion.div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <FloatingInput
                    label="First Name"
                    name="firstName"
                    icon={User}
                    required
                    autoComplete="given-name"
                    error={fieldErrors.firstName}
                    onChange={() => fieldErrors.firstName && setFieldErrors((p) => ({ ...p, firstName: "" }))}
                  />
                  <FloatingInput
                    label="Last Name"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    error={fieldErrors.lastName}
                    onChange={() => fieldErrors.lastName && setFieldErrors((p) => ({ ...p, lastName: "" }))}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <FloatingInput
                    label="Email"
                    name="email"
                    type="email"
                    icon={Mail}
                    required
                    autoComplete="email"
                    inputMode="email"
                    error={fieldErrors.email}
                    onChange={() => fieldErrors.email && setFieldErrors((p) => ({ ...p, email: "" }))}
                  />
                  <FloatingInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    icon={Phone}
                    autoComplete="tel"
                    inputMode="tel"
                    error={fieldErrors.phone}
                    onChange={() => fieldErrors.phone && setFieldErrors((p) => ({ ...p, phone: "" }))}
                  />
                </div>

                <FloatingSelect
                  label="Course Interested In"
                  name="courseInterest"
                  required
                  options={COURSE_INTEREST_OPTIONS}
                  error={fieldErrors.courseInterest}
                  onChange={() =>
                    fieldErrors.courseInterest && setFieldErrors((p) => ({ ...p, courseInterest: "" }))
                  }
                />

                <FloatingInput
                  label="Subject"
                  name="subject"
                  required
                  error={fieldErrors.subject}
                  onChange={() => fieldErrors.subject && setFieldErrors((p) => ({ ...p, subject: "" }))}
                />

                <div className="flex flex-col gap-1.5">
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      placeholder=" "
                      required
                      rows={5}
                      maxLength={charLimit}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (fieldErrors.message) setFieldErrors((p) => ({ ...p, message: "" }));
                      }}
                      aria-invalid={!!fieldErrors.message}
                      className={`peer w-full resize-none rounded-xl border bg-white px-4 pt-5 pb-2 text-sm text-[#0F172A] placeholder-transparent transition-all outline-none focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] ${
                        fieldErrors.message ? "border-red-400" : "border-slate-200"
                      }`}
                    />
                    <label
                      htmlFor="message"
                      className="pointer-events-none absolute left-4 top-3.5 text-sm text-[#94A3B8] transition-all peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[#2563EB] peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-[10px]"
                    >
                      Message
                    </label>
                    <span
                      className={`absolute bottom-2 right-3 text-[10px] font-medium ${
                        charPct > 90 ? "text-amber-500" : "text-[#94A3B8]"
                      }`}
                    >
                      {charCount}/{charLimit}
                    </span>
                  </div>
                  {fieldErrors.message && (
                    <p role="alert" className="text-xs font-medium text-red-500">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="agreeToPolicy"
                      checked={agree}
                      onChange={(e) => {
                        setAgree(e.target.checked);
                        if (fieldErrors.agreeToPolicy)
                          setFieldErrors((p) => ({ ...p, agreeToPolicy: "" }));
                      }}
                      className="peer sr-only"
                    />
                    <span
                      className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                        agree ? "bg-[#2563EB] border-[#2563EB]" : "border-slate-300"
                      }`}
                    >
                      {agree && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </span>
                    <span className="text-sm text-[#64748B]">
                      I agree to the{" "}
                      <Link href="/privacy-policy" className="font-semibold text-[#2563EB] hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {fieldErrors.agreeToPolicy && (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-red-500">
                      {fieldErrors.agreeToPolicy}
                    </p>
                  )}
                </div>

                <SubmitButton pending={isPending} />
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
