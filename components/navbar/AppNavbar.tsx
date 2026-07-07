import { getStudentSession } from "@/lib/auth/session";
import Navbar from "@/components/Navbar";
import AuthenticatedNavbar from "@/components/navbar/AuthenticatedNavbar";
import { mockCartSummary, mockNotificationSummary } from "@/lib/mock-dashboard-data";

export default async function AppNavbar() {
  const student = await getStudentSession();

  if (!student) {
    return <Navbar />;
  }

  return (
    <AuthenticatedNavbar
      student={student}
      cartItemCount={mockCartSummary.itemCount}
      unreadNotificationCount={mockNotificationSummary.unreadCount}
    />
  );
}
