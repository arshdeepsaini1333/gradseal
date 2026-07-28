"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Heart,
  Receipt,
  ClipboardList,
  FileCheck2,
  Settings,
  LifeBuoy,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import type { SessionStudent } from "@/lib/auth/session";
import { logoutStudent } from "@/actions/auth";
import AvatarCompletionRing from "@/components/profile/AvatarCompletionRing";
import Avatar from "@/components/ui/Avatar";

interface ProfileDropdownProps {
  student: Pick<SessionStudent, "firstName" | "lastName" | "email" | "profileImage">;
  profileCompletionPercent: number;
}

function getCompletionBarColor(percent: number): string {
  if (percent >= 80) return "bg-emerald-500";
  if (percent >= 50) return "bg-amber-500";
  return "bg-red-500";
}

const menuLinks = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Learning", href: "/student/my-learning", icon: BookOpen },
  { label: "My Certificates", href: "/student/certificates", icon: Award },
  { label: "My Wishlist", href: "/student/wishlist", icon: Heart },
  { label: "Purchase History", href: "/student/orders", icon: Receipt },
  { label: "Quiz/Test Results", href: "/student/tests", icon: ClipboardList },
  { label: "Assignments", href: "/student/assignments", icon: FileCheck2 },
  { label: "Settings", href: "/student/settings", icon: Settings },
  { label: "Help & Support", href: "/student/support", icon: LifeBuoy },
];

export default function ProfileDropdown({ student, profileCompletionPercent }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const fullName = `${student.firstName} ${student.lastName}`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <AvatarCompletionRing percent={profileCompletionPercent} size={40}>
        <button
          type="button"
          aria-label={`Open profile menu — profile ${profileCompletionPercent}% complete`}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white text-sm font-semibold shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
        >
          <Avatar
            src={student.profileImage}
            name={fullName}
            email={student.email}
            className="w-full h-full object-cover"
          />
        </button>
      </AvatarCompletionRing>

      {open && (
        <div className="absolute right-0 top-12 w-72 rounded-2xl border border-slate-100 bg-white shadow-lg py-2 z-50">
          <div className="px-4 py-3 flex items-center gap-3">
            <AvatarCompletionRing percent={profileCompletionPercent} size={48}>
              <div className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white text-sm font-semibold shrink-0">
                <Avatar
                  src={student.profileImage}
                  name={fullName}
                  email={student.email}
                  className="w-full h-full object-cover"
                />
              </div>
            </AvatarCompletionRing>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0F172A] truncate">{fullName}</p>
              <p className="text-xs text-[#64748B] truncate">{student.email}</p>
            </div>
          </div>

          {profileCompletionPercent < 100 ? (
            <div className="px-4 pb-3">
              <div className="flex items-center justify-between text-xs font-medium text-[#64748B]">
                <span>Profile completion</span>
                <span className="font-bold text-[#0F172A]">{profileCompletionPercent}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${getCompletionBarColor(profileCompletionPercent)}`}
                  style={{ width: `${profileCompletionPercent}%` }}
                />
              </div>
              <Link
                href="/student/profile"
                onClick={() => setOpen(false)}
                className="mt-2 inline-block text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
              >
                Complete your profile →
              </Link>
            </div>
          ) : (
            <div className="px-4 pb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Profile complete
              </span>
            </div>
          )}

          <div className="border-t border-slate-100 my-1" />

          <ul className="py-1">
            {menuLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#0F172A] hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
                >
                  <link.icon className="w-4 h-4" aria-hidden="true" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-100 my-1" />

          <form action={logoutStudent} className="px-2 pt-1">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
