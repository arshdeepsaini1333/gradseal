"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { saveProfileImage } from "@/lib/uploads";
import { getStudentSession } from "@/lib/auth/session";
import { studentProfileSchema } from "@/lib/validations/student-profile";
import type { Gender, HighestQualification } from "@/generated/prisma/enums";

export type ProfileFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function updateStudentProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await getStudentSession();
  if (!session) {
    return { message: "Your session has expired. Please sign in again." };
  }

  const validated = studentProfileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    country: formData.get("country"),
    state: formData.get("state"),
    city: formData.get("city"),
    pincode: formData.get("pincode"),
    address: formData.get("address"),
    highestQualification: formData.get("highestQualification"),
    collegeOrUniversity: formData.get("collegeOrUniversity"),
    currentOccupation: formData.get("currentOccupation"),
    fieldOfStudy: formData.get("fieldOfStudy"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = validated.data;

  await prisma.student.update({
    where: { id: session.id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender as Gender,
      country: data.country,
      state: data.state,
      city: data.city,
      pincode: data.pincode,
      address: data.address || null,
      highestQualification: data.highestQualification as HighestQualification,
      collegeOrUniversity: data.collegeOrUniversity || null,
      currentOccupation: data.currentOccupation || null,
      fieldOfStudy: data.fieldOfStudy || null,
    },
  });

  revalidatePath("/student/profile");
  return { success: true, message: "Profile updated successfully." };
}

// ---------------------------------------------------------------------------
// Profile photo — its own dedicated upload, independent of the rest of the
// profile form (cropped client-side, then submitted as soon as the user
// confirms, rather than waiting on a full-form "Save Changes").
// ---------------------------------------------------------------------------

export type UploadPhotoState =
  | { success?: boolean; message?: string; url?: string }
  | undefined;

export async function uploadProfilePhoto(
  _prevState: UploadPhotoState,
  formData: FormData
): Promise<UploadPhotoState> {
  const session = await getStudentSession();
  if (!session) {
    return { message: "Your session has expired. Please sign in again." };
  }

  const file = formData.get("profileImage");
  if (!(file instanceof File) || file.size === 0) {
    return { message: "Please choose a photo to upload." };
  }

  let profileImagePath: string;
  try {
    profileImagePath = await saveProfileImage(file);
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Could not process profile picture",
    };
  }

  await prisma.student.update({
    where: { id: session.id },
    data: { profileImage: profileImagePath },
  });

  revalidatePath("/student/profile");
  revalidatePath("/student/dashboard");
  revalidatePath("/student/settings");

  return { success: true, message: "Profile photo updated.", url: profileImagePath };
}
