import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth/session";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import DiscoverCoursesSection from "@/components/dashboard/DiscoverCoursesSection";
import TrendingCoursesSection from "@/components/dashboard/TrendingCoursesSection";
import RecentlyAddedSection from "@/components/dashboard/RecentlyAddedSection";
import { getDashboardCourseSections } from "@/lib/courses";
import { getWishlistedCourseIds } from "@/lib/wishlist";

export const metadata: Metadata = { title: "Dashboard – GradSeal" };

export default async function StudentDashboardPage() {
  const student = await getStudentSession();
  if (!student) {
    redirect("/student/login");
  }

  const [{ discover, trending, recentlyAdded }, wishlistedCourseIds] = await Promise.all([
    getDashboardCourseSections(),
    getWishlistedCourseIds(student.id),
  ]);

  return (
    <div className="space-y-10">
      <WelcomeSection
        firstName={student.firstName}
        lastName={student.lastName}
        email={student.email}
        profileImage={student.profileImage}
      />
      <DiscoverCoursesSection courses={discover} wishlistedCourseIds={wishlistedCourseIds} />
      <TrendingCoursesSection courses={trending} wishlistedCourseIds={wishlistedCourseIds} />
      <RecentlyAddedSection courses={recentlyAdded} wishlistedCourseIds={wishlistedCourseIds} />
    </div>
  );
}
