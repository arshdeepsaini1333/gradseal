import type { Metadata } from "next";
import { Bell } from "lucide-react";
import SectionCard from "@/components/ui/SectionCard";
import PasswordSecuritySection from "@/components/settings/PasswordSecuritySection";
import DeleteAccountSection from "@/components/settings/DeleteAccountSection";
import { getStudentAccountInfo } from "@/lib/students";

export const metadata: Metadata = { title: "Account Settings – GradSeal" };

const notificationPreferences = [
  { id: "course-updates", label: "Course updates", description: "New lessons, materials, and announcements." },
  { id: "test-reminders", label: "Test & assignment reminders", description: "Upcoming due dates and deadlines." },
  { id: "order-receipts", label: "Order receipts", description: "Purchase confirmations and invoices." },
  { id: "marketing", label: "Offers & promotions", description: "Discounts and new course launches." },
];

export default async function SettingsPage() {
  const account = await getStudentAccountInfo();
  if (!account) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Account Settings</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Manage your password, notifications, and account preferences.
        </p>
      </div>

      <PasswordSecuritySection email={account.email} hasPassword={account.hasPassword} />

      <SectionCard
        icon={Bell}
        title="Notification Preferences"
        description="Choose what you want to be notified about."
        contentClassName="divide-y divide-slate-100"
      >
        {notificationPreferences.map((pref) => (
          <div key={pref.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div>
              <label htmlFor={pref.id} className="text-sm font-semibold text-[#0F172A]">
                {pref.label}
              </label>
              <p className="text-xs text-[#64748B]">{pref.description}</p>
            </div>
            <input
              id={pref.id}
              name={pref.id}
              type="checkbox"
              defaultChecked
              className="h-5 w-9 shrink-0 appearance-none rounded-full bg-slate-200 checked:bg-[#2563EB] relative cursor-pointer transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform checked:after:translate-x-4"
            />
          </div>
        ))}
      </SectionCard>

      <DeleteAccountSection />
    </div>
  );
}
