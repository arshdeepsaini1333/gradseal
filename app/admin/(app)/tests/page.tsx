import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Tests & Quizzes – GradSeal Admin" };

export default function AdminTestsPage() {
  return (
    <ComingSoon
      chromeless
      title="Tests & Quizzes"
      description="The Tests & Quizzes module is coming soon."
      backHref="/admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
