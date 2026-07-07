import { getGreeting } from "@/lib/dashboard/greeting";

interface WelcomeSectionProps {
  firstName: string;
  profileImage: string | null;
}

export default function WelcomeSection({ firstName, profileImage }: WelcomeSectionProps) {
  const initials = firstName[0]?.toUpperCase() ?? "";

  return (
    <section className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Continue your learning journey.
        </p>
      </div>

      <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white text-xl font-bold shrink-0">
        {profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profileImage} alt={firstName} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
    </section>
  );
}
