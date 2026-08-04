"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import QuizRunner from "@/components/learn/QuizRunner";
import { markLessonComplete, updateLessonProgress } from "@/actions/learning";
import type { LearnerLessonDetail } from "@/types/learning";

interface LessonViewProps {
  courseSlug: string;
  lesson: LearnerLessonDetail;
}

const MILESTONES = [25, 50, 75, 95, 100];

export default function LessonView({ courseSlug, lesson }: LessonViewProps) {
  const [completed, setCompleted] = useState(lesson.completed);
  const [quizPassed, setQuizPassed] = useState(lesson.quizPassed);
  const [reachedBottom, setReachedBottom] = useState(lesson.completed || lesson.scrollPercent >= 95);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const contentRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const reportedMilestones = useRef(
    new Set<number>(MILESTONES.filter((m) => m <= lesson.scrollPercent))
  );
  const ticking = useRef(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setReachedBottom(true);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function reportMilestones(percent: number) {
      for (const milestone of MILESTONES) {
        if (percent >= milestone && !reportedMilestones.current.has(milestone)) {
          reportedMilestones.current.add(milestone);
          updateLessonProgress({ lessonId: lesson.id, scrollPercent: milestone }).catch(() => {});
        }
      }
    }

    function handleScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        const el = contentRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(scrollable, 0));
        const percent = scrollable > 0 ? Math.round((scrolled / scrollable) * 100) : 100;
        reportMilestones(percent);
      });
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lesson.id]);

  function handleComplete() {
    setError(null);
    startTransition(async () => {
      try {
        await markLessonComplete({ lessonId: lesson.id });
        setCompleted(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold leading-tight text-[#0F172A] sm:text-3xl">
          {lesson.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#64748B]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4" aria-hidden="true" /> {lesson.duration} min
          </span>
          {completed && (
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Completed
            </span>
          )}
        </div>
      </header>

      <div
        ref={contentRef}
        className="max-w-none select-none"
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {lesson.videoUrl && (
          <video src={lesson.videoUrl} controls className="mb-6 w-full rounded-2xl bg-black" />
        )}

        {lesson.description && (
          <p className="whitespace-pre-line text-base leading-relaxed text-[#334155]">
            {lesson.description}
          </p>
        )}

        {lesson.images.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {lesson.images.map((src) => (
              <div
                key={src}
                className="relative aspect-video overflow-hidden rounded-xl border border-slate-100"
              >
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8">
        {!completed ? (
          <Button onClick={handleComplete} loading={pending} disabled={!reachedBottom}>
            {reachedBottom ? "Mark Lesson Complete" : "Keep reading to unlock"}
          </Button>
        ) : lesson.quiz && !quizPassed ? (
          <div>
            <h2 className="mb-4 text-lg font-bold text-[#0F172A]">Quiz: {lesson.quiz.title}</h2>
            <QuizRunner quiz={lesson.quiz} onPassed={() => setQuizPassed(true)} />
          </div>
        ) : lesson.nextLessonId ? (
          <Link href={`/student/learn/${courseSlug}/${lesson.nextLessonId}`}>
            <Button>Next Lesson</Button>
          </Link>
        ) : (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
            <CheckCircle2 className="mx-auto w-10 h-10 text-emerald-500" aria-hidden="true" />
            <p className="mt-3 font-bold text-[#0F172A]">
              You&apos;ve completed every lesson in this course.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
