"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Lock, Mail, ShieldCheck } from "lucide-react";

import SectionCard from "@/components/ui/SectionCard";
import Button from "@/components/ui/Button";
import PasswordField from "@/components/auth/PasswordField";
import OtpInput from "@/components/auth/OtpInput";
import { OTP_RESEND_COOLDOWN_SECONDS } from "@/lib/auth/otp-constants";
import {
  changePassword,
  createPassword,
  requestCreatePasswordOtp,
  verifyCreatePasswordOtp,
  type ChangePasswordState,
  type CreatePasswordState,
  type VerifyCreatePasswordOtpState,
} from "@/actions/account";

interface PasswordSecuritySectionProps {
  email: string;
  hasPassword: boolean;
}

export default function PasswordSecuritySection({ email, hasPassword }: PasswordSecuritySectionProps) {
  return hasPassword ? <ChangePasswordCard /> : <CreatePasswordCard email={email} />;
}

function fieldError(errors: Record<string, string[]> | undefined, field: string) {
  return errors?.[field]?.[0];
}

// ---------------------------------------------------------------------------
// Change password — accounts that already have one
// ---------------------------------------------------------------------------

function ChangePasswordCard() {
  const [state, formAction, isPending] = useActionState<ChangePasswordState, FormData>(
    changePassword,
    undefined
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message ?? "Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <SectionCard
      icon={Lock}
      title="Change Password"
      description="Use a strong password you don't use elsewhere."
      contentClassName=""
    >
      <form action={formAction} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <PasswordField
          label="Current Password"
          name="currentPassword"
          required
          autoComplete="current-password"
          value={currentPassword}
          onChange={setCurrentPassword}
          error={fieldError(state?.errors, "currentPassword")}
        />
        <div className="hidden sm:block" />
        <PasswordField
          label="New Password"
          name="newPassword"
          required
          showStrength
          value={newPassword}
          onChange={setNewPassword}
          error={fieldError(state?.errors, "newPassword")}
        />
        <PasswordField
          label="Confirm New Password"
          name="confirmPassword"
          required
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={fieldError(state?.errors, "confirmPassword")}
        />
        <div className="sm:col-span-2 flex justify-end">
          <Button type="submit" loading={isPending} disabled={isPending}>
            Update Password
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Create password — Google-only accounts, gated by an emailed OTP
// ---------------------------------------------------------------------------

function CreatePasswordCard({ email }: { email: string }) {
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "otp" | "password">("idle");
  const [isRequesting, startRequest] = useTransition();
  const [cooldown, setCooldown] = useState(0);
  const [otpValue, setOtpValue] = useState("");

  const [verifyState, verifyAction, isVerifying] = useActionState<
    VerifyCreatePasswordOtpState,
    FormData
  >(verifyCreatePasswordOtp, undefined);

  const [state, formAction, isPending] = useActionState<CreatePasswordState, FormData>(
    createPassword,
    undefined
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (verifyState?.success) {
      setStep("password");
    } else if (verifyState?.error) {
      toast.error(verifyState.error);
    }
  }, [verifyState]);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message ?? "Password created.");
      setNewPassword("");
      setConfirmPassword("");
      router.refresh();
    } else if (state?.message) {
      toast.error(state.message);
    } else if (state?.errors?.otp) {
      // The code was verified in the previous step but expired (or was
      // otherwise rejected) by the time the password was submitted — send
      // the user back to request a fresh one instead of showing an error
      // under a hidden field.
      toast.error(state.errors.otp[0]);
      setOtpValue("");
      setStep("otp");
    }
  }, [state, router]);

  function handleSendCode() {
    startRequest(async () => {
      const result = await requestCreatePasswordOtp();
      if (result?.error) {
        toast.error(result.error);
        if (result.cooldownSeconds) {
          setStep("otp");
          setCooldown(result.cooldownSeconds);
        }
      } else if (result?.message) {
        toast.success(result.message);
        setStep("otp");
        setCooldown(OTP_RESEND_COOLDOWN_SECONDS);
      }
    });
  }

  return (
    <SectionCard
      icon={KeyRound}
      title="Create a Password"
      description="Your account currently signs in with Google only."
      contentClassName=""
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[#2563EB]" aria-hidden="true" />
          <p className="text-sm text-[#334155]">
            You signed up with Google and don&apos;t have a password yet. Create one so you can
            also sign in with your email and a password.
          </p>
        </div>

        {step === "idle" && (
          <div>
            <p className="mb-3 text-sm text-[#64748B]">
              We&apos;ll email a verification code to{" "}
              <span className="font-semibold text-[#0F172A]">{email}</span>.
            </p>
            <Button type="button" onClick={handleSendCode} loading={isRequesting} disabled={isRequesting}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              Send Verification Code
            </Button>
          </div>
        )}

        {step === "otp" && (
          <form action={verifyAction} className="flex flex-col gap-5">
            <div>
              <p className="mb-3 text-sm text-[#64748B]">
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold text-[#0F172A]">{email}</span>. You&apos;ll set
                your new password once it&apos;s verified.
              </p>
              <OtpInput
                name="otp"
                error={verifyState?.error}
                disabled={isVerifying}
                onChange={setOtpValue}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleSendCode}
                disabled={cooldown > 0 || isRequesting}
                className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors disabled:cursor-not-allowed disabled:text-[#94A3B8]"
              >
                {isRequesting ? "Sending..." : cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
              </button>
              <Button type="submit" loading={isVerifying} disabled={isVerifying || otpValue.length !== 6}>
                Verify Code
              </Button>
            </div>
          </form>
        )}

        {step === "password" && (
          <form action={formAction} className="flex flex-col gap-5">
            <input type="hidden" name="otp" value={otpValue} />

            <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
              <p className="text-sm text-emerald-800">
                Code verified. Choose the password you&apos;ll use to sign in.
              </p>
              <button
                type="button"
                onClick={() => setStep("otp")}
                className="shrink-0 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
              >
                Use a different code
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <PasswordField
                label="New Password"
                name="newPassword"
                required
                showStrength
                value={newPassword}
                onChange={setNewPassword}
                error={fieldError(state?.errors, "newPassword")}
              />
              <PasswordField
                label="Confirm New Password"
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={fieldError(state?.errors, "confirmPassword")}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={isPending} disabled={isPending}>
                Create Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </SectionCard>
  );
}
