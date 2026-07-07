import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Course Detail – GradSeal" };

export default function CourseDetailPage() {
  return (
    <ComingSoon
      title="Course Detail"
      description="Full course details, curriculum, instructor profile, and enrollment options are coming soon."
      showAuth
    />
  );
}
