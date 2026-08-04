import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findCertificateByNumber, isValidCertificateNumberFormat, normalizeCertificateNumber } from "@/lib/certificates";
import CertificateDocument from "@/components/certificates/CertificateDocument";

export const metadata: Metadata = { title: "Certificate – GradSeal" };

export default async function CertificateViewPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const certificateNumber = normalizeCertificateNumber(number);
  if (!isValidCertificateNumberFormat(certificateNumber)) {
    notFound();
  }

  const certificate = await findCertificateByNumber(certificateNumber);
  if (!certificate) {
    notFound();
  }

  return <CertificateDocument certificate={certificate} />;
}
