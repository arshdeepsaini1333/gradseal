"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { toast } from "sonner";
import { Award, Download, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { prepareCertificate } from "@/actions/certificates";

interface PrepareCertificateButtonProps {
  courseId: string;
  defaultName: string;
  certificateNumber: string | null;
  className?: string;
}

export default function PrepareCertificateButton({
  courseId,
  defaultName,
  certificateNumber: initialCertificateNumber,
  className = "",
}: PrepareCertificateButtonProps) {
  const router = useRouter();
  const [certificateNumber, setCertificateNumber] = useState(initialCertificateNumber);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const [isPending, startTransition] = useTransition();

  if (certificateNumber) {
    return (
      <a
        href={`/certificates/${certificateNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm ${className}`}
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        View &amp; Download Certificate
      </a>
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await prepareCertificate({ courseId, name });
        setCertificateNumber(result.certificateNumber);
        setOpen(false);
        toast.success("Your certificate is ready!");
        router.refresh();
        window.open(`/certificates/${result.certificateNumber}`, "_blank");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong.");
      }
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className={className}>
          <Award className="w-4 h-4" aria-hidden="true" />
          Prepare Your Certificate
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="dialog-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-2xl focus:outline-none"
        >
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 text-white shadow-lg shadow-slate-500/30">
            <Award className="h-7 w-7" aria-hidden="true" />
          </div>
          <Dialog.Title className="text-center text-2xl font-extrabold text-[#0F172A]">
            Prepare Your Certificate
          </Dialog.Title>
          <p className="mt-2 text-center text-sm text-[#64748B]">
            Type your name exactly as you want it printed on the certificate.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <Input
              label="Your Name"
              name="name"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              hint="This can't be changed once your certificate is generated."
            />
            <Button
              type="submit"
              loading={isPending}
              disabled={isPending || name.trim().length < 2}
              className="w-full"
            >
              Confirm &amp; Generate Certificate
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
