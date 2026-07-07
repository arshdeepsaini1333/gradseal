import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Forgot Password – GradSeal" };

export default function ForgotPasswordPage() {
  return (
    <ComingSoon
      title="Reset Your Password"
      description="Enter your email to receive a password reset link. This feature is coming soon."
    />
  );
}
