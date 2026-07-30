import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Analytics – GradSeal Admin" };

export default function AdminAnalyticsPage() {
  return (
    <ComingSoon
      chromeless
      title="Analytics"
      description="The Analytics module is coming soon."
      backHref="/admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
