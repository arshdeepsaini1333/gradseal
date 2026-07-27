import type { Metadata } from "next";
import AppNavbar from "@/components/navbar/AppNavbar";
import Footer from "@/components/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactCards from "@/components/contact/ContactCards";
import ContactForm from "@/components/contact/ContactForm";
import StudentSupport from "@/components/contact/StudentSupport";
import ContactFAQ from "@/components/contact/ContactFAQ";
import SocialLinks from "@/components/contact/SocialLinks";
import Newsletter from "@/components/contact/Newsletter";
import ContactCTA from "@/components/contact/ContactCTA";

export const metadata: Metadata = {
  title: "Contact GradSeal – We're Here to Help",
  description:
    "Reach out to GradSeal for course admissions, student support, certification verification, or business partnerships. Our team typically responds within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <AppNavbar />
      <main className="flex-1">
        <ContactHero />
        <ContactCards />
        <ContactForm />
        <StudentSupport />
        <ContactFAQ />
        <SocialLinks />
        <Newsletter />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
