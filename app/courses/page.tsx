import type { Metadata } from "next";
import AppNavbar from "@/components/navbar/AppNavbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/courses/HeroSection";
import CategorySection from "@/components/courses/CategorySection";
import FeaturedCourses from "@/components/courses/FeaturedCourses";
import LearningPaths from "@/components/courses/LearningPaths";
import ComparisonSection from "@/components/courses/ComparisonSection";
import WhyGradSeal from "@/components/courses/WhyGradSeal";
import Testimonials from "@/components/courses/Testimonials";
import CertificateShowcase from "@/components/courses/CertificateShowcase";
import StatisticsSection from "@/components/courses/StatisticsSection";
import FAQSection from "@/components/courses/FAQSection";
import CTASection from "@/components/courses/CTASection";
import { CourseFilterProvider } from "@/components/courses/CourseFilterProvider";
import { getPublishedCourses, getCatalogCategories } from "@/lib/courses";
import { getStudentSession } from "@/lib/auth/session";
import { getWishlistedCourseIds } from "@/lib/wishlist";

export const metadata: Metadata = {
  title: "All Courses – GradSeal",
  description:
    "Explore GradSeal's full catalog of professional fitness certification courses in Gym Training, Personal Training, Yoga, Nutrition, Wellness, Strength & Conditioning, and Sports Science.",
};

export default async function CoursesPage() {
  const student = await getStudentSession();
  const [courses, categories, wishlistedCourseIds] = await Promise.all([
    getPublishedCourses(),
    getCatalogCategories(),
    student ? getWishlistedCourseIds(student.id) : Promise.resolve([]),
  ]);

  return (
    <>
      <AppNavbar />
      <main className="flex-1">
        <HeroSection />
        <CourseFilterProvider courses={courses}>
          <CategorySection categories={categories} />
          <FeaturedCourses
            courses={courses}
            isLoggedIn={!!student}
            wishlistedCourseIds={wishlistedCourseIds}
          />
          <LearningPaths />
        </CourseFilterProvider>
        <ComparisonSection />
        <WhyGradSeal />
        <Testimonials />
        <CertificateShowcase />
        <StatisticsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
