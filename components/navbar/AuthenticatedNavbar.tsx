"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ShoppingCart, Bell } from "lucide-react";
import type { SessionStudent } from "@/lib/auth/session";
import ProfileDropdown from "@/components/navbar/ProfileDropdown";

interface AuthenticatedNavbarProps {
  student: SessionStudent;
  cartItemCount: number;
  unreadNotificationCount: number;
}

export default function AuthenticatedNavbar({
  student,
  cartItemCount,
  unreadNotificationCount,
}: AuthenticatedNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white ${
        scrolled ? "shadow-sm border-b border-slate-200/60" : "border-b border-slate-100"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/student/dashboard"
          className="flex items-center gap-2 font-bold text-xl text-[#0F172A] shrink-0"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2563EB] text-white text-sm font-extrabold">
            G
          </span>
          <span className="hidden sm:inline">
            Grad<span className="text-[#2563EB]">Seal</span>
          </span>
        </Link>

        {/* Left: browse + categories + search */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          <Link
            href="/courses"
            className="px-3 py-2 rounded-lg text-sm font-medium text-[#0F172A] hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
          >
            Browse Courses
          </Link>
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-[#0F172A] hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
          >
            Categories
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden md:flex flex-1 max-w-md">
          <label className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, instructors, certificates"
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]"
            />
          </label>
        </div>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-1 ml-auto shrink-0">
          <Link
            href="/student/my-learning"
            className="px-3 py-2 rounded-lg text-sm font-medium text-[#0F172A] hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
          >
            My Learning
          </Link>

          <Link
            href="/student/cart"
            aria-label="Cart"
            className="relative p-2 rounded-lg text-[#0F172A] hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#2563EB] text-white text-[10px] font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>

          <Link
            href="/student/notifications"
            aria-label="Notifications"
            className="relative p-2 rounded-lg text-[#0F172A] hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {unreadNotificationCount}
              </span>
            )}
          </Link>

          <div className="ml-1">
            <ProfileDropdown student={student} />
          </div>
        </div>

        {/* Mobile: cart, notifications, profile always visible, hamburger for the rest */}
        <div className="flex md:hidden items-center gap-1 ml-auto shrink-0">
          <Link
            href="/student/cart"
            aria-label="Cart"
            className="relative p-2 rounded-lg text-[#0F172A] hover:bg-slate-100 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#2563EB] text-white text-[10px] font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>
          <ProfileDropdown student={student} />
          <button
            aria-label="Toggle menu"
            className="p-2 rounded-lg text-[#0F172A] hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="block w-5 h-0.5 bg-current mb-1.5 transition-transform" />
            <span className="block w-5 h-0.5 bg-current mb-1.5" />
            <span className="block w-5 h-0.5 bg-current transition-transform" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              <label className="relative w-full mb-2">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses, instructors, certificates"
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
                />
              </label>
              <Link
                href="/courses"
                className="px-4 py-3 rounded-lg text-sm font-medium text-[#0F172A] hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
              >
                Browse Courses
              </Link>
              <button
                type="button"
                className="flex items-center gap-1 px-4 py-3 rounded-lg text-sm font-medium text-[#0F172A] hover:text-[#2563EB] hover:bg-blue-50 transition-colors text-left"
              >
                Categories
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </button>
              <Link
                href="/student/my-learning"
                className="px-4 py-3 rounded-lg text-sm font-medium text-[#0F172A] hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
              >
                My Learning
              </Link>
              <Link
                href="/student/notifications"
                className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-[#0F172A] hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
              >
                Notifications
                {unreadNotificationCount > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {unreadNotificationCount}
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
