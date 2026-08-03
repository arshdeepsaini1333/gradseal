"use client"

import * as React from "react"
import { Plus, ChevronsUpDown, X } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Textarea } from "@/components/admin/ui/textarea"
import { Label } from "@/components/admin/ui/label"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { Checkbox } from "@/components/admin/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select"
import { FileUploadField } from "@/components/admin/courses/FileUploadField"
import type { CourseDraft, CourseCategoryOption, CourseLevelValue } from "@/types/course"
import type { CourseDraftAction } from "@/components/admin/courses/course-draft-reducer"

interface CourseDetailsStepProps {
  draft: CourseDraft
  dispatch: React.Dispatch<CourseDraftAction>
  categories: CourseCategoryOption[]
  onCreateCategory: (name: string) => Promise<void>
  creatingCategory: boolean
}

function set<K extends keyof CourseDraft>(
  dispatch: React.Dispatch<CourseDraftAction>,
  field: K,
  value: CourseDraft[K]
) {
  dispatch({ type: "SET_FIELD", field, value })
}

export function CourseDetailsStep({
  draft,
  dispatch,
  categories,
  onCreateCategory,
  creatingCategory,
}: CourseDetailsStepProps) {
  const [newCategoryName, setNewCategoryName] = React.useState("")
  const [showNewCategory, setShowNewCategory] = React.useState(false)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Course details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={draft.title}
              onChange={(e) => set(dispatch, "title", e.target.value)}
              placeholder="e.g. Certified Personal Trainer"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="shortDescription">Short description</Label>
            <Input
              id="shortDescription"
              value={draft.shortDescription}
              onChange={(e) => set(dispatch, "shortDescription", e.target.value)}
              placeholder="One-line summary shown on course cards"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Full description</Label>
            <Textarea
              id="description"
              value={draft.description}
              onChange={(e) => set(dispatch, "description", e.target.value)}
              placeholder="What will students learn in this course?"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Categories</Label>
              {!showNewCategory ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" className="flex-1 justify-between font-normal">
                          <span className="truncate text-left">
                            {draft.categoryIds.length > 0
                              ? categories
                                  .filter((category) => draft.categoryIds.includes(category.id))
                                  .map((category) => category.name)
                                  .join(", ")
                              : "Select categories"}
                          </span>
                          <ChevronsUpDown className="shrink-0 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="max-h-64 overflow-y-auto">
                        {categories.map((category) => {
                          const checked = draft.categoryIds.includes(category.id)
                          return (
                            <DropdownMenuCheckboxItem
                              key={category.id}
                              checked={checked}
                              onSelect={(e) => e.preventDefault()}
                              onCheckedChange={(isChecked) =>
                                set(
                                  dispatch,
                                  "categoryIds",
                                  isChecked
                                    ? [...draft.categoryIds, category.id]
                                    : draft.categoryIds.filter((id) => id !== category.id)
                                )
                              }
                            >
                              {category.name}
                            </DropdownMenuCheckboxItem>
                          )
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowNewCategory(true)}
                      aria-label="Add new category"
                    >
                      <Plus />
                    </Button>
                  </div>
                  {draft.categoryIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {categories
                        .filter((category) => draft.categoryIds.includes(category.id))
                        .map((category) => (
                          <Badge key={category.id} variant="secondary" className="gap-1">
                            {category.name}
                            <button
                              type="button"
                              onClick={() =>
                                set(
                                  dispatch,
                                  "categoryIds",
                                  draft.categoryIds.filter((id) => id !== category.id)
                                )
                              }
                              aria-label={`Remove ${category.name}`}
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                  />
                  <Button
                    type="button"
                    disabled={!newCategoryName.trim() || creatingCategory}
                    onClick={async () => {
                      await onCreateCategory(newCategoryName.trim())
                      setNewCategoryName("")
                      setShowNewCategory(false)
                    }}
                  >
                    Add
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowNewCategory(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Level</Label>
              <Select
                value={draft.level}
                onValueChange={(value) => set(dispatch, "level", value as CourseLevelValue)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={draft.language}
                onChange={(e) => set(dispatch, "language", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="duration">Duration label</Label>
              <Input
                id="duration"
                value={draft.duration}
                onChange={(e) => set(dispatch, "duration", e.target.value)}
                placeholder="e.g. 6 weeks"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={draft.price}
                onChange={(e) => set(dispatch, "price", Number(e.target.value))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="discountedPrice">Discounted price (₹, optional)</Label>
              <Input
                id="discountedPrice"
                type="number"
                min={0}
                value={draft.discountedPrice ?? ""}
                onChange={(e) =>
                  set(dispatch, "discountedPrice", e.target.value === "" ? undefined : Number(e.target.value))
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isFeatured"
              checked={draft.isFeatured}
              onCheckedChange={(checked) => set(dispatch, "isFeatured", checked === true)}
            />
            <Label htmlFor="isFeatured" className="font-normal">
              Feature this course on the catalog page
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Thumbnail image</Label>
            <FileUploadField
              kind="thumbnail"
              accept="image/jpeg,image/png,image/webp"
              media="image"
              maxSizeMB={5}
              urls={draft.thumbnail ? [draft.thumbnail] : []}
              onChange={(urls) => set(dispatch, "thumbnail", urls[0] ?? "")}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Preview video (optional)</Label>
            <FileUploadField
              kind="preview-video"
              accept="video/mp4,video/webm,video/quicktime"
              media="video"
              maxSizeMB={500}
              urls={draft.previewVideo ? [draft.previewVideo] : []}
              onChange={(urls) => set(dispatch, "previewVideo", urls[0])}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
