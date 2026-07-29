import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/forms/AdminLoginForm";
import { getAdminSession } from "@/lib/auth/admin-session";

export const metadata: Metadata = { title: "Admin Login – GradSeal" };

export default async function AdminLoginPage() {
  const admin = await getAdminSession();
  if (admin) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-[#F8FAFC] px-4 py-20">
      <AdminLoginForm />
    </main>
  );
}
