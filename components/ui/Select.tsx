import { ComponentPropsWithoutRef } from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  label: string;
  name: string;
  icon?: LucideIcon;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function Select({
  label,
  name,
  icon: Icon,
  error,
  options,
  placeholder = "Select an option",
  required,
  className = "",
  ...props
}: SelectProps) {
  const errorId = `${name}-error`;

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
        <select
          id={name}
          name={name}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full appearance-none rounded-xl border bg-white px-4 py-2.5 pr-10 text-sm text-[#0F172A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] ${
            Icon ? "pl-10" : ""
          } ${error ? "border-red-400" : "border-slate-200"} ${className}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
          aria-hidden="true"
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
