"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Textarea } from "@/components/admin/ui/textarea"
import { Label } from "@/components/admin/ui/label"
import { Button } from "@/components/admin/ui/button"
import { Checkbox } from "@/components/admin/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/admin/ui/radio-group"
import { Badge } from "@/components/admin/ui/badge"
import { FileUploadField } from "@/components/admin/courses/FileUploadField"
import type { CourseDraft } from "@/types/course"
import type { CourseDraftAction } from "@/components/admin/courses/course-draft-reducer"

interface LessonsStepProps {
  draft: CourseDraft
  dispatch: React.Dispatch<CourseDraftAction>
}

export function LessonsStep({ draft, dispatch }: LessonsStepProps) {
  const [lessonCountInput, setLessonCountInput] = React.useState(String(draft.lessons.length || ""))

  function applyLessonCount() {
    const count = Math.min(50, Math.max(0, parseInt(lessonCountInput, 10) || 0))
    dispatch({ type: "SET_LESSON_COUNT", count })
    setLessonCountInput(String(count))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>How many lessons does this course have?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="lessonCount">Number of lessons</Label>
              <Input
                id="lessonCount"
                type="number"
                min={0}
                max={50}
                className="w-32"
                value={lessonCountInput}
                onChange={(e) => setLessonCountInput(e.target.value)}
              />
            </div>
            <Button type="button" variant="outline" onClick={applyLessonCount}>
              {draft.lessons.length > 0 ? "Update lessons" : "Generate lessons"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Reducing the count removes the last lessons in the list below. Each lesson gets its own
            video, optional images/text, and one test.
          </p>
        </CardContent>
      </Card>

      {draft.lessons.map((lesson, lessonIndex) => (
        <LessonEditor
          key={lessonIndex}
          lesson={lesson}
          lessonIndex={lessonIndex}
          dispatch={dispatch}
        />
      ))}
    </div>
  )
}

function LessonEditor({
  lesson,
  lessonIndex,
  dispatch,
}: {
  lesson: CourseDraft["lessons"][number]
  lessonIndex: number
  dispatch: React.Dispatch<CourseDraftAction>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Lesson {lessonIndex + 1}
          {lesson.title && <span className="font-normal text-muted-foreground">— {lesson.title}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Lesson title</Label>
            <Input
              value={lesson.title}
              onChange={(e) =>
                dispatch({ type: "UPDATE_LESSON", index: lessonIndex, patch: { title: e.target.value } })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              min={1}
              value={lesson.duration}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_LESSON",
                  index: lessonIndex,
                  patch: { duration: Number(e.target.value) },
                })
              }
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Text content (notes, article, description)</Label>
          <Textarea
            rows={3}
            value={lesson.description ?? ""}
            onChange={(e) =>
              dispatch({ type: "UPDATE_LESSON", index: lessonIndex, patch: { description: e.target.value } })
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id={`isFree-${lessonIndex}`}
            checked={lesson.isFree}
            onCheckedChange={(checked) =>
              dispatch({ type: "UPDATE_LESSON", index: lessonIndex, patch: { isFree: checked === true } })
            }
          />
          <Label htmlFor={`isFree-${lessonIndex}`} className="font-normal">
            Free preview lesson
          </Label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Lesson video (optional)</Label>
            <FileUploadField
              kind="lesson-video"
              accept="video/mp4,video/webm,video/quicktime"
              media="video"
              maxSizeMB={500}
              urls={lesson.videoUrl ? [lesson.videoUrl] : []}
              onChange={(urls) =>
                dispatch({ type: "UPDATE_LESSON", index: lessonIndex, patch: { videoUrl: urls[0] } })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Images (optional)</Label>
            <FileUploadField
              kind="lesson-image"
              accept="image/jpeg,image/png,image/webp"
              media="image"
              multiple
              maxSizeMB={5}
              urls={lesson.images}
              onChange={(urls) => dispatch({ type: "UPDATE_LESSON", index: lessonIndex, patch: { images: urls } })}
            />
          </div>
        </div>

        <TestEditor lesson={lesson} lessonIndex={lessonIndex} dispatch={dispatch} />
      </CardContent>
    </Card>
  )
}

function TestEditor({
  lesson,
  lessonIndex,
  dispatch,
}: {
  lesson: CourseDraft["lessons"][number]
  lessonIndex: number
  dispatch: React.Dispatch<CourseDraftAction>
}) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="mb-3 flex items-center justify-between">
        <Badge variant="secondary">Lesson test</Badge>
        <div className="flex items-center gap-1.5">
          <Label htmlFor={`passing-${lessonIndex}`} className="font-normal text-muted-foreground">
            Passing score %
          </Label>
          <Input
            id={`passing-${lessonIndex}`}
            type="number"
            min={1}
            max={100}
            className="w-20"
            value={lesson.test.passingScore}
            onChange={(e) =>
              dispatch({ type: "SET_PASSING_SCORE", lessonIndex, score: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="space-y-3">
        {lesson.test.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="rounded-lg bg-muted/40 p-3">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <Input
                  value={question.text}
                  placeholder={`Question ${questionIndex + 1}`}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_QUESTION",
                      lessonIndex,
                      questionIndex,
                      text: e.target.value,
                    })
                  }
                />

                <RadioGroup
                  value={String(question.options.findIndex((o) => o.isCorrect))}
                  onValueChange={(value) =>
                    dispatch({
                      type: "SET_CORRECT_OPTION",
                      lessonIndex,
                      questionIndex,
                      optionIndex: Number(value),
                    })
                  }
                  className="gap-1.5"
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={String(optionIndex)}
                        id={`opt-${lessonIndex}-${questionIndex}-${optionIndex}`}
                      />
                      <Input
                        value={option.text}
                        placeholder={`Option ${optionIndex + 1}`}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_OPTION_TEXT",
                            lessonIndex,
                            questionIndex,
                            optionIndex,
                            text: e.target.value,
                          })
                        }
                      />
                      {question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Remove option"
                          onClick={() =>
                            dispatch({ type: "REMOVE_OPTION", lessonIndex, questionIndex, optionIndex })
                          }
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {question.options.length < 6 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch({ type: "ADD_OPTION", lessonIndex, questionIndex })}
                  >
                    <Plus /> Add option
                  </Button>
                )}
              </div>

              {lesson.test.questions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove question"
                  onClick={() => dispatch({ type: "REMOVE_QUESTION", lessonIndex, questionIndex })}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={() => dispatch({ type: "ADD_QUESTION", lessonIndex })}
      >
        <Plus /> Add question
      </Button>
    </div>
  )
}
