import Link from "next/link";
import { Clock, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import PrepareCertificateButton from "@/components/certificates/PrepareCertificateButton";
import type { LearnerCourse, LearnerLessonDetail } from "@/types/learning";

interface RightRailProps {
  course: LearnerCourse;
  lesson: LearnerLessonDetail;
  studentName: string;
}

export default function RightRail({ course, lesson, studentName }: RightRailProps) {
  const flatLessons = course.modules.flatMap((mod) => mod.lessons);
  const remainingMinutes = flatLessons
    .filter((l) => !l.completed)
    .reduce((sum, l) => sum + l.duration, 0);

  const canAdvance = lesson.completed && lesson.quizPassed;

  return (
    <aside className="hidden w-72 flex-shrink-0 border-l border-slate-100 p-6 xl:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#94A3B8]">
          Course progress
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#2563EB]"
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
        <p className="mt-1.5 text-sm font-semibold text-[#0F172A]">
          {course.progressPercent}% complete
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-[#64748B]">
        <Clock className="w-4 h-4" aria-hidden="true" />
        <span>{remainingMinutes} min remaining</span>
      </div>

      <div className="mt-8">
        {lesson.nextLessonId ? (
          canAdvance ? (
            <Link href={`/student/learn/${course.slug}/${lesson.nextLessonId}`}>
              <Button className="w-full">Next Lesson</Button>
            </Link>
          ) : (
            <Button
              className="w-full"
              disabled
              title="Complete this lesson and its quiz to continue"
            >
              <Lock className="w-4 h-4" aria-hidden="true" /> Next Lesson
            </Button>
          )
        ) : canAdvance ? (
          <PrepareCertificateButton
            courseId={course.id}
            defaultName={studentName}
            certificateNumber={course.certificateNumber}
            className="w-full"
          />
        ) : (
          <p className="text-sm text-[#64748B]">
            Finish this lesson{lesson.hasQuiz ? " and its quiz" : ""} to complete the course.
          </p>
        )}
      </div>

      {/* Notes & bookmarks land here in a later phase. */}
    </aside>
  );
}
