"use client";

import { useActionState } from "react";
import { ShieldCheck } from "lucide-react";

import Button from "@/components/ui/Button";
import OtpInput from "@/components/auth/OtpInput";
import ResendOtpButton from "@/components/auth/ResendOtpButton";
import { verifyOtp } from "@/actions/auth";

interface VerifyOtpFormProps {
  email: string;
}

export default function VerifyOtpForm({ email }: VerifyOtpFormProps) {
  const verifyOtpForEmail = verifyOtp.bind(null, email);
  const [state, formAction, isPending] = useActionState(verifyOtpForEmail, undefined);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white shadow-lg shadow-blue-500/30">
          <ShieldCheck className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Verify your email</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          We sent a 6-digit code to <span className="font-semibold text-[#0F172A]">{email}</span>.
          Enter it below to activate your account.
        </p>

        <form action={formAction} className="mt-8 flex flex-col items-center gap-6">
          <OtpInput name="otp" error={state?.error} disabled={isPending} />

          <Button type="submit" loading={isPending} disabled={isPending} className="w-full">
            Verify Account
          </Button>

          <div className="flex items-center gap-1 text-sm text-[#64748B]">
            Didn&apos;t receive the code?
            <ResendOtpButton email={email} />
          </div>
        </form>
      </div>
    </div>
  );
}
