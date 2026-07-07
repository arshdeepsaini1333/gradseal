import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Student Login – GradSeal" };

export default function StudentLoginPage() {
  return (
    <ComingSoon
      title="Student Login"
      description="Sign in to your GradSeal student account to access your courses, progress, and certificates. Student authentication is coming soon."
    />
  );
}
