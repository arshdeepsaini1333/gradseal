"use client";

import { useEffect, useState, useTransition, useActionState, startTransition } from "react";
import { Dialog } from "radix-ui";
import { toast } from "sonner";
import { X, Mail, ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordField from "@/components/auth/PasswordField";
import OtpInput from "@/components/auth/OtpInput";
import { OTP_RESEND_COOLDOWN_SECONDS } from "@/lib/auth/otp-constants";
import {
  requestPasswordResetOtp,
  resendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  type RequestResetOtpState,
  type VerifyResetOtpState,
  type ResetPasswordState,
} from "@/actions/forgot-password";

type Step = "email" | "otp" | "password" | "done";

function fieldError(errors: Record<string, string[]> | undefined, field: string) {
  return errors?.[field]?.[0];
}

export default function ForgotPasswordModal({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResending, startResend] = useTransition();

  const [requestState, requestAction, isRequesting] = useActionState<RequestResetOtpState, FormData>(
    requestPasswordResetOtp,
    undefined
  );

  const verifyForEmail = verifyPasswordResetOtp.bind(null, email);
  const [verifyState, verifyAction, isVerifying] = useActionState<VerifyResetOtpState, FormData>(
    verifyForEmail,
    undefined
  );

  const resetForEmail = resetPassword.bind(null, email);
  const [resetState, resetAction, isResetting] = useActionState<ResetPasswordState, FormData>(
    resetForEmail,
    undefined
  );

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (requestState?.success && requestState.email) {
      setEmail(requestState.email);
      setStep("otp");
      setCooldown(OTP_RESEND_COOLDOWN_SECONDS);
      toast.success(requestState.message ?? "Verification code sent.");
    } else if (requestState?.error) {
      toast.error(requestState.error);
      if (requestState.email && requestState.cooldownSeconds) {
        // A still-valid code already exists for this email — let them enter it.
        setEmail(requestState.email);
        setStep("otp");
        setCooldown(requestState.cooldownSeconds);
      }
    }
  }, [requestState]);

  useEffect(() => {
    if (verifyState?.success) {
      setStep("password");
    } else if (verifyState?.error) {
      toast.error(verifyState.error);
    }
  }, [verifyState]);

  useEffect(() => {
    if (resetState?.success) {
      toast.success(resetState.message ?? "Password reset.");
      setStep("done");
    } else if (resetState?.message) {
      toast.error(resetState.message);
    } else if (resetState?.errors?.otp) {
      // The code was verified in the previous step but expired (or was
      // otherwise rejected) by the time the new password was submitted —
      // send the user back to request a fresh one.
      toast.error(resetState.errors.otp[0]);
      setOtpValue("");
      setStep("otp");
    }
  }, [resetState]);

  function handleResend() {
    startResend(async () => {
      const result = await resendPasswordResetOtp(email);
      if (result?.error) {
        toast.error(result.error);
        if (result.cooldownSeconds) setCooldown(result.cooldownSeconds);
      } else if (result?.message) {
        toast.success(result.message);
        setCooldown(OTP_RESEND_COOLDOWN_SECONDS);
      }
    });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      // Reset after the close animation so a reopened modal starts fresh.
      setTimeout(() => {
        setStep("email");
        setEmail("");
        setOtpValue("");
        setNewPassword("");
        setConfirmPassword("");
      }, 200);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
        >
          Forgot your password?
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="dialog-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-2xl focus:outline-none"
        >
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>

          {step === "email" && (
            <>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white shadow-lg shadow-blue-500/30">
                <Mail className="h-7 w-7" aria-hidden="true" />
              </div>
              <Dialog.Title className="text-center text-2xl font-extrabold text-[#0F172A]">
                Reset your password
              </Dialog.Title>
              <p className="mt-2 text-center text-sm text-[#64748B]">
                Enter your registered email and we&apos;ll send you a verification code.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  startTransition(() => requestAction(formData));
                }}
                className="mt-8 flex flex-col gap-5"
              >
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  icon={Mail}
                  required
                  autoComplete="email"
                  autoFocus
                />
                <Button type="submit" loading={isRequesting} disabled={isRequesting} className="w-full">
                  Send Verification Code
                </Button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white shadow-lg shadow-blue-500/30">
                <ShieldCheck className="h-7 w-7" aria-hidden="true" />
              </div>
              <Dialog.Title className="text-center text-2xl font-extrabold text-[#0F172A]">
                Enter verification code
              </Dialog.Title>
              <p className="mt-2 text-center text-sm text-[#64748B]">
                We sent a 6-digit code to <span className="font-semibold text-[#0F172A]">{email}</span>.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  startTransition(() => verifyAction(formData));
                }}
                className="mt-8 flex flex-col items-center gap-6"
              >
                <OtpInput name="otp" error={verifyState?.error} disabled={isVerifying} onChange={setOtpValue} />

                <Button
                  type="submit"
                  loading={isVerifying}
                  disabled={isVerifying || otpValue.length !== 6}
                  className="w-full"
                >
                  Verify Code
                </Button>

                <div className="flex items-center gap-1 text-sm text-[#64748B]">
                  Didn&apos;t receive the code?
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || isResending}
                    className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors disabled:cursor-not-allowed disabled:text-[#94A3B8]"
                  >
                    {isResending ? "Sending..." : cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === "password" && (
            <>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white shadow-lg shadow-blue-500/30">
                <KeyRound className="h-7 w-7" aria-hidden="true" />
              </div>
              <Dialog.Title className="text-center text-2xl font-extrabold text-[#0F172A]">
                Set a new password
              </Dialog.Title>
              <p className="mt-2 text-center text-sm text-[#64748B]">
                Code verified. Choose a new password for your account.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  startTransition(() => resetAction(formData));
                }}
                className="mt-8 flex flex-col gap-5"
              >
                <input type="hidden" name="otp" value={otpValue} />
                <PasswordField
                  label="New Password"
                  name="newPassword"
                  required
                  showStrength
                  value={newPassword}
                  onChange={setNewPassword}
                  error={fieldError(resetState?.errors, "newPassword")}
                />
                <PasswordField
                  label="Confirm New Password"
                  name="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  error={fieldError(resetState?.errors, "confirmPassword")}
                />
                <Button type="submit" loading={isResetting} disabled={isResetting} className="w-full">
                  Reset Password
                </Button>
              </form>
            </>
          )}

          {step === "done" && (
            <>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
              </div>
              <Dialog.Title className="text-center text-2xl font-extrabold text-[#0F172A]">
                Password reset!
              </Dialog.Title>
              <p className="mt-2 text-center text-sm text-[#64748B]">
                You can now sign in with your new password.
              </p>
              <Dialog.Close asChild>
                <Button type="button" className="mt-8 w-full">
                  Back to Sign In
                </Button>
              </Dialog.Close>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
