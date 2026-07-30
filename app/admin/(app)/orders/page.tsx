import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Orders – GradSeal Admin" };

export default function AdminOrdersPage() {
  return (
    <ComingSoon
      chromeless
      title="Orders"
      description="The Orders module is coming soon."
      backHref="/admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
