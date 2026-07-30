import type { Metadata } from "next";
import StatCard from "@/components/admin/dashboard/StatCard";
import ChartCard from "@/components/admin/dashboard/ChartCard";
import RecentActivityFeed from "@/components/admin/dashboard/RecentActivityFeed";
import StudentGrowthChart from "@/components/admin/dashboard/charts/StudentGrowthChart";
import RevenueChart from "@/components/admin/dashboard/charts/RevenueChart";
import MonthlySalesChart from "@/components/admin/dashboard/charts/MonthlySalesChart";
import WeeklyActivityChart from "@/components/admin/dashboard/charts/WeeklyActivityChart";
import CourseEnrollmentsChart from "@/components/admin/dashboard/charts/CourseEnrollmentsChart";
import CourseCompletionRadial from "@/components/admin/dashboard/charts/CourseCompletionRadial";
import TopSellingCoursesChart from "@/components/admin/dashboard/charts/TopSellingCoursesChart";
import {
  adminStats,
  studentGrowthSeries,
  revenueSeries,
  monthlySalesSeries,
  weeklyActivitySeries,
  courseEnrollmentsByCategory,
  courseCompletionRate,
  topSellingCourses,
  recentActivity,
} from "@/lib/mock-admin-data";

export const metadata: Metadata = { title: "Admin Dashboard – GradSeal" };

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview and performance at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {adminStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Student Growth" description="New student sign-ups over the last 12 months" className="lg:col-span-2">
          <StudentGrowthChart data={studentGrowthSeries} />
        </ChartCard>
        <ChartCard title="Course Completion Rate" description="Platform-wide average">
          <CourseCompletionRadial value={courseCompletionRate} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue" description="Monthly revenue trend">
          <RevenueChart data={revenueSeries} />
        </ChartCard>
        <ChartCard title="Monthly Sales" description="Number of course sales per month">
          <MonthlySalesChart data={monthlySalesSeries} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Course Enrollments" description="By category">
          <CourseEnrollmentsChart data={courseEnrollmentsByCategory} />
        </ChartCard>
        <ChartCard title="Top Selling Courses" description="Share of total purchases">
          <TopSellingCoursesChart data={topSellingCourses} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Weekly Activity" description="New vs. returning students" className="lg:col-span-2">
          <WeeklyActivityChart data={weeklyActivitySeries} />
        </ChartCard>
        <ChartCard title="Recent Activity" description="Latest platform events" height="h-auto">
          <RecentActivityFeed items={recentActivity} />
        </ChartCard>
      </div>
    </div>
  );
}
