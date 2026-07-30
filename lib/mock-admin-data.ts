import {
  Users,
  BookOpen,
  CheckCircle2,
  FileEdit,
  IndianRupee,
  Wallet,
  UserCheck,
  GraduationCap,
  Award,
  Star,
} from "lucide-react";
import { courses } from "@/lib/data";
import type { AdminStat, ChartPoint, MultiSeriesPoint, CategorySlice, ActivityItem } from "@/types/admin";

function sparkline(seed: number, points = 7): ChartPoint[] {
  return Array.from({ length: points }, (_, i) => ({
    label: String(i),
    value: Math.round(seed * (0.75 + 0.05 * i + (i % 2 === 0 ? 0.03 : -0.02) * i)),
  }));
}

export const adminStats: AdminStat[] = [
  {
    id: "total-students",
    label: "Total Students",
    value: 1487,
    format: "number",
    changePercent: 8.2,
    icon: Users,
    sparkline: sparkline(180),
  },
  {
    id: "total-courses",
    label: "Total Courses",
    value: 85,
    format: "number",
    changePercent: 4.1,
    icon: BookOpen,
    sparkline: sparkline(11),
  },
  {
    id: "published-courses",
    label: "Published Courses",
    value: 71,
    format: "number",
    changePercent: 3.5,
    icon: CheckCircle2,
    sparkline: sparkline(9),
  },
  {
    id: "draft-courses",
    label: "Draft Courses",
    value: 14,
    format: "number",
    changePercent: -6.7,
    icon: FileEdit,
    sparkline: sparkline(2),
  },
  {
    id: "total-revenue",
    label: "Total Revenue",
    value: 8452300,
    format: "currency",
    changePercent: 12.6,
    icon: IndianRupee,
    sparkline: sparkline(1100000),
  },
  {
    id: "monthly-revenue",
    label: "Monthly Revenue",
    value: 742500,
    format: "currency",
    changePercent: 9.3,
    icon: Wallet,
    sparkline: sparkline(95000),
  },
  {
    id: "active-students",
    label: "Active Students",
    value: 963,
    format: "number",
    changePercent: 5.4,
    icon: UserCheck,
    sparkline: sparkline(120),
  },
  {
    id: "completion-rate",
    label: "Course Completion Rate",
    value: 68,
    format: "percent",
    changePercent: 2.1,
    icon: GraduationCap,
    sparkline: sparkline(60),
  },
  {
    id: "certificates-issued",
    label: "Certificates Issued",
    value: 1214,
    format: "number",
    changePercent: 15.8,
    icon: Award,
    sparkline: sparkline(150),
  },
  {
    id: "pending-reviews",
    label: "Pending Reviews",
    value: 23,
    format: "number",
    changePercent: -11.2,
    icon: Star,
    sparkline: sparkline(4),
  },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const studentGrowthSeries: ChartPoint[] = months.map((label, i) => ({
  label,
  value: Math.round(620 + i * 68 + (i % 3 === 0 ? 40 : 0)),
}));

export const revenueSeries: ChartPoint[] = months.map((label, i) => ({
  label,
  value: Math.round(420000 + i * 26000 + (i % 4 === 0 ? 35000 : 0)),
}));

export const monthlySalesSeries: ChartPoint[] = months.map((label, i) => ({
  label,
  value: Math.round(58 + i * 4 + (i % 3 === 0 ? 12 : 0)),
}));

export const courseEnrollmentsByCategory: CategorySlice[] = [
  { label: "Personal Training", value: 412 },
  { label: "Nutrition", value: 268 },
  { label: "Yoga", value: 231 },
  { label: "Gym Training", value: 197 },
  { label: "Sports", value: 143 },
  { label: "Physical Education", value: 96 },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const weeklyActivitySeries: MultiSeriesPoint[] = days.map((label, i) => ({
  label,
  "New Students": Math.round(18 + i * 3 + (i === 5 || i === 6 ? -8 : 0)),
  "Returning Students": Math.round(64 + i * 5 + (i === 5 || i === 6 ? -20 : 0)),
}));

export const courseCompletionRate = 68;

const sortedCourses = [...courses].sort((a, b) => b.purchaseCount - a.purchaseCount);
const topFour = sortedCourses.slice(0, 4);
const otherTotal = sortedCourses.slice(4).reduce((sum, c) => sum + c.purchaseCount, 0);
export const topSellingCourses: CategorySlice[] = [
  ...topFour.map((c) => ({ label: c.title, value: c.purchaseCount })),
  ...(otherTotal > 0 ? [{ label: "Other", value: otherTotal }] : []),
];

export const recentActivity: ActivityItem[] = [
  { id: "a1", type: "enrollment", actor: "Ritika Sharma", message: "enrolled in Certified Personal Trainer", time: "12 minutes ago" },
  { id: "a2", type: "purchase", actor: "Arjun Verma", message: "purchased Sports Nutrition Essentials", time: "38 minutes ago" },
  { id: "a3", type: "certificate", actor: "Priya Nair", message: "earned a certificate for Yoga Instructor Certification", time: "1 hour ago" },
  { id: "a4", type: "quiz", actor: "Karan Malhotra", message: "scored 92% on Module 4 Quiz: Program Design", time: "2 hours ago" },
  { id: "a5", type: "review", actor: "Sneha Iyer", message: "left a 5-star review on Nutrition Coach Certification", time: "3 hours ago" },
  { id: "a6", type: "login", actor: "Rahul Deshmukh", message: "logged in from a new device", time: "5 hours ago" },
  { id: "a7", type: "enrollment", actor: "Meera Pillai", message: "enrolled in Yoga Instructor Certification", time: "6 hours ago" },
  { id: "a8", type: "purchase", actor: "Vikram Singh", message: "purchased Certified Personal Trainer", time: "8 hours ago" },
];
