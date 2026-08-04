"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getStudentSession } from "@/lib/auth/session";
import { prepareCertificate as prepareCertificateForCourse } from "@/lib/certificates";
import { prepareCertificateSchema } from "@/lib/validations/certificates";

export async function prepareCertificate(input: unknown): Promise<{ certificateNumber: string }> {
  const session = await getStudentSession();
  if (!session) redirect("/student/login");

  const parsed = prepareCertificateSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");

  const certificate = await prepareCertificateForCourse(session.id, parsed.data.courseId, parsed.data.name);

  revalidatePath("/student/certificates");
  revalidatePath(`/student/learn/${certificate.courseSlug}`, "layout");

  return { certificateNumber: certificate.certificateNumber };
}
