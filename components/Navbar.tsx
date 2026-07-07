"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Certificates", href: "/certificates" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/60"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-[#0F172A] shrink-0"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2563EB] text-white text-sm font-extrabold">
            G
          </span>
          <span>
            Grad<span className="text-[#2563EB]">Seal</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#2563EB] bg-blue-50"
                      : "text-[#0F172A] hover:text-[#2563EB] hover:bg-blue-50"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/student/login"
            className="px-4 py-2 text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
          >
            Student Login
          </Link>
          <Link
            href="/student/register"
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-lg text-[#0F172A] hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="block w-5 h-0.5 bg-current mb-1.5 transition-transform" />
          <span className="block w-5 h-0.5 bg-current mb-1.5" />
          <span className="block w-5 h-0.5 bg-current transition-transform" />
        </button>
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
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#2563EB] bg-blue-50"
                        : "text-[#0F172A] hover:text-[#2563EB] hover:bg-blue-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  href="/student/login"
                  className="px-4 py-3 rounded-lg text-sm font-medium text-[#2563EB] hover:bg-blue-50 transition-colors"
                >
                  Student Login
                </Link>
                <Link
                  href="/student/register"
                  className="mt-1 px-5 py-3 rounded-xl text-sm font-semibold text-center text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
