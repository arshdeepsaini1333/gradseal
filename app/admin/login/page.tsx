import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Admin Login – GradSeal" };

export default function AdminLoginPage() {
  return (
    <ComingSoon
      title="Admin Login"
      description="GradSeal admin panel access. Admin authentication is coming soon."
    />
  );
}
