import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-session";
import AdminShell from "@/components/admin/shell/AdminShell";
import ThemeProvider from "@/components/admin/shell/ThemeProvider";
import type { AdminProfile } from "@/types/admin";

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "A";
}

export default async function AdminAppLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const cookieStore = await cookies();
  const defaultCollapsed = cookieStore.get("admin_sidebar_collapsed")?.value === "1";

  const admin: AdminProfile = {
    id: session.id,
    fullName: session.fullName,
    email: session.email,
    initials: getInitials(session.fullName),
  };

  return (
    <ThemeProvider>
      <AdminShell admin={admin} defaultCollapsed={defaultCollapsed}>
        {children}
      </AdminShell>
    </ThemeProvider>
  );
}
