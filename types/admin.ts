import type { LucideIcon } from "lucide-react";

export interface AdminSidebarNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminStat {
  id: string;
  label: string;
  value: number;
  format: "number" | "currency" | "percent";
  changePercent: number;
  icon: LucideIcon;
  sparkline: ChartPoint[];
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface MultiSeriesPoint {
  label: string;
  [seriesKey: string]: string | number;
}

export interface CategorySlice {
  label: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  type: "enrollment" | "purchase" | "certificate" | "quiz" | "review" | "login";
  actor: string;
  message: string;
  time: string;
}

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  initials: string;
}
