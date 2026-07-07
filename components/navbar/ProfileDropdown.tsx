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
} from "lucide-react";
import type { SessionStudent } from "@/lib/auth/session";
import { logoutStudent } from "@/actions/auth";

interface ProfileDropdownProps {
  student: Pick<SessionStudent, "firstName" | "lastName" | "email" | "profileImage">;
}

const menuLinks = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Learning", href: "/student/dashboard/my-learning", icon: BookOpen },
  { label: "My Certificates", href: "/student/dashboard/certificates", icon: Award },
  { label: "My Wishlist", href: "/student/dashboard/wishlist", icon: Heart },
  { label: "Purchase History", href: "/student/dashboard/orders", icon: Receipt },
  { label: "Quiz/Test Results", href: "/student/dashboard/tests", icon: ClipboardList },
  { label: "Assignments", href: "/student/dashboard/assignments", icon: FileCheck2 },
  { label: "Settings", href: "/student/dashboard/settings", icon: Settings },
  { label: "Help & Support", href: "/student/dashboard/support", icon: LifeBuoy },
];

export default function ProfileDropdown({ student }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const fullName = `${student.firstName} ${student.lastName}`;
  const initials = `${student.firstName[0] ?? ""}${student.lastName[0] ?? ""}`.toUpperCase();

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
      <button
        type="button"
        aria-label="Open profile menu"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white text-sm font-semibold shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
      >
        {student.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={student.profileImage} alt={fullName} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-72 rounded-2xl border border-slate-100 bg-white shadow-lg py-2 z-50">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white text-sm font-semibold shrink-0">
              {student.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={student.profileImage}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0F172A] truncate">{fullName}</p>
              <p className="text-xs text-[#64748B] truncate">{student.email}</p>
            </div>
          </div>

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
