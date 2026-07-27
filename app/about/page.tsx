import type { Metadata } from "next";
import AppNavbar from "@/components/navbar/AppNavbar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutStats from "@/components/about/AboutStats";
import OurStory from "@/components/about/OurStory";
import CourseCategories from "@/components/about/CourseCategories";
import WhyChooseGradSeal from "@/components/about/WhyChooseGradSeal";
import LearningTimeline from "@/components/about/LearningTimeline";
import CertificationsShowcase from "@/components/about/CertificationsShowcase";
import LearningPhilosophy from "@/components/about/LearningPhilosophy";
import StudentSuccess from "@/components/about/StudentSuccess";
import ValuesSection from "@/components/about/ValuesSection";
import AboutTestimonials from "@/components/about/AboutTestimonials";
import AboutFAQ from "@/components/about/AboutFAQ";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About GradSeal – Learn. Get Certified. Build Your Fitness Career.",
  description:
    "GradSeal empowers aspiring fitness professionals with industry-focused certification programs in Gym Training, Yoga, Personal Training, Nutrition, and Wellness.",
};

export default function AboutPage() {
  return (
    <>
      <AppNavbar />
      <main className="flex-1">
        <AboutHero />
        <AboutStats />
        <OurStory />
        <CourseCategories />
        <WhyChooseGradSeal />
        <LearningTimeline />
        <CertificationsShowcase />
        <LearningPhilosophy />
        <StudentSuccess />
        <ValuesSection />
        <AboutTestimonials />
        <AboutFAQ />
        <AboutCTA />
      </main>
      <Footer />
    </>
  );
}
