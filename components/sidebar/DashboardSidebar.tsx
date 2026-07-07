"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  Award,
  ClipboardList,
  FileCheck2,
  Heart,
  ShoppingCart,
  Receipt,
  Bell,
  User,
  Settings,
  LifeBuoy,
} from "lucide-react";
import type { SidebarNavItem } from "@/types/dashboard";

const sidebarLinks: SidebarNavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Learning", href: "/student/dashboard/my-learning", icon: BookOpen },
  { label: "Continue Learning", href: "/student/dashboard/continue-learning", icon: PlayCircle },
  { label: "My Certificates", href: "/student/dashboard/certificates", icon: Award },
  { label: "Tests & Assessments", href: "/student/dashboard/tests", icon: ClipboardList },
  { label: "Assignments", href: "/student/dashboard/assignments", icon: FileCheck2 },
  { label: "Wishlist", href: "/student/dashboard/wishlist", icon: Heart },
  { label: "Cart", href: "/student/dashboard/cart", icon: ShoppingCart },
  { label: "Orders", href: "/student/dashboard/orders", icon: Receipt },
  { label: "Notifications", href: "/student/dashboard/notifications", icon: Bell },
  { label: "Profile", href: "/student/dashboard/profile", icon: User },
  { label: "Account Settings", href: "/student/dashboard/settings", icon: Settings },
  { label: "Support", href: "/student/dashboard/support", icon: LifeBuoy },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col fixed left-0 top-16 bottom-0 w-64 border-r border-slate-200 bg-white overflow-y-auto">
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {sidebarLinks.map((link) => {
          const isActive =
            link.href === "/student/dashboard"
              ? pathname === link.href
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-[#2563EB]"
                  : "text-[#0F172A] hover:bg-slate-50 hover:text-[#2563EB]"
              }`}
            >
              <link.icon className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
