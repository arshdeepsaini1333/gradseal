import type { Metadata } from "next";
import Link from "next/link";
import VerifyOtpForm from "@/components/forms/VerifyOtpForm";
import { verifyAdminLoginOtp, resendAdminLoginOtp } from "@/actions/admin-auth";

export const metadata: Metadata = { title: "Verify Sign-In – GradSeal Admin" };

interface AdminVerifyLoginOtpPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function AdminVerifyLoginOtpPage({ searchParams }: AdminVerifyLoginOtpPageProps) {
  const { email } = await searchParams;

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-[#F8FAFC] px-4 py-20">
      {email ? (
        <VerifyOtpForm
          email={email}
          heading="Confirm your sign-in"
          description="For your security, we sent a 6-digit code to"
          submitLabel="Verify & Sign In"
          verifyAction={verifyAdminLoginOtp}
          resendAction={resendAdminLoginOtp}
        />
      ) : (
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#0F172A]">Missing verification link</h1>
          <p className="mt-2 text-sm text-[#64748B]">
            We couldn&apos;t find an email to verify. Please log in again to receive a new
            verification code.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-block rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E293B]"
          >
            Back to Login
          </Link>
        </div>
      )}
    </main>
  );
}
