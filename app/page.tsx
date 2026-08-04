import AppNavbar from "@/components/navbar/AppNavbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import FeaturedCourses from "@/components/courses/FeaturedCourses";
import CertificatePreview from "@/components/CertificatePreview";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import { getFeaturedCourses } from "@/lib/courses";
import { getStudentSession } from "@/lib/auth/session";
import { getWishlistedCourseIds } from "@/lib/wishlist";

export default async function HomePage() {
  const student = await getStudentSession();
  const [featuredCourses, wishlistedCourseIds] = await Promise.all([
    getFeaturedCourses(8),
    student ? getWishlistedCourseIds(student.id) : Promise.resolve([]),
  ]);

  return (
    <>
      <AppNavbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <FeaturedCourses
          courses={featuredCourses}
          viewAllHref="/courses"
          isLoggedIn={!!student}
          wishlistedCourseIds={wishlistedCourseIds}
        />
        <CertificatePreview />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
