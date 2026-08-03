import type { Metadata } from "next";
import Image from "next/image";
import { getStudentSession } from "@/lib/auth/session";
import { getCartItems } from "@/lib/cart";
import { formatPrice } from "@/components/courses/courseFormat";
import RemoveFromCartButton from "@/components/checkout/RemoveFromCartButton";
import RazorpayCheckoutButton from "@/components/checkout/RazorpayCheckoutButton";

export const metadata: Metadata = { title: "Cart – GradSeal" };

export default async function CartPage() {
  const student = await getStudentSession();
  const items = student ? await getCartItems(student.id) : [];

  const subtotal = items.reduce((sum, item) => sum + (item.discountedPrice ?? item.price), 0);
  const originalTotal = items.reduce((sum, item) => sum + item.price, 0);
  const savings = originalTotal - subtotal;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Cart</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          {items.length} {items.length === 1 ? "course" : "courses"} in your cart.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <p className="text-[#0F172A] font-semibold">Your cart is empty.</p>
          <p className="mt-1.5 text-sm text-[#64748B]">Browse courses and add one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-20 rounded-xl bg-[#F8FAFC] shrink-0 overflow-hidden">
                    <Image src={item.thumbnail} alt={item.title} fill className="object-contain p-2" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F172A]">{item.title}</p>
                    <p className="text-sm text-[#64748B]">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-[#0F172A]">{formatPrice(item.discountedPrice ?? item.price)}</p>
                    {item.discountedPrice && (
                      <p className="text-xs text-[#94A3B8] line-through">{formatPrice(item.price)}</p>
                    )}
                  </div>
                  <RemoveFromCartButton courseId={item.courseId} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-[#0F172A]">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#64748B]">
                <span>Subtotal</span>
                <span>{formatPrice(originalTotal)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Savings</span>
                  <span>-{formatPrice(savings)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-[#0F172A] pt-2 border-t border-slate-100">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
            <RazorpayCheckoutButton
              courseIds={items.map((item) => item.courseId)}
              label="Proceed to Checkout"
              className="w-full"
              successRedirect="/student/orders"
            />
          </div>
        </div>
      )}
    </div>
  );
}
