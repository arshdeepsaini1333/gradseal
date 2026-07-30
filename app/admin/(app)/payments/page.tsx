import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Payments – GradSeal Admin" };

export default function AdminPaymentsPage() {
  return (
    <ComingSoon
      chromeless
      title="Payments"
      description="The Payments module is coming soon."
      backHref="/admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
