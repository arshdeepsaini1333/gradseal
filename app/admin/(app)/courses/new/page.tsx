import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { AddCourseWizard } from "@/components/admin/courses/AddCourseWizard";

export const metadata: Metadata = { title: "Add Course – GradSeal Admin" };

export default async function AdminNewCoursePage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add Course</h1>
        <p className="text-sm text-muted-foreground">
          Build a course lesson by lesson, with a test attached to each one.
        </p>
      </div>

      <AddCourseWizard initialCategories={categories} />
    </div>
  );
}
