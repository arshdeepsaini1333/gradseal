import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "About GradSeal" };

export default function AboutPage() {
  return (
    <ComingSoon
      title="About GradSeal"
      description="Learn about our mission to make professional fitness education accessible to everyone, everywhere. Our story is coming soon."
    />
  );
}
