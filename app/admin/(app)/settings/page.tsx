import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Settings – GradSeal Admin" };

export default function AdminSettingsPage() {
  return (
    <ComingSoon
      chromeless
      title="Settings"
      description="The Settings module is coming soon."
      backHref="/admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
