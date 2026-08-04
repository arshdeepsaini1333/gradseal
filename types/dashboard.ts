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

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface Certificate {
  id: string;
  certificateId: string;
  courseTitle: string;
  courseSlug: string;
  category: string;
  issuedDate: string;
}

export interface TestItem {
  id: string;
  title: string;
  course: string;
  status: "upcoming" | "completed";
  dueDate?: string;
  durationMinutes?: number;
  score?: number;
  totalMarks?: number;
}

export interface AssignmentItem {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: string;
}
