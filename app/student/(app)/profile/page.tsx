import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Mail } from "lucide-react";

import { getStudentProfile } from "@/lib/students";
import { getProfileCompletion } from "@/lib/profile-completion";
import ProfileCompletionMeter from "@/components/profile/ProfileCompletionMeter";
import AvatarUpload from "@/components/profile/AvatarUpload";
import ProfileForm from "@/components/forms/ProfileForm";

export const metadata: Metadata = { title: "Profile – GradSeal" };

export default async function ProfilePage() {
  const profile = await getStudentProfile();
  if (!profile) {
    redirect("/student/login");
  }

  const completion = getProfileCompletion(profile);
  const fullName = `${profile.firstName} ${profile.lastName}`;

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
          <AvatarUpload
            profileImage={profile.profileImage}
            name={fullName}
            email={profile.email}
            ringPercent={completion.percent}
          />
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
              Edit details
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
