import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Reviews – GradSeal Admin" };

export default function AdminReviewsPage() {
  return (
    <ComingSoon
      chromeless
      title="Reviews"
      description="The Reviews module is coming soon."
      backHref="/admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
