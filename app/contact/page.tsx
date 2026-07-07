import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Contact – GradSeal" };

export default function ContactPage() {
  return (
    <ComingSoon
      title="Get in Touch"
      description="Have a question or need support? Our contact form and support team are coming soon. In the meantime, email us at hello@gradseal.com."
    />
  );
}
