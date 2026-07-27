import { getStudentSession } from "@/lib/auth/session";
import { getStudentProfile } from "@/lib/students";
import { getProfileCompletion } from "@/lib/profile-completion";
import Navbar from "@/components/Navbar";
import AuthenticatedNavbar from "@/components/navbar/AuthenticatedNavbar";
import { mockCartSummary, mockNotificationSummary } from "@/lib/mock-dashboard-data";

export default async function AppNavbar() {
  const student = await getStudentSession();

  if (!student) {
    return <Navbar />;
  }

  const profile = await getStudentProfile();
  const profileCompletionPercent = profile ? getProfileCompletion(profile).percent : 0;

  return (
    <AuthenticatedNavbar
      student={student}
      cartItemCount={mockCartSummary.itemCount}
      unreadNotificationCount={mockNotificationSummary.unreadCount}
      profileCompletionPercent={profileCompletionPercent}
    />
  );
}
