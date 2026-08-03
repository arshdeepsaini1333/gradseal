"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Badge } from "@/components/admin/ui/badge"
import type { CourseDraft, CourseCategoryOption } from "@/types/course"

interface ReviewStepProps {
  draft: CourseDraft
  categories: CourseCategoryOption[]
}

export function ReviewStep({ draft, categories }: ReviewStepProps) {
  const selectedCategories = categories.filter((c) => draft.categoryIds.includes(c.id))
  const totalQuestions = draft.lessons.reduce((sum, l) => sum + l.test.questions.length, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium text-foreground">{draft.title || "Untitled course"}</span>
          {selectedCategories.length > 0 ? (
            selectedCategories.map((category) => (
              <Badge key={category.id} variant="outline">
                {category.name}
              </Badge>
            ))
          ) : (
            <Badge variant="outline">—</Badge>
          )}
          <Badge variant="outline">{draft.level}</Badge>
        </div>
        <p className="text-muted-foreground">{draft.shortDescription}</p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-muted-foreground sm:grid-cols-3">
          <li>Lessons: {draft.lessons.length}</li>
          <li>Questions: {totalQuestions}</li>
          <li>Price: ₹{draft.price}</li>
          <li>Language: {draft.language}</li>
          <li>Duration: {draft.duration || "—"}</li>
          <li>Featured: {draft.isFeatured ? "Yes" : "No"}</li>
        </ul>
      </CardContent>
    </Card>
  )
}
