import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  tone?: "default" | "danger";
  contentClassName?: string;
}

export default function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  tone = "default",
  contentClassName = "grid grid-cols-1 gap-5 sm:grid-cols-2",
}: SectionCardProps) {
  const isDanger = tone === "danger";

  return (
    <section
      className={`rounded-2xl border bg-white p-6 shadow-sm sm:p-8 ${
        isDanger ? "border-red-200/80" : "border-slate-200/80"
      }`}
    >
      <div className="mb-6 flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isDanger ? "bg-red-50 text-red-600" : "bg-blue-50 text-[#2563EB]"
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">{title}</h2>
          {description && (
            <p className="text-sm text-[#64748B]">{description}</p>
          )}
        </div>
      </div>
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
