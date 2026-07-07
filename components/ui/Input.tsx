import { ComponentPropsWithoutRef } from "react";
import type { LucideIcon } from "lucide-react";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  name: string;
  icon?: LucideIcon;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  name,
  icon: Icon,
  error,
  hint,
  required,
  className = "",
  ...props
}: InputProps) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-[#0F172A]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#94A3B8]"
            aria-hidden="true"
          />
        )}
        <input
          id={name}
          name={name}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] ${
            Icon ? "pl-10" : ""
          } ${error ? "border-red-400" : "border-slate-200"} ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-[#94A3B8]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
