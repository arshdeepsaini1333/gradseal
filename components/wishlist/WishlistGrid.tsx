"use client";

import { useState } from "react";
import Link from "next/link";
import WishlistCard from "@/components/wishlist/WishlistCard";
import type { WishlistCourse } from "@/lib/wishlist";

export default function WishlistGrid({ items }: { items: WishlistCourse[] }) {
  const [courses, setCourses] = useState(items);

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
        <p className="text-[#0F172A] font-semibold">Your wishlist is empty.</p>
        <p className="mt-1.5 text-sm text-[#64748B]">
          Save courses you&apos;re interested in to find them here later.
        </p>
        <Link
          href="/courses"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((item) => (
        <WishlistCard
          key={item.id}
          item={item}
          onRemoved={(courseId) => setCourses((prev) => prev.filter((c) => c.courseId !== courseId))}
        />
      ))}
    </div>
  );
}
