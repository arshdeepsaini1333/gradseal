"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { OTP_RESEND_COOLDOWN_SECONDS } from "@/lib/auth/otp-constants";

interface ResendOtpState {
  error?: string;
  message?: string;
  cooldownSeconds?: number;
}

interface ResendOtpButtonProps {
  email: string;
  action: (email: string) => Promise<ResendOtpState | undefined>;
}

export default function ResendOtpButton({ email, action }: ResendOtpButtonProps) {
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_COOLDOWN_SECONDS);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  function handleResend() {
    startTransition(async () => {
      const result = await action(email);
      if (result?.error) {
        toast.error(result.error);
        if (result.cooldownSeconds) setSecondsLeft(result.cooldownSeconds);
      } else if (result?.message) {
        toast.success(result.message);
        setSecondsLeft(OTP_RESEND_COOLDOWN_SECONDS);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={secondsLeft > 0 || isPending}
      className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors disabled:cursor-not-allowed disabled:text-[#94A3B8]"
    >
      {isPending
        ? "Sending..."
        : secondsLeft > 0
        ? `Resend code in ${secondsLeft}s`
        : "Resend code"}
    </button>
  );
}
