import "server-only";
import { randomInt } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { CourseLevel } from "@/generated/prisma/enums";

export type VerifiedCertificate = {
  certificateNumber: string;
  issuedAt: Date;
  certificateUrl: string;
  overallScore: number;
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

/** Strips anything but digits a user might paste in, so "1234 5678-9012" matches "123456789012". */
export function normalizeCertificateNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function isValidCertificateNumberFormat(value: string): boolean {
  return /^\d{12}$/.test(value);
}

async function generateUniqueCertificateNumber(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = randomInt(100_000_000_000, 1_000_000_000_000).toString();
    const existing = await prisma.certificate.findUnique({
      where: { certificateNumber: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  throw new Error("Could not generate a unique certificate number.");
}

export type StudentCertificate = {
  id: string;
  certificateNumber: string;
  issuedAt: Date;
  certificateUrl: string;
  overallScore: number;
  certificateName: string;
  courseTitle: string;
  courseSlug: string;
  category: string;
};

type CertificateWithCourse = Prisma.CertificateGetPayload<{
  include: { course: { select: { title: true; slug: true; categories: { select: { name: true } } } } };
}>;

function mapCertificate(certificate: CertificateWithCourse): StudentCertificate {
  return {
    id: certificate.id,
    certificateNumber: certificate.certificateNumber,
    issuedAt: certificate.issuedAt,
    certificateUrl: certificate.certificateUrl,
    overallScore: certificate.overallScore,
    certificateName: certificate.certificateName,
    courseTitle: certificate.course.title,
    courseSlug: certificate.course.slug,
    category: certificate.course.categories[0]?.name ?? "General",
  };
}

const courseSummarySelect = {
  title: true,
  slug: true,
  categories: { select: { name: true }, take: 1 },
} satisfies Prisma.CourseSelect;

export async function getStudentCertificates(studentId: string): Promise<StudentCertificate[]> {
  const certificates = await prisma.certificate.findMany({
    where: { studentId },
    orderBy: { issuedAt: "desc" },
    include: { course: { select: courseSummarySelect } },
  });

  return certificates.map(mapCertificate);
}

export async function getCertificateForCourse(
  studentId: string,
  courseId: string
): Promise<StudentCertificate | null> {
  const certificate = await prisma.certificate.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
    include: { course: { select: courseSummarySelect } },
  });

  return certificate ? mapCertificate(certificate) : null;
}

export type CertifiableCourse = {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  category: string;
};

/** Completed courses that don't have a certificate yet — ready for the student to prepare one. */
export async function getCoursesAwaitingCertificate(studentId: string): Promise<CertifiableCourse[]> {
  const [completedEnrollments, issuedCertificates] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId, completed: true },
      select: { course: { select: { id: true, slug: true, title: true, categories: { select: { name: true }, take: 1 } } } },
    }),
    prisma.certificate.findMany({ where: { studentId }, select: { courseId: true } }),
  ]);

  const issuedCourseIds = new Set(issuedCertificates.map((c) => c.courseId));

  return completedEnrollments
    .filter((enrollment) => !issuedCourseIds.has(enrollment.course.id))
    .map((enrollment) => ({
      courseId: enrollment.course.id,
      courseSlug: enrollment.course.slug,
      courseTitle: enrollment.course.title,
      category: enrollment.course.categories[0]?.name ?? "General",
    }));
}

async function computeCourseScore(studentId: string, courseId: string): Promise<number> {
  const tests = await prisma.test.findMany({
    where: { lesson: { module: { courseId } } },
    select: { attempts: { where: { studentId, passed: true }, select: { score: true } } },
  });

  const testScores = tests
    .filter((test) => test.attempts.length > 0)
    .map((test) => Math.max(...test.attempts.map((attempt) => attempt.score)));

  return testScores.length > 0
    ? Math.round(testScores.reduce((sum, score) => sum + score, 0) / testScores.length)
    : 100;
}

/**
 * Issues a student's certificate for a completed course, printing exactly the name they
 * typed in. One-time: if a certificate already exists for this student+course, it's
 * returned as-is — the name can never be changed after the first preparation.
 */
export async function prepareCertificate(
  studentId: string,
  courseId: string,
  certificateName: string
): Promise<StudentCertificate> {
  const existing = await getCertificateForCourse(studentId, courseId);
  if (existing) return existing;

  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
    select: { completed: true },
  });
  if (!enrollment?.completed) {
    throw new Error("Complete the course before preparing your certificate.");
  }

  const overallScore = await computeCourseScore(studentId, courseId);
  const certificateNumber = await generateUniqueCertificateNumber();

  try {
    const certificate = await prisma.certificate.create({
      data: {
        certificateNumber,
        studentId,
        courseId,
        overallScore,
        certificateName: certificateName.trim(),
        certificateUrl: `/certificates/${certificateNumber}`,
      },
      include: { course: { select: courseSummarySelect } },
    });
    return mapCertificate(certificate);
  } catch (error) {
    // Unique constraint on [studentId, courseId] — a concurrent call already prepared it.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const raceWinner = await getCertificateForCourse(studentId, courseId);
      if (raceWinner) return raceWinner;
    }
    throw error;
  }
}

export async function findCertificateByNumber(certificateNumber: string): Promise<VerifiedCertificate | null> {
  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber },
    include: {
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
    overallScore: certificate.overallScore,
    studentName: certificate.certificateName,
    course: certificate.course,
  };
}
