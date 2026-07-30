import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ComingSoonProps {
  title: string;
  description?: string;
  showAuth?: boolean;
  /** Skip the public Navbar/Footer — use when already inside another shell (e.g. the admin layout). */
  chromeless?: boolean;
  backHref?: string;
  backLabel?: string;
}

export default function ComingSoon({
  title,
  description = "We're working hard to bring this page to you. Check back soon.",
  showAuth = false,
  chromeless = false,
  backHref = "/",
  backLabel = "← Back to Home",
}: ComingSoonProps) {
  const body = (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white text-3xl mb-6 shadow-lg shadow-blue-500/30">
        🚀
      </div>
      <h1 className="text-3xl font-extrabold text-[#0F172A] mb-3">{title}</h1>
      <p className="text-[#64748B] text-base leading-relaxed mb-8">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href={backHref}
          className="px-6 py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm"
        >
          {backLabel}
        </Link>
        {showAuth && (
          <Link
            href="/student/register"
            className="px-6 py-3 rounded-xl border-2 border-[#2563EB] text-[#2563EB] text-sm font-semibold hover:bg-[#2563EB] hover:text-white transition-colors"
          >
            Register Now
          </Link>
        )}
      </div>
    </div>
  );

  if (chromeless) {
    return (
      <div className="flex-1 flex items-center justify-center">{body}</div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-[#F8FAFC] min-h-screen pt-16">
        {body}
      </main>
      <Footer />
    </>
  );
}
