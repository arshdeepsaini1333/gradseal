import type { Metadata } from "next";
import { FileCheck2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { assignmentItems } from "@/lib/mock-dashboard-data";
import type { AssignmentItem } from "@/types/dashboard";

export const metadata: Metadata = { title: "Assignments – GradSeal" };

const statusStyles: Record<AssignmentItem["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  submitted: "bg-blue-50 text-[#2563EB]",
  graded: "bg-emerald-100 text-emerald-700",
};

const statusLabels: Record<AssignmentItem["status"], string> = {
  pending: "Pending",
  submitted: "Submitted",
  graded: "Graded",
};

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Assignments</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Practical work assigned across your enrolled courses.
        </p>
      </div>

      {assignmentItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <p className="text-[#0F172A] font-semibold">No assignments yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignmentItems.map((assignment) => (
            <div
              key={assignment.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <FileCheck2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-[#0F172A]">{assignment.title}</p>
                  <p className="text-sm text-[#64748B]">{assignment.course}</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Due {new Date(assignment.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {assignment.grade && (
                  <span className="text-sm font-bold text-[#0F172A]">Grade: {assignment.grade}</span>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[assignment.status]}`}
                >
                  {statusLabels[assignment.status]}
                </span>
                {assignment.status === "pending" && (
                  <Button variant="primary" className="hidden sm:inline-flex">
                    Submit
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
