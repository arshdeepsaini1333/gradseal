"use client";

import { useId, useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { getPasswordStrength } from "@/lib/password-strength";

interface PasswordFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  showStrength?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export default function PasswordField({
  label,
  name,
  error,
  required,
  autoComplete = "new-password",
  showStrength = false,
  value,
  onChange,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const errorId = `${name}-error`;
  const strength = showStrength ? getPasswordStrength(value) : null;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#0F172A]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Lock
          className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#94A3B8]"
          aria-hidden="true"
        />
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 pl-10 pr-11 text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] ${
            error ? "border-red-400" : "border-slate-200"
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2563EB] transition-colors"
        >
          {visible ? (
            <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
          ) : (
            <Eye className="h-4.5 w-4.5" aria-hidden="true" />
          )}
        </button>
      </div>

      {showStrength && value && strength && (
        <div className="flex items-center gap-2">
          <div className="flex h-1.5 flex-1 gap-1 overflow-hidden rounded-full bg-slate-100">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 rounded-full transition-colors"
                style={{
                  backgroundColor: i <= strength.score ? strength.color : undefined,
                }}
              />
            ))}
          </div>
          <span className="text-xs font-medium" style={{ color: strength.color }}>
            {strength.label}
          </span>
        </div>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
