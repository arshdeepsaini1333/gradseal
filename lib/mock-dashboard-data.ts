import { BookOpen, GraduationCap, Award, CalendarClock, TrendingUp, Clock } from "lucide-react";
import { courses } from "@/lib/data";
import type {
  DashboardStat,
  ContinueLearningCourse,
  NotificationSummary,
  Certificate,
  TestItem,
  AssignmentItem,
  WishlistItem,
  NotificationItem,
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

export const mockNotificationSummary: NotificationSummary = { unreadCount: 3 };

export const trendingCourses = [...courses]
  .sort((a, b) => b.purchaseCount - a.purchaseCount)
  .slice(0, 3);

const trendingIds = new Set(trendingCourses.map((course) => course.id));
export const discoverCourses = courses.filter((course) => !trendingIds.has(course.id)).slice(0, 3);

export const recentlyAddedCourses = [...courses]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 3);

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

export const wishlistItems: WishlistItem[] = courses.slice(3, 6).map((course) => ({
  id: course.id,
  slug: course.slug,
  title: course.title,
  category: course.category,
  price: 2999,
  rating: course.rating,
}));

export const notificationItems: NotificationItem[] = [
  {
    id: "n1",
    title: "New assignment posted",
    message: "\"Client Intake & Goal-Setting Worksheet\" is due July 22.",
    time: "2 hours ago",
    read: false,
    type: "info",
  },
  {
    id: "n2",
    title: "Certificate issued",
    message: "Your certificate for Personal Trainer Fundamentals is ready to download.",
    time: "1 day ago",
    read: false,
    type: "success",
  },
  {
    id: "n3",
    title: "Order confirmed",
    message: "Your order GS-ORD-10261 has been confirmed.",
    time: "3 days ago",
    read: false,
    type: "order",
  },
  {
    id: "n4",
    title: "Test reminder",
    message: "Module 4 Quiz: Program Design is due soon.",
    time: "5 days ago",
    read: true,
    type: "warning",
  },
];
