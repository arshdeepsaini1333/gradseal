"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, Lock, Menu, X } from "lucide-react";
import type { LearnerCourse } from "@/types/learning";

interface LearnSidebarProps {
  course: LearnerCourse;
  currentLessonId: string;
}

export default function LearnSidebar({ course, currentLessonId }: LearnSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-40 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#0F172A] shadow-sm"
        aria-label="Open course menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside className="hidden lg:block w-80 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-slate-100">
        <SidebarContent course={course} currentLessonId={currentLessonId} />
      </aside>

      <AnimatePresence>
        {open && (
          <div className="lg:hidden">
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-white shadow-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="flex justify-end p-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close course menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent
                course={course}
                currentLessonId={currentLessonId}
                onNavigate={() => setOpen(false)}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({
  course,
  currentLessonId,
  onNavigate,
}: {
  course: LearnerCourse;
  currentLessonId: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="p-5">
      <h2 className="font-extrabold text-[#0F172A] leading-snug">{course.title}</h2>
      <div className="mt-3">
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#2563EB] transition-all"
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs font-semibold text-[#64748B]">
          {course.progressPercent}% Complete
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {course.modules.map((mod, modIndex) => (
          <div key={mod.id}>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#94A3B8]">
              Module {modIndex + 1} &middot; {mod.title}
            </p>
            <ul className="space-y-1">
              {mod.lessons.map((lesson) =>
                lesson.locked ? (
                  <li key={lesson.id}>
                    <span
                      className="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#94A3B8]"
                      aria-disabled="true"
                    >
                      <Lock className="w-4 h-4 flex-shrink-0" />
                      {lesson.title}
                    </span>
                  </li>
                ) : (
                  <li key={lesson.id}>
                    <Link
                      href={`/student/learn/${course.slug}/${lesson.id}`}
                      onClick={onNavigate}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        lesson.id === currentLessonId
                          ? "bg-blue-50 text-[#2563EB]"
                          : "text-[#334155] hover:bg-slate-50"
                      }`}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 flex-shrink-0 text-slate-300" />
                      )}
                      <span className="flex-1">{lesson.title}</span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
