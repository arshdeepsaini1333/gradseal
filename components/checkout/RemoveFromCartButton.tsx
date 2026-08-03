"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeFromCart } from "@/actions/cart";

export default function RemoveFromCartButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await removeFromCart(courseId);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't remove item.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label="Remove from cart"
      className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="w-4 h-4" aria-hidden="true" />
      )}
    </button>
  );
}
