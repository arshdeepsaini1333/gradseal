import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Student Dashboard – GradSeal" };

export default function StudentDashboardPage() {
  return (
    <ComingSoon
      title="Student Dashboard"
      description="Track your course progress, download certificates, and manage your learning journey — all in one place. Dashboard is coming soon."
      showAuth
    />
  );
}
