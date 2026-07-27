import type { Metadata } from "next";
import { Award, Download, Share2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { certificates } from "@/lib/mock-dashboard-data";

export const metadata: Metadata = { title: "My Certificates – GradSeal" };

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">My Certificates</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Certificates you&apos;ve earned by completing courses.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <p className="text-[#0F172A] font-semibold">You haven&apos;t earned any certificates yet.</p>
          <p className="mt-1.5 text-sm text-[#64748B]">
            Complete a course to unlock your first certificate.
          </p>
        </div>
      ) : (
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
                  Certificate ID: {cert.certificateId}
                </p>
                <p className="mt-1 text-xs text-[#94A3B8]">
                  Issued {new Date(cert.issuedDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                </p>

                <div className="mt-4 flex gap-2">
                  <Button variant="primary" className="flex-1">
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Download
                  </Button>
                  <Button variant="outline" className="px-3">
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
