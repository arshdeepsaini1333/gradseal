import type { Metadata } from "next";
import Link from "next/link";
import { Star, ShoppingCart, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { wishlistItems } from "@/lib/mock-dashboard-data";

export const metadata: Metadata = { title: "Wishlist – GradSeal" };

export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Wishlist</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Courses you&apos;ve saved for later.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <p className="text-[#0F172A] font-semibold">Your wishlist is empty.</p>
          <p className="mt-1.5 text-sm text-[#64748B]">
            Save courses you&apos;re interested in to find them here later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-28 bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-between px-4 text-white/90 text-sm font-semibold">
                {item.category}
                <button
                  type="button"
                  aria-label="Remove from wishlist"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
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
                <div className="mt-1.5 flex items-center gap-1 text-sm text-[#64748B]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {item.rating}
                </div>
                <p className="mt-2 text-lg font-extrabold text-[#0F172A]">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>

                <Button variant="primary" className="w-full mt-4">
                  <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
