"use client";

import Link from "next/link";
import { Search, Bell, MessageSquare, Plus } from "lucide-react";
import AdminMobileNav from "./AdminMobileNav";
import AdminProfileDropdown from "./AdminProfileDropdown";
import ThemeToggle from "./ThemeToggle";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";
import type { AdminProfile } from "@/types/admin";

export default function AdminTopbar({
  admin,
  unreadNotificationCount,
}: {
  admin: AdminProfile;
  unreadNotificationCount: number;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card px-4 md:px-6">
      <AdminMobileNav />

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search students, courses, orders..."
          className="pl-9"
          aria-label="Global search"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="default" size="sm" className="hidden gap-1.5 sm:inline-flex">
          <Plus className="size-4" />
          Quick Create
        </Button>
        <Button variant="ghost" size="icon" aria-label="Messages">
          <MessageSquare className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative" asChild>
          <Link href="/admin/notifications">
            <Bell className="size-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive" />
            )}
          </Link>
        </Button>
        <ThemeToggle />
        <div className="ml-1 hidden h-6 w-px bg-border sm:block" />
        <AdminProfileDropdown admin={admin} />
      </div>
    </header>
  );
}
