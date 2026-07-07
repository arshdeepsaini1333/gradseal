import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Terms & Conditions – GradSeal" };

export default function TermsAndConditionsPage() {
  return (
    <ComingSoon
      title="Terms & Conditions"
      description="Our complete terms of service governing your use of the GradSeal platform. Coming soon."
    />
  );
}
