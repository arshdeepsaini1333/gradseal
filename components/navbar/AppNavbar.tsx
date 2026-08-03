import { getStudentSession } from "@/lib/auth/session";
import { getStudentProfile } from "@/lib/students";
import { getProfileCompletion } from "@/lib/profile-completion";
import { getCartCount } from "@/lib/cart";
import Navbar from "@/components/Navbar";
import AuthenticatedNavbar from "@/components/navbar/AuthenticatedNavbar";
import { mockNotificationSummary } from "@/lib/mock-dashboard-data";

export default async function AppNavbar() {
  const student = await getStudentSession();

  if (!student) {
    return <Navbar />;
  }

  const [profile, cartItemCount] = await Promise.all([
    getStudentProfile(),
    getCartCount(student.id),
  ]);
  const profileCompletionPercent = profile ? getProfileCompletion(profile).percent : 0;

  return (
    <AuthenticatedNavbar
      student={student}
      cartItemCount={cartItemCount}
      unreadNotificationCount={mockNotificationSummary.unreadCount}
      profileCompletionPercent={profileCompletionPercent}
    />
  );
}
