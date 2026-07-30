import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Certificates – GradSeal Admin" };

export default function AdminCertificatesPage() {
  return (
    <ComingSoon
      chromeless
      title="Certificates"
      description="The Certificates module is coming soon."
      backHref="/admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
