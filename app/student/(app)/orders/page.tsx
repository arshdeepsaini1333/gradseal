import type { Metadata } from "next";
import { Receipt } from "lucide-react";
import { getStudentSession } from "@/lib/auth/session";
import { getStudentOrders } from "@/lib/orders";
import { formatPrice } from "@/components/courses/courseFormat";

export const metadata: Metadata = { title: "Orders – GradSeal" };

const statusStyles: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-slate-100 text-[#64748B]",
};

const statusLabels: Record<string, string> = {
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export default async function OrdersPage() {
  const student = await getStudentSession();
  const orders = student ? await getStudentOrders(student.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Orders</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Your purchase history and receipts.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <p className="text-[#0F172A] font-semibold">You haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <Receipt className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-[#0F172A]">{order.orderNumber}</p>
                  <p className="text-sm text-[#64748B]">{order.items.join(", ")}</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    {new Date(order.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-bold text-[#0F172A]">{formatPrice(order.total)}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
