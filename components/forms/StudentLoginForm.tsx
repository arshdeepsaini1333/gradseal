"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { LogIn, Mail } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordField from "@/components/auth/PasswordField";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import { loginStudent } from "@/actions/auth";
import { studentLoginSchema } from "@/lib/validations/student-login";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  google_failed: "Google sign-in failed. Please try again.",
  google_unavailable: "Google sign-in isn't set up yet. Please use email and password.",
  google_unverified_email: "That Google account's email isn't verified. Please use another sign-in method.",
  google_rate_limited: "Too many attempts. Please try again in a few minutes.",
  account_deactivated: "Your account has been deactivated. Please contact support.",
};

interface StudentLoginFormProps {
  justVerified?: boolean;
  oauthError?: string;
  openForgotPassword?: boolean;
}

export default function StudentLoginForm({
  justVerified = false,
  oauthError,
  openForgotPassword = false,
}: StudentLoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginStudent, undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (justVerified) toast.success("Email verified! Please sign in to continue.");
  }, [justVerified]);

  useEffect(() => {
    if (oauthError) toast.error(OAUTH_ERROR_MESSAGES[oauthError] ?? "Something went wrong signing in with Google.");
  }, [oauthError]);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state?.error]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const result = studentLoginSchema.safeParse({ email, password });
    if (!result.success) {
      const { fieldErrors: errors } = result.error.flatten();
      setFieldErrors(
        Object.fromEntries(
          Object.entries(errors)
            .filter(([, msgs]) => msgs && msgs.length > 0)
            .map(([field, msgs]) => [field, msgs![0]])
        )
      );
      e.preventDefault();
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white shadow-lg shadow-blue-500/30">
          <LogIn className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="text-center text-2xl font-extrabold text-[#0F172A]">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-[#64748B]">
          Sign in to continue your learning journey.
        </p>

        <div className="mt-8">
          <GoogleSignInButton />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <Input
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
            }}
            error={fieldErrors.email}
          />
          <div>
            <PasswordField
              label="Password"
              name="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(v) => {
                setPassword(v);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
              }}
              error={fieldErrors.password}
            />
            <div className="mt-2 text-right">
              <ForgotPasswordModal defaultOpen={openForgotPassword} />
            </div>
          </div>

          <Button type="submit" loading={isPending} disabled={isPending} className="w-full">
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#64748B]">
          Don&apos;t have an account?{" "}
          <Link href="/student/register" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
