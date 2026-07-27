import type { Metadata } from "next";
import { Lock, Bell, ShieldAlert } from "lucide-react";
import SectionCard from "@/components/ui/SectionCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Account Settings – GradSeal" };

const notificationPreferences = [
  { id: "course-updates", label: "Course updates", description: "New lessons, materials, and announcements." },
  { id: "test-reminders", label: "Test & assignment reminders", description: "Upcoming due dates and deadlines." },
  { id: "order-receipts", label: "Order receipts", description: "Purchase confirmations and invoices." },
  { id: "marketing", label: "Offers & promotions", description: "Discounts and new course launches." },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Account Settings</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Manage your password, notifications, and account preferences.
        </p>
      </div>

      <SectionCard icon={Lock} title="Change Password" description="Use a strong password you don't use elsewhere.">
        <Input label="Current Password" name="currentPassword" type="password" required />
        <div className="hidden sm:block" />
        <Input label="New Password" name="newPassword" type="password" required />
        <Input label="Confirm New Password" name="confirmPassword" type="password" required />
        <div className="sm:col-span-2 flex justify-end">
          <Button variant="primary">Update Password</Button>
        </div>
      </SectionCard>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <Bell className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Notification Preferences</h2>
            <p className="text-sm text-[#64748B]">Choose what you want to be notified about.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
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
        </div>
      </section>

      <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Danger Zone</h2>
            <p className="text-sm text-[#64748B]">Deleting your account is permanent and cannot be undone.</p>
          </div>
        </div>
        <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white">
          Delete Account
        </Button>
      </section>
    </div>
  );
}
