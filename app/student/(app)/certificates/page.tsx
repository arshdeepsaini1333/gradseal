import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Award, Download, Share2 } from "lucide-react";
import Button from "@/components/ui/Button";
import PrepareCertificateButton from "@/components/certificates/PrepareCertificateButton";
import { getStudentSession } from "@/lib/auth/session";
import { getStudentCertificates, getCoursesAwaitingCertificate } from "@/lib/certificates";

export const metadata: Metadata = { title: "My Certificates – GradSeal" };

export default async function CertificatesPage() {
  const student = await getStudentSession();
  if (!student) {
    redirect("/student/login");
  }

  const [certificates, coursesAwaitingCertificate] = await Promise.all([
    getStudentCertificates(student.id),
    getCoursesAwaitingCertificate(student.id),
  ]);
  const studentName = `${student.firstName} ${student.lastName}`;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">My Certificates</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Certificates you&apos;ve earned by completing courses.
        </p>
      </div>

      {coursesAwaitingCertificate.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-4">Ready to Certify</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesAwaitingCertificate.map((course) => (
              <div
                key={course.courseId}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-28 bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center">
                  <Award className="w-10 h-10 text-white/90" aria-hidden="true" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#0F172A] leading-snug">{course.courseTitle}</h3>
                  <p className="mt-1 text-sm text-[#64748B]">{course.category}</p>
                  <p className="mt-3 text-xs font-semibold text-emerald-600">Course completed!</p>

                  <div className="mt-4">
                    <PrepareCertificateButton
                      courseId={course.courseId}
                      defaultName={studentName}
                      certificateNumber={null}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {certificates.length === 0 && coursesAwaitingCertificate.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <p className="text-[#0F172A] font-semibold">You don&apos;t have any certificates yet.</p>
          <p className="mt-1.5 text-sm text-[#64748B]">
            Complete courses to get certificates.
          </p>
          <Link
            href="/courses"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm"
          >
            Browse Courses
          </Link>
        </div>
      ) : certificates.length > 0 ? (
        <section>
          {coursesAwaitingCertificate.length > 0 && (
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Issued Certificates</h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-28 bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center">
                  <Award className="w-10 h-10 text-white/90" aria-hidden="true" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#0F172A] leading-snug">{cert.courseTitle}</h3>
                  <p className="mt-1 text-sm text-[#64748B]">{cert.category}</p>
                  <p className="mt-3 text-xs font-semibold text-[#94A3B8]">
                    Certificate ID: {cert.certificateNumber}
                  </p>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Issued {cert.issuedAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                  <p className="mt-1 text-xs text-[#94A3B8]">Overall Score: {cert.overallScore}%</p>

                  <div className="mt-4 flex gap-2">
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm"
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                      Download
                    </a>
                    <Button variant="outline" className="px-3">
                      <Share2 className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
