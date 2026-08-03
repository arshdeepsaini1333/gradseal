import { redirect } from "next/navigation";

export default function ForgotPasswordPage() {
  redirect("/student/login?forgot=1");
}
