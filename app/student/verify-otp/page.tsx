import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerifyOtpForm from "@/components/forms/VerifyOtpForm";

export const metadata: Metadata = { title: "Verify Your Email – GradSeal" };

interface VerifyOtpPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyOtpPage({ searchParams }: VerifyOtpPageProps) {
  const { email } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#F8FAFC] pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {email ? (
            <VerifyOtpForm email={email} />
          ) : (
            <div className="mx-auto max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
              <h1 className="text-xl font-bold text-[#0F172A]">
                Missing verification link
              </h1>
              <p className="mt-2 text-sm text-[#64748B]">
                We couldn&apos;t find an email to verify. Please register again to
                receive a new verification code.
              </p>
              <Link
                href="/student/register"
                className="mt-6 inline-block rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
              >
                Back to Registration
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
