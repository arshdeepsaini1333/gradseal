import type { SVGProps } from "react";

function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6.1 29.5 4 24 4 16 4 9 8.5 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5c-2.1 1.5-4.8 2.5-7.5 2.5-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9 39.4 16 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.5 5.5C41.5 36.5 44 30.7 44 24c0-1.4-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

interface GoogleSignInButtonProps {
  label?: string;
}

export default function GoogleSignInButton({ label = "Continue with Google" }: GoogleSignInButtonProps) {
  return (
    <a
      href="/api/auth/google"
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] shadow-sm transition-colors hover:bg-slate-50"
    >
      <GoogleIcon className="h-5 w-5" aria-hidden="true" />
      {label}
    </a>
  );
}
