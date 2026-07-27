import type { Metadata } from "next";
import { LifeBuoy, Mail, MessageCircle, Phone } from "lucide-react";
import SectionCard from "@/components/ui/SectionCard";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Support – GradSeal" };

const faqs = [
  {
    question: "How do I download my certificate?",
    answer: "Go to My Certificates and click Download on any certificate you've earned.",
  },
  {
    question: "Can I get a refund on a course?",
    answer: "Yes, refunds are available within 7 days of purchase if you haven't completed more than 20% of the course. Contact support to request one.",
  },
  {
    question: "How long do I have access to a course?",
    answer: "All courses come with lifetime access once purchased, including future content updates.",
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Support</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Get help with your account, courses, or orders.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">Email</p>
            <p className="text-xs text-[#64748B]">support@gradseal.com</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <Phone className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">Phone</p>
            <p className="text-xs text-[#64748B]">+91 98765 43210</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">Live Chat</p>
            <p className="text-xs text-[#64748B]">Mon–Sat, 9am–7pm IST</p>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <LifeBuoy className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Frequently Asked Questions</h2>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-4 first:pt-0 last:pb-0">
              <summary className="cursor-pointer list-none text-sm font-semibold text-[#0F172A] flex items-center justify-between">
                {faq.question}
                <span className="text-[#94A3B8] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm text-[#64748B]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <SectionCard icon={Mail} title="Contact Support" description="Can't find an answer? Send us a message.">
        <Input label="Subject" name="subject" required />
        <Input label="Order ID (optional)" name="orderId" />
        <div className="sm:col-span-2">
          <Textarea label="Message" name="message" rows={5} required />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <Button variant="primary">Send Message</Button>
        </div>
      </SectionCard>
    </div>
  );
}
