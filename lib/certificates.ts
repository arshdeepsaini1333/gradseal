import "server-only";
import { prisma } from "@/lib/prisma";
import type { CourseLevel } from "@/generated/prisma/enums";

export type VerifiedCertificate = {
  certificateNumber: string;
  issuedAt: Date;
  certificateUrl: string;
  studentName: string;
  course: {
    title: string;
    slug: string;
    thumbnail: string;
    duration: string;
    level: CourseLevel;
    totalHours: number;
    categories: { id: string; name: string }[];
  };
};

/** Strips whitespace/dashes a user might paste in and uppercases, so "gs-7x9k 2p4q" matches "GS7X9K2P4Q". */
export function normalizeCertificateNumber(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidCertificateNumberFormat(value: string): boolean {
  return /^[A-Z0-9]{10}$/.test(value);
}

export async function findCertificateByNumber(certificateNumber: string): Promise<VerifiedCertificate | null> {
  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber },
    include: {
      student: { select: { firstName: true, lastName: true } },
      course: {
        select: {
          title: true,
          slug: true,
          thumbnail: true,
          duration: true,
          level: true,
          totalHours: true,
          categories: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!certificate) return null;

  return {
    certificateNumber: certificate.certificateNumber,
    issuedAt: certificate.issuedAt,
    certificateUrl: certificate.certificateUrl,
    studentName: `${certificate.student.firstName} ${certificate.student.lastName}`,
    course: certificate.course,
  };
}
