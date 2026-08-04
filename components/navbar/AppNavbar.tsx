import { getStudentSession } from "@/lib/auth/session";
import { getStudentProfile } from "@/lib/students";
import { getProfileCompletion } from "@/lib/profile-completion";
import { getCartCount } from "@/lib/cart";
import Navbar from "@/components/Navbar";
import AuthenticatedNavbar from "@/components/navbar/AuthenticatedNavbar";
import { getUnreadNotificationCount } from "@/lib/notifications";

export default async function AppNavbar() {
  const student = await getStudentSession();

  if (!student) {
    return <Navbar />;
  }

  const [profile, cartItemCount, unreadNotificationCount] = await Promise.all([
    getStudentProfile(),
    getCartCount(student.id),
    getUnreadNotificationCount(student.id),
  ]);
  const profileCompletionPercent = profile ? getProfileCompletion(profile).percent : 0;

  return (
    <AuthenticatedNavbar
      student={student}
      cartItemCount={cartItemCount}
      unreadNotificationCount={unreadNotificationCount}
      profileCompletionPercent={profileCompletionPercent}
    />
  );
}
