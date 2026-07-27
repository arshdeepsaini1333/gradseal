import type { Metadata } from "next";
import { Info, CheckCircle2, AlertTriangle, Package } from "lucide-react";
import { notificationItems } from "@/lib/mock-dashboard-data";
import type { NotificationItem } from "@/types/dashboard";

export const metadata: Metadata = { title: "Notifications – GradSeal" };

const typeIcons: Record<NotificationItem["type"], typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  order: Package,
};

const typeStyles: Record<NotificationItem["type"], string> = {
  info: "bg-blue-50 text-[#2563EB]",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  order: "bg-violet-50 text-violet-600",
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Notifications</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Updates about your courses, tests, and orders.
        </p>
      </div>

      {notificationItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <p className="text-[#0F172A] font-semibold">You&apos;re all caught up.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {notificationItems.map((notification) => {
            const Icon = typeIcons[notification.type];
            return (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-5 ${!notification.read ? "bg-blue-50/40" : ""}`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeStyles[notification.type]}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#0F172A]">{notification.title}</p>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-[#2563EB]" aria-label="Unread" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-[#64748B]">{notification.message}</p>
                  <p className="mt-1.5 text-xs text-[#94A3B8]">{notification.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
