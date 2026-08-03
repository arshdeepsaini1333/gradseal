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

export default async function HomePage() {
  const featuredCourses = await getFeaturedCourses(8);

  return (
    <>
      <AppNavbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <FeaturedCourses courses={featuredCourses} viewAllHref="/courses" />
        <CertificatePreview />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
