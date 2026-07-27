import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Mail } from "lucide-react";

import { getStudentProfile } from "@/lib/students";
import { getProfileCompletion } from "@/lib/profile-completion";
import ProfileCompletionMeter from "@/components/profile/ProfileCompletionMeter";
import AvatarCompletionRing from "@/components/profile/AvatarCompletionRing";
import ProfileForm from "@/components/forms/ProfileForm";

export const metadata: Metadata = { title: "Profile – GradSeal" };

export default async function ProfilePage() {
  const profile = await getStudentProfile();
  if (!profile) {
    redirect("/student/login");
  }

  const completion = getProfileCompletion(profile);
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Profile</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Your personal information as it appears on GradSeal.
        </p>
      </div>

      <ProfileCompletionMeter {...completion} />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <AvatarCompletionRing percent={completion.percent} size={92} strokeWidth={4}>
            <div className="flex items-center justify-center w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white text-2xl font-bold shrink-0">
              {profile.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.profileImage} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
          </AvatarCompletionRing>
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">{fullName}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#64748B]">
              <Mail className="w-4 h-4" aria-hidden="true" />
              {profile.email}
            </p>
            <a
              href="#section-personal"
              className="mt-2 inline-block text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
            >
              Edit photo &amp; details
            </a>
          </div>
        </div>
      </div>

      <ProfileForm
        initialValues={{
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone ?? "",
          dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.toISOString().split("T")[0] : "",
          gender: profile.gender ?? "",
          country: profile.country ?? "",
          state: profile.state ?? "",
          city: profile.city ?? "",
          pincode: profile.pincode ?? "",
          address: profile.address ?? "",
          highestQualification: profile.highestQualification ?? "",
          collegeOrUniversity: profile.collegeOrUniversity ?? "",
          currentOccupation: profile.currentOccupation ?? "",
          fieldOfStudy: profile.fieldOfStudy ?? "",
        }}
      />
    </div>
  );
}
