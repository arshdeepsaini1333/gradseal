import { BookOpen, GraduationCap, Award, CalendarClock, TrendingUp, Clock } from "lucide-react";
import type {
  DashboardStat,
  ContinueLearningCourse,
  Certificate,
  TestItem,
  AssignmentItem,
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

export const certificates: Certificate[] = [
  {
    id: "cert1",
    certificateId: "GS-PT-2025-0142",
    courseTitle: "Personal Trainer Fundamentals",
    courseSlug: "personal-trainer-fundamentals",
    category: "Personal Training",
    issuedDate: "2025-11-02",
  },
  {
    id: "cert2",
    certificateId: "GS-YG-2025-0087",
    courseTitle: "Yoga Instructor Certification",
    courseSlug: "yoga-instructor-certification",
    category: "Yoga",
    issuedDate: "2025-09-18",
  },
];

export const testItems: TestItem[] = [
  {
    id: "test1",
    title: "Module 4 Quiz: Program Design",
    course: "Personal Trainer Fundamentals",
    status: "upcoming",
    dueDate: "2026-07-20",
    durationMinutes: 30,
  },
  {
    id: "test2",
    title: "Final Assessment",
    course: "Sports Nutrition Essentials",
    status: "completed",
    score: 87,
    totalMarks: 100,
  },
  {
    id: "test3",
    title: "Module 2 Quiz: Asana Basics",
    course: "Yoga Instructor Certification",
    status: "completed",
    score: 94,
    totalMarks: 100,
  },
];

export const assignmentItems: AssignmentItem[] = [
  {
    id: "assign1",
    title: "Client Intake & Goal-Setting Worksheet",
    course: "Personal Trainer Fundamentals",
    dueDate: "2026-07-22",
    status: "pending",
  },
  {
    id: "assign2",
    title: "7-Day Meal Plan Case Study",
    course: "Sports Nutrition Essentials",
    dueDate: "2026-07-10",
    status: "submitted",
  },
  {
    id: "assign3",
    title: "Beginner Sequence Design",
    course: "Yoga Instructor Certification",
    dueDate: "2026-06-28",
    status: "graded",
    grade: "A",
  },
];
