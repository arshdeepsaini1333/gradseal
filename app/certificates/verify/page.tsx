import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import AppNavbar from "@/components/navbar/AppNavbar";
import Footer from "@/components/Footer";
import VerifyCertificateForm from "@/components/certificates/VerifyCertificateForm";

export const metadata: Metadata = {
  title: "Verify Certificate – GradSeal",
  description:
    "Enter a GradSeal certificate number to instantly verify its authenticity and view the certificate details.",
};

export default function VerifyCertificatePage() {
  return (
    <>
      <AppNavbar />
      <main className="flex-1 bg-[#F8FAFC]">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#1E3A8A] pt-28 pb-24">
          <div aria-hidden className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none" />
          <div aria-hidden className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#60A5FA]/10 blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
              <ShieldCheck className="w-7 h-7 text-[#60A5FA]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Verify a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#93C5FD]">
                GradSeal Certificate
              </span>
            </h1>
            <p className="mt-4 text-blue-200 text-lg leading-relaxed">
              Enter the certificate number to confirm it was genuinely issued by GradSeal.
            </p>
          </div>
        </section>

        <div className="pb-24">
          <VerifyCertificateForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
