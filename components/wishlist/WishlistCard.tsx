"use client";

import { useTransition } from "react";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import { removeFromWishlist } from "@/actions/wishlist";
import { addToCart } from "@/actions/cart";
import { levelLabel } from "@/components/courses/courseFormat";
import type { WishlistCourse } from "@/lib/wishlist";

interface WishlistCardProps {
  item: WishlistCourse;
  onRemoved: (courseId: string) => void;
}

export default function WishlistCard({ item, onRemoved }: WishlistCardProps) {
  const [isRemoving, startRemoveTransition] = useTransition();
  const [isAdding, startAddTransition] = useTransition();

  function handleRemove() {
    startRemoveTransition(async () => {
      try {
        await removeFromWishlist(item.courseId, item.slug);
        onRemoved(item.courseId);
      } catch {
        toast.error("Couldn't remove from wishlist.");
      }
    });
  }

  function handleAddToCart() {
    startAddTransition(async () => {
      try {
        await addToCart(item.courseId, item.slug);
        toast.success("Added to cart.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't add to cart.");
      }
    });
  }

  const salePrice = item.discountedPrice ?? item.price;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-28 bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-between px-4 text-white/90 text-sm font-semibold">
        {item.category}
        <button
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
          aria-label="Remove from wishlist"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      <div className="p-5">
        <Link href={`/courses/${item.slug}`}>
          <h3 className="font-bold text-[#0F172A] leading-snug hover:text-[#2563EB] transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm text-[#64748B]">{levelLabel[item.level]}</p>
        <p className="mt-2 text-lg font-extrabold text-[#0F172A]">₹{salePrice.toLocaleString("en-IN")}</p>

        <Button variant="primary" className="w-full mt-4" loading={isAdding} onClick={handleAddToCart}>
          <ShoppingCart className="w-4 h-4" aria-hidden="true" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
