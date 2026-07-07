import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Verify Certificate – GradSeal" };

export default function VerifyCertificatePage() {
  return (
    <ComingSoon
      title="Verify a Certificate"
      description="Enter a GradSeal certificate ID or scan the QR code to instantly verify its authenticity. Verification tool is coming soon."
    />
  );
}
