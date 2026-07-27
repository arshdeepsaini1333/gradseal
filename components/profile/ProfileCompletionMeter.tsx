import { CheckCircle2, Circle } from "lucide-react";
import type { ProfileCompletion } from "@/lib/profile-completion";

function getBarColor(percent: number): string {
  if (percent >= 80) return "bg-emerald-500";
  if (percent >= 50) return "bg-amber-500";
  return "bg-red-500";
}

export default function ProfileCompletionMeter({ percent, items }: ProfileCompletion) {
  const pending = items.filter((item) => !item.done);

  if (pending.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
        <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Your profile is 100% complete</p>
          <p className="text-sm text-emerald-700">
            Nice work — your full details will show up wherever they&apos;re needed, like certificates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">Profile completion</h2>
          <p className="text-sm text-[#64748B]">Complete your profile to get the most out of GradSeal.</p>
        </div>
        <span className="text-2xl font-extrabold text-[#0F172A]">{percent}%</span>
      </div>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${getBarColor(percent)}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="mt-5 flex flex-col gap-1">
        {pending.map((item) => (
          <li key={item.key}>
            <a
              href={`#${item.anchor}`}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[#334155] transition-colors hover:bg-slate-50 hover:text-[#2563EB]"
            >
              <Circle className="h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
              {item.label}
              <span className="ml-auto text-xs font-semibold text-[#2563EB]">Add +</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
