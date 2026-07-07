import type { DashboardStat } from "@/types/dashboard";

interface StatsGridProps {
  stats: DashboardStat[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-[#2563EB] mb-4">
            <stat.icon className="w-5 h-5" aria-hidden="true" />
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A]">{stat.value}</p>
          <p className="mt-1 text-sm font-semibold text-[#0F172A]">{stat.label}</p>
          <p className="mt-0.5 text-sm text-[#64748B]">{stat.description}</p>
        </div>
      ))}
    </section>
  );
}
