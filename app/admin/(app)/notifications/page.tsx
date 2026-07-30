import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Notifications – GradSeal Admin" };

export default function AdminNotificationsPage() {
  return (
    <ComingSoon
      chromeless
      title="Notifications"
      description="The Notifications module is coming soon."
      backHref="/admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
