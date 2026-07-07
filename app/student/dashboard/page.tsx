import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth/session";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsGrid from "@/components/dashboard/StatsGrid";
import ContinueLearningSection from "@/components/dashboard/ContinueLearningSection";
import { dashboardStats, continueLearningCourses } from "@/lib/mock-dashboard-data";

export const metadata: Metadata = { title: "Dashboard – GradSeal" };

export default async function StudentDashboardPage() {
  const student = await getStudentSession();
  if (!student) {
    redirect("/student/login");
  }

  return (
    <div className="space-y-8">
      <WelcomeSection firstName={student.firstName} profileImage={student.profileImage} />
      <StatsGrid stats={dashboardStats} />
      <ContinueLearningSection courses={continueLearningCourses} />
    </div>
  );
}
