import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Students – GradSeal Admin" };

export default function AdminStudentsPage() {
  return (
    <ComingSoon
      chromeless
      title="Students"
      description="The Students module is coming soon."
      backHref="/admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
