import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";
import { getAdminSession } from "@/lib/auth/admin-session";
import { logoutAdmin } from "@/actions/admin-auth";

export const metadata: Metadata = { title: "Admin Dashboard – GradSeal" };

export default async function AdminDashboardPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <span className="text-sm font-semibold text-[#0F172A]">
          Signed in as {admin.fullName} ({admin.email})
        </span>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </form>
      </header>
      <ComingSoon
        title="Admin Dashboard"
        description="Manage courses, students, certificates, and platform settings from the GradSeal admin panel. Coming soon."
      />
    </>
  );
}
