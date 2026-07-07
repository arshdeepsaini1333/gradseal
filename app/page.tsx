import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import CoursePreview from "@/components/CoursePreview";
import CertificatePreview from "@/components/CertificatePreview";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <CoursePreview />
        <CertificatePreview />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
