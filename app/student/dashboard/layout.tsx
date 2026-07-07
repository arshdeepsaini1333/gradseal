import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth/session";
import AuthenticatedNavbar from "@/components/navbar/AuthenticatedNavbar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { mockCartSummary, mockNotificationSummary } from "@/lib/mock-dashboard-data";

export const metadata: Metadata = { title: "Student Dashboard – GradSeal" };

export default async function StudentDashboardLayout({ children }: { children: ReactNode }) {
  const student = await getStudentSession();
  if (!student) {
    redirect("/student/login");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AuthenticatedNavbar
        student={student}
        cartItemCount={mockCartSummary.itemCount}
        unreadNotificationCount={mockNotificationSummary.unreadCount}
      />
      <div className="pt-16">
        <DashboardSidebar />
        <main className="p-6 md:ml-64">{children}</main>
      </div>
    </div>
  );
}
