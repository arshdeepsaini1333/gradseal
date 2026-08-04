import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getStudentSession } from "@/lib/auth/session";
import { getStudentNotifications, markAllNotificationsRead } from "@/lib/notifications";
import { formatRelativeTime } from "@/lib/format";

export const metadata: Metadata = { title: "Notifications – GradSeal" };

export default async function NotificationsPage() {
  const student = await getStudentSession();
  if (!student) {
    redirect("/student/login");
  }

  const notifications = await getStudentNotifications(student.id);
  await markAllNotificationsRead(student.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Notifications</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Updates about your courses, tests, and orders.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <p className="text-[#0F172A] font-semibold">You&apos;re all caught up.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {notifications.map((notification) => {
            const content = (
              <>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#0F172A]">{notification.title}</p>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-[#2563EB]" aria-label="Unread" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-[#64748B]">{notification.message}</p>
                  <p className="mt-1.5 text-xs text-[#94A3B8]">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              </>
            );

            return notification.courseSlug ? (
              <Link
                key={notification.id}
                href={`/courses/${notification.courseSlug}`}
                className={`flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors ${
                  !notification.read ? "bg-blue-50/40" : ""
                }`}
              >
                {content}
              </Link>
            ) : (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-5 ${!notification.read ? "bg-blue-50/40" : ""}`}
              >
                {content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
