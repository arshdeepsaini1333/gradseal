"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ShoppingCart, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { addToCart } from "@/actions/cart";
import RazorpayCheckoutButton from "@/components/checkout/RazorpayCheckoutButton";

export default function CourseBuyBox({
  courseId,
  courseSlug,
  isLoggedIn,
  isEnrolled,
  initialInCart,
}: {
  courseId: string;
  courseSlug: string;
  isLoggedIn: boolean;
  isEnrolled: boolean;
  initialInCart: boolean;
}) {
  const [inCart, setInCart] = useState(initialInCart);
  const [isPending, startTransition] = useTransition();

  if (isEnrolled) {
    return (
      <Link
        href="/student/my-learning"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg transition-all"
      >
        <Check className="w-4 h-4" />
        Go to My Learning
      </Link>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/student/login"
          className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
        >
          Login to Enroll
        </Link>
        <Link href="/student/register" className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
          New here? Create an account
        </Link>
      </div>
    );
  }

  function handleAddToCart() {
    startTransition(async () => {
      try {
        await addToCart(courseId, courseSlug);
        setInCart(true);
        toast.success("Added to cart.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't add to cart.");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <RazorpayCheckoutButton courseIds={[courseId]} label="Buy Now" />
      {inCart ? (
        <Link
          href="/student/cart"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-semibold text-sm transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          Go to Cart
        </Link>
      ) : (
        <Button variant="outline" loading={isPending} onClick={handleAddToCart}>
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      )}
    </div>
  );
}
