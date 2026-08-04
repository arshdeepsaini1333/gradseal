import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth/session";
import { getWishlistCourses } from "@/lib/wishlist";
import WishlistGrid from "@/components/wishlist/WishlistGrid";

export const metadata: Metadata = { title: "Wishlist – GradSeal" };

export default async function WishlistPage() {
  const student = await getStudentSession();
  if (!student) {
    redirect("/student/login");
  }

  const items = await getWishlistCourses(student.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Wishlist</h1>
        <p className="mt-1.5 text-[#64748B] text-sm sm:text-base">
          Courses you&apos;ve saved for later.
        </p>
      </div>

      <WishlistGrid items={items} />
    </div>
  );
}
