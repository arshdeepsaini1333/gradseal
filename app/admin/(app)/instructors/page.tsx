import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Instructors – GradSeal Admin" };

export default function AdminInstructorsPage() {
  return (
    <ComingSoon
      chromeless
      title="Instructors"
      description="The Instructors module is coming soon."
      backHref="/admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
