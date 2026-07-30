"use client";

import { useState, type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import type { AdminProfile } from "@/types/admin";

const COLLAPSE_COOKIE = "admin_sidebar_collapsed";

export default function AdminShell({
  admin,
  defaultCollapsed,
  children,
}: {
  admin: AdminProfile;
  defaultCollapsed: boolean;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${COLLAPSE_COOKIE}=${next ? "1" : "0"}; path=/admin; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }

  return (
    <div className="admin-shell min-h-screen bg-background text-foreground">
      <AdminSidebar collapsed={collapsed} onToggle={toggle} />
      <div className={collapsed ? "md:pl-16" : "md:pl-64"}>
        <AdminTopbar admin={admin} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
