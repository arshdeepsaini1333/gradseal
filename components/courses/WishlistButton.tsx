"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "@/actions/wishlist";

interface WishlistButtonProps {
  courseId: string;
  courseSlug: string;
  isLoggedIn: boolean;
  initialWishlisted: boolean;
  className?: string;
}

export default function WishlistButton({
  courseId,
  courseSlug,
  isLoggedIn,
  initialWishlisted,
  className = "",
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Link href="/student/login" aria-label="Log in to add to wishlist" className={className}>
        <Heart className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
      </Link>
    );
  }

  function handleClick() {
    const next = !wishlisted;
    setWishlisted(next);
    startTransition(async () => {
      try {
        if (next) {
          await addToWishlist(courseId, courseSlug);
        } else {
          await removeFromWishlist(courseId, courseSlug);
        }
      } catch (err) {
        setWishlisted(!next);
        toast.error(err instanceof Error ? err.message : "Couldn't update your wishlist.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      className={className}
    >
      <Heart
        className={`w-4 h-4 ${wishlisted ? "fill-rose-500 text-rose-500" : "text-[#64748B]"}`}
        aria-hidden="true"
      />
    </button>
  );
}
