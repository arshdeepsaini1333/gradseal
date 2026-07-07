import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Privacy Policy – GradSeal" };

export default function PrivacyPolicyPage() {
  return (
    <ComingSoon
      title="Privacy Policy"
      description="Our full privacy policy outlining how we collect, use, and protect your data. Coming soon."
    />
  );
}
