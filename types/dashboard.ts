import type { LucideIcon } from "lucide-react";

export interface DashboardStat {
  id: string;
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}

export interface ContinueLearningCourse {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  category: string;
  progressPercent: number;
}

export interface CartSummary {
  itemCount: number;
}

export interface NotificationSummary {
  unreadCount: number;
}

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}
