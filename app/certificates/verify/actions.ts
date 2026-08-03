"use server";

import {
  findCertificateByNumber,
  isValidCertificateNumberFormat,
  normalizeCertificateNumber,
  type VerifiedCertificate,
} from "@/lib/certificates";

export type VerifyCertificateResult =
  | { status: "invalid" }
  | { status: "not_found"; certificateNumber: string }
  | { status: "found"; certificate: VerifiedCertificate };

export async function verifyCertificateNumber(rawInput: string): Promise<VerifyCertificateResult> {
  const certificateNumber = normalizeCertificateNumber(rawInput);

  if (!isValidCertificateNumberFormat(certificateNumber)) {
    return { status: "invalid" };
  }

  const certificate = await findCertificateByNumber(certificateNumber);
  if (!certificate) {
    return { status: "not_found", certificateNumber };
  }

  return { status: "found", certificate };
}
