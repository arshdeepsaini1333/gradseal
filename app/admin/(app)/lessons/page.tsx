import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Lessons – GradSeal Admin" };

export default function AdminLessonsPage() {
  return (
    <ComingSoon
      chromeless
      title="Lessons"
      description="The Lessons module is coming soon."
      backHref="/admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
