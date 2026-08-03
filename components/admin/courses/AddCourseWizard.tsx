"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/admin/ui/button"
import { cn } from "@/lib/utils"
import { createCourse, createCourseCategory } from "@/actions/admin-courses"
import { courseDraftSchema } from "@/lib/validations/admin-course"
import { courseDraftReducer, initialDraft } from "@/components/admin/courses/course-draft-reducer"
import { CourseDetailsStep } from "@/components/admin/courses/CourseDetailsStep"
import { LessonsStep } from "@/components/admin/courses/LessonsStep"
import { ReviewStep } from "@/components/admin/courses/ReviewStep"
import type { CourseCategoryOption } from "@/types/course"

const STEPS = ["Course details", "Lessons & tests", "Review"] as const

export function AddCourseWizard({
  initialCategories,
}: {
  initialCategories: CourseCategoryOption[]
}) {
  const router = useRouter()
  const [step, setStep] = React.useState(0)
  const [draft, dispatch] = React.useReducer(courseDraftReducer, undefined, initialDraft)
  const [categories, setCategories] = React.useState(initialCategories)
  const [creatingCategory, setCreatingCategory] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  async function handleCreateCategory(name: string) {
    setCreatingCategory(true)
    try {
      const category = await createCourseCategory({ name })
      setCategories((prev) => [...prev, category])
      dispatch({ type: "SET_FIELD", field: "categoryIds", value: [...draft.categoryIds, category.id] })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category")
    } finally {
      setCreatingCategory(false)
    }
  }

  async function handleSubmit(isPublished: boolean) {
    setError(null)
    const payload = { ...draft, isPublished }
    const validated = courseDraftSchema.safeParse(payload)
    if (!validated.success) {
      setError(validated.error.issues[0]?.message ?? "Please check the form for errors")
      return
    }

    setSubmitting(true)
    try {
      await createCourse(validated.data)
      router.push("/admin/courses")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course")
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <ol className="flex items-center gap-2 text-sm">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(i)}
              disabled={i > step}
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {i + 1}
            </button>
            <span className={i === step ? "font-medium text-foreground" : "text-muted-foreground"}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-8 bg-border" />}
          </li>
        ))}
      </ol>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {step === 0 && (
        <CourseDetailsStep
          draft={draft}
          dispatch={dispatch}
          categories={categories}
          onCreateCategory={handleCreateCategory}
          creatingCategory={creatingCategory}
        />
      )}
      {step === 1 && <LessonsStep draft={draft} dispatch={dispatch} />}
      {step === 2 && <ReviewStep draft={draft} categories={categories} />}

      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)}>
            Continue
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" disabled={submitting} onClick={() => handleSubmit(false)}>
              Save as draft
            </Button>
            <Button type="button" disabled={submitting} onClick={() => handleSubmit(true)}>
              <CheckCircle2 /> Publish course
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
