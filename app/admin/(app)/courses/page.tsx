import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";
import { formatStatValue } from "@/lib/format";

export const metadata: Metadata = { title: "Courses – GradSeal Admin" };

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      categories: true,
      modules: { include: { lessons: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground">Manage the course catalog.</p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus /> Add Course
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <BookOpen className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">No courses yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first course to start building the catalog.
              </p>
            </div>
            <Button asChild className="mt-2">
              <Link href="/admin/courses/new">
                <Plus /> Add Course
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const lessonCount = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
            return (
              <Card key={course.id} size="sm" className="overflow-hidden">
                <div className="relative aspect-video w-full bg-muted">
                  <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                </div>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={course.isPublished ? "default" : "outline"}>
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                    {course.categories.map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  <p className="font-medium text-foreground">{course.title}</p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{course.shortDescription}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{lessonCount} lessons</span>
                    <span className="font-medium text-foreground">
                      {formatStatValue(Number(course.discountedPrice ?? course.price), "currency")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
