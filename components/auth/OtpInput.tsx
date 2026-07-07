"use client";

import { useRef, useState, ClipboardEvent, KeyboardEvent, ChangeEvent } from "react";

interface OtpInputProps {
  length?: number;
  name: string;
  error?: string;
  disabled?: boolean;
}

export default function OtpInput({
  length = 6,
  name,
  error,
  disabled = false,
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const errorId = `${name}-error`;

  function updateDigit(index: number, value: string) {
    const next = [...digits];
    next[index] = value;
    setDigits(next);
  }

  function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, "").slice(-1);
    updateDigit(index, value);
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    const next = Array(length).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    const lastIndex = Math.min(pasted.length, length) - 1;
    inputRefs.current[lastIndex]?.focus();
  }

  const code = digits.join("");

  return (
    <div>
      <input type="hidden" name={name} value={code} />
      <div className="flex justify-center gap-2 sm:gap-3" role="group" aria-label="One-time verification code">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`h-12 w-10 rounded-xl border text-center text-lg font-bold text-[#0F172A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] sm:h-14 sm:w-12 ${
              error ? "border-red-400" : "border-slate-200"
            } ${disabled ? "opacity-60" : ""}`}
          />
        ))}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-3 text-center text-xs font-medium text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}
