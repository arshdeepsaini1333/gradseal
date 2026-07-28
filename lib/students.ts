import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/auth/session";

// Full profile record for the signed-in student — used by the profile page
// to prefill the edit form and compute completion. Deliberately separate
// from `getStudentSession`, which stays a lean shape cached for use on every
// page (navbar, layout, etc).
export const getStudentProfile = cache(async () => {
  const session = await getStudentSession();
  if (!session) return null;

  return prisma.student.findUnique({
    where: { id: session.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      profileImage: true,
      dateOfBirth: true,
      gender: true,
      country: true,
      state: true,
      city: true,
      pincode: true,
      address: true,
      highestQualification: true,
      collegeOrUniversity: true,
      currentOccupation: true,
      fieldOfStudy: true,
    },
  });
});

export type StudentProfile = NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>;

// Lean account-security shape for the settings page — deliberately returns
// only a `hasPassword` boolean, never the hash itself, so it's safe to pass
// straight into a client component.
export const getStudentAccountInfo = cache(async () => {
  const session = await getStudentSession();
  if (!session) return null;

  const student = await prisma.student.findUnique({
    where: { id: session.id },
    select: { email: true, password: true },
  });
  if (!student) return null;

  return { email: student.email, hasPassword: !!student.password };
});
