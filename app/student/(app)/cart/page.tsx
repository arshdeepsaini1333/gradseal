import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { cartItems } from "@/lib/mock-dashboard-data";

export const metadata: Metadata = { title: "Cart – GradSeal" };

export default function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + (item.originalPrice ?? item.price), 0);
  const savings = originalTotal - subtotal;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Cart</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          {cartItems.length} {cartItems.length === 1 ? "course" : "courses"} in your cart.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <p className="text-[#0F172A] font-semibold">Your cart is empty.</p>
          <p className="mt-1.5 text-sm text-[#64748B]">Browse courses and add one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-20 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] shrink-0" />
                  <div>
                    <p className="font-semibold text-[#0F172A]">{item.title}</p>
                    <p className="text-sm text-[#64748B]">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-[#0F172A]">₹{item.price.toLocaleString("en-IN")}</p>
                    {item.originalPrice && (
                      <p className="text-xs text-[#94A3B8] line-through">
                        ₹{item.originalPrice.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="Remove from cart"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-[#0F172A]">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#64748B]">
                <span>Subtotal</span>
                <span>₹{originalTotal.toLocaleString("en-IN")}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Savings</span>
                  <span>-₹{savings.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-[#0F172A] pt-2 border-t border-slate-100">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <Button variant="primary" className="w-full">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
