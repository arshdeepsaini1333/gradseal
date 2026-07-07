import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Certificates – GradSeal" };

export default function CertificatesPage() {
  return (
    <ComingSoon
      title="Certificates"
      description="View and manage your earned GradSeal certificates. Certificate management is coming soon."
      showAuth
    />
  );
}
