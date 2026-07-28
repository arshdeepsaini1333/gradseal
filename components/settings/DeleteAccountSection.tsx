"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldAlert, Trash2 } from "lucide-react";

import SectionCard from "@/components/ui/SectionCard";
import Button from "@/components/ui/Button";
import { deleteAccount, type DeleteAccountState } from "@/actions/account";
import { DELETE_ACCOUNT_CONFIRM_TEXT } from "@/lib/validations/account";

export default function DeleteAccountSection() {
  const [expanded, setExpanded] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [state, formAction, isPending] = useActionState<DeleteAccountState, FormData>(
    deleteAccount,
    undefined
  );

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state]);

  const canDelete = confirmText === DELETE_ACCOUNT_CONFIRM_TEXT;

  return (
    <SectionCard
      icon={ShieldAlert}
      title="Danger Zone"
      description="Deleting your account is permanent and cannot be undone."
      tone="danger"
      contentClassName=""
    >
      {!expanded ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => setExpanded(true)}
          className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete Account
        </Button>
      ) : (
        <form
          action={formAction}
          className="flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50/50 p-4"
        >
          <p className="text-sm text-red-700">
            This will permanently delete your profile, enrollments, certificates, and progress.
            Type <span className="font-mono font-bold">{DELETE_ACCOUNT_CONFIRM_TEXT}</span> to
            confirm.
          </p>
          <input
            type="text"
            name="confirmText"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={DELETE_ACCOUNT_CONFIRM_TEXT}
            autoComplete="off"
            aria-label={`Type ${DELETE_ACCOUNT_CONFIRM_TEXT} to confirm`}
            className="w-full max-w-xs rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400"
          />
          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              variant="outline"
              disabled={!canDelete || isPending}
              loading={isPending}
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              Permanently Delete Account
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setExpanded(false);
                setConfirmText("");
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </SectionCard>
  );
}
