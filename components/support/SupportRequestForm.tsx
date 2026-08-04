"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import SectionCard from "@/components/ui/SectionCard";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { submitSupportRequest, type SupportRequestState } from "@/actions/support";

function fieldError(errors: Record<string, string[]> | undefined, field: string): string | undefined {
  return errors?.[field]?.[0];
}

export default function SupportRequestForm() {
  const [state, formAction, isPending] = useActionState<SupportRequestState, FormData>(
    submitSupportRequest,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message ?? "Message sent.");
      formRef.current?.reset();
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction}>
      <SectionCard icon={Mail} title="Contact Support" description="Can't find an answer? Send us a message.">
        <Input
          label="Subject"
          name="subject"
          required
          error={fieldError(state?.errors, "subject")}
        />
        <Input label="Order ID (optional)" name="orderId" error={fieldError(state?.errors, "orderId")} />
        <div className="sm:col-span-2">
          <Textarea
            label="Message"
            name="message"
            rows={5}
            required
            error={fieldError(state?.errors, "message")}
          />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <Button type="submit" variant="primary" loading={isPending} disabled={isPending}>
            Send Message
          </Button>
        </div>
      </SectionCard>
    </form>
  );
}
