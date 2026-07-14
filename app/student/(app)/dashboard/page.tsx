import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth/session";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import DiscoverCoursesSection from "@/components/dashboard/DiscoverCoursesSection";
import TrendingCoursesSection from "@/components/dashboard/TrendingCoursesSection";
import RecentlyAddedSection from "@/components/dashboard/RecentlyAddedSection";
import { discoverCourses, trendingCourses, recentlyAddedCourses } from "@/lib/mock-dashboard-data";

export const metadata: Metadata = { title: "Dashboard – GradSeal" };

export default async function StudentDashboardPage() {
  const student = await getStudentSession();
  if (!student) {
    redirect("/student/login");
  }

  return (
    <div className="space-y-10">
      <WelcomeSection firstName={student.firstName} profileImage={student.profileImage} />
      <DiscoverCoursesSection courses={discoverCourses} />
      <TrendingCoursesSection courses={trendingCourses} />
      <RecentlyAddedSection courses={recentlyAddedCourses} />
    </div>
  );
}
