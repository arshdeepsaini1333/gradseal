import type { Metadata } from "next";
import { ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { testItems } from "@/lib/mock-dashboard-data";

export const metadata: Metadata = { title: "Tests & Assessments – GradSeal" };

export default function TestsPage() {
  const upcoming = testItems.filter((t) => t.status === "upcoming");
  const completed = testItems.filter((t) => t.status === "completed");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Tests & Assessments</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Track upcoming quizzes and review your past results.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#0F172A]">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-[#64748B]">No upcoming tests. You&apos;re all caught up.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((test) => (
              <div
                key={test.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                    <ClipboardList className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-[#0F172A]">{test.title}</p>
                    <p className="text-sm text-[#64748B]">{test.course}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-[#94A3B8]">
                      {test.dueDate && (
                        <span>
                          Due {new Date(test.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                      )}
                      {test.durationMinutes && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {test.durationMinutes} min
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="primary" className="sm:w-auto w-full">
                  Start Test
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#0F172A]">Completed</h2>
        {completed.length === 0 ? (
          <p className="text-sm text-[#64748B]">No completed tests yet.</p>
        ) : (
          <div className="space-y-3">
            {completed.map((test) => (
              <div
                key={test.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-[#0F172A]">{test.title}</p>
                    <p className="text-sm text-[#64748B]">{test.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-[#0F172A]">
                    {test.score}
                    <span className="text-sm font-medium text-[#94A3B8]">/{test.totalMarks}</span>
                  </p>
                  <p className="text-xs text-[#94A3B8]">Score</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
