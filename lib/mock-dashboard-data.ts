import { BookOpen, GraduationCap, Award, CalendarClock, TrendingUp, Clock } from "lucide-react";
import type {
  DashboardStat,
  ContinueLearningCourse,
  CartSummary,
  NotificationSummary,
} from "@/types/dashboard";

export const dashboardStats: DashboardStat[] = [
  {
    id: "enrolled",
    label: "Courses Enrolled",
    value: 6,
    description: "Across all categories",
    icon: BookOpen,
  },
  {
    id: "completed",
    label: "Courses Completed",
    value: 2,
    description: "Great progress!",
    icon: GraduationCap,
  },
  {
    id: "certificates",
    label: "Certificates Earned",
    value: 2,
    description: "Shareable & verified",
    icon: Award,
  },
  {
    id: "upcoming-tests",
    label: "Upcoming Tests",
    value: 1,
    description: "Due this week",
    icon: CalendarClock,
  },
  {
    id: "avg-score",
    label: "Average Score",
    value: "87%",
    description: "Across all assessments",
    icon: TrendingUp,
  },
  {
    id: "hours",
    label: "Learning Hours",
    value: 42,
    description: "Total time invested",
    icon: Clock,
  },
];

export const continueLearningCourses: ContinueLearningCourse[] = [
  {
    id: "c1",
    slug: "personal-trainer-fundamentals",
    title: "Personal Trainer Fundamentals",
    instructor: "Dr. Anjali Mehra",
    category: "Personal Training",
    progressPercent: 68,
  },
  {
    id: "c2",
    slug: "sports-nutrition-essentials",
    title: "Sports Nutrition Essentials",
    instructor: "Coach Ravi Kumar",
    category: "Nutrition",
    progressPercent: 34,
  },
  {
    id: "c3",
    slug: "yoga-instructor-certification",
    title: "Yoga Instructor Certification",
    instructor: "Priya Nair",
    category: "Yoga",
    progressPercent: 91,
  },
];

export const mockCartSummary: CartSummary = { itemCount: 2 };
export const mockNotificationSummary: NotificationSummary = { unreadCount: 3 };
