import { ComponentPropsWithoutRef } from "react";

interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  label: string;
  name: string;
  error?: string;
}

export default function Textarea({
  label,
  name,
  error,
  required,
  className = "",
  ...props
}: TextareaProps) {
  const errorId = `${name}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-[#0F172A]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        rows={3}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full resize-none rounded-xl border bg-white px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] ${
          error ? "border-red-400" : "border-slate-200"
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
