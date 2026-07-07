import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "All Courses – GradSeal" };

export default function CoursesPage() {
  return (
    <ComingSoon
      title="Browse All Courses"
      description="Explore our full catalog of professional fitness certification courses. Course listing page is coming soon."
      showAuth
    />
  );
}
