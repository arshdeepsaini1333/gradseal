import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Admin Dashboard – GradSeal" };

export default function AdminDashboardPage() {
  return (
    <ComingSoon
      title="Admin Dashboard"
      description="Manage courses, students, certificates, and platform settings from the GradSeal admin panel. Coming soon."
    />
  );
}
