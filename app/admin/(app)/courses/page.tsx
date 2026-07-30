import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Courses – GradSeal Admin" };

export default function AdminCoursesPage() {
  return (
    <ComingSoon
      chromeless
      title="Courses"
      description="The Courses module is coming soon."
      backHref="/admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
