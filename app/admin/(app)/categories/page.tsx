import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Categories – GradSeal Admin" };

export default function AdminCategoriesPage() {
  return (
    <ComingSoon
      chromeless
      title="Categories"
      description="The Categories module is coming soon."
      backHref="/admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
