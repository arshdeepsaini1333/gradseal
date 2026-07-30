import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderTree,
  PlayCircle,
  ClipboardList,
  Award,
  Receipt,
  CreditCard,
  BarChart3,
  GraduationCap,
  Star,
  Bell,
  Settings,
} from "lucide-react";
import type { AdminSidebarNavItem } from "@/types/admin";

export const adminSidebarLinks: AdminSidebarNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Lessons", href: "/admin/lessons", icon: PlayCircle },
  { label: "Tests & Quizzes", href: "/admin/tests", icon: ClipboardList },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Orders", href: "/admin/orders", icon: Receipt },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Instructors", href: "/admin/instructors", icon: GraduationCap },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
