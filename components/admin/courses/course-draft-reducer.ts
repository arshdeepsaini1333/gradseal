import type { CourseDraft, LessonDraft, QuestionDraft } from "@/types/course"

export function emptyQuestion(): QuestionDraft {
  return {
    text: "",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
    ],
  }
}

export function emptyLesson(): LessonDraft {
  return {
    title: "",
    description: "",
    videoUrl: undefined,
    images: [],
    duration: 10,
    isFree: false,
    test: { passingScore: 70, questions: [emptyQuestion()] },
  }
}

export function initialDraft(): CourseDraft {
  return {
    title: "",
    shortDescription: "",
    description: "",
    thumbnail: "",
    previewVideo: undefined,
    price: 0,
    discountedPrice: undefined,
    duration: "",
    language: "English",
    level: "BEGINNER",
    categoryIds: [],
    isFeatured: false,
    isPublished: false,
    lessons: [],
  }
}

export type CourseDraftAction =
  | { type: "SET_FIELD"; field: keyof CourseDraft; value: unknown }
  | { type: "SET_LESSON_COUNT"; count: number }
  | { type: "UPDATE_LESSON"; index: number; patch: Partial<LessonDraft> }
  | { type: "ADD_QUESTION"; lessonIndex: number }
  | { type: "REMOVE_QUESTION"; lessonIndex: number; questionIndex: number }
  | { type: "UPDATE_QUESTION"; lessonIndex: number; questionIndex: number; text: string }
  | { type: "SET_PASSING_SCORE"; lessonIndex: number; score: number }
  | { type: "ADD_OPTION"; lessonIndex: number; questionIndex: number }
  | { type: "REMOVE_OPTION"; lessonIndex: number; questionIndex: number; optionIndex: number }
  | { type: "UPDATE_OPTION_TEXT"; lessonIndex: number; questionIndex: number; optionIndex: number; text: string }
  | { type: "SET_CORRECT_OPTION"; lessonIndex: number; questionIndex: number; optionIndex: number }

export function courseDraftReducer(state: CourseDraft, action: CourseDraftAction): CourseDraft {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }

    case "SET_LESSON_COUNT": {
      const count = Math.max(0, action.count)
      const lessons = [...state.lessons]
      if (count > lessons.length) {
        while (lessons.length < count) lessons.push(emptyLesson())
      } else {
        lessons.length = count
      }
      return { ...state, lessons }
    }

    case "UPDATE_LESSON": {
      const lessons = state.lessons.map((lesson, i) =>
        i === action.index ? { ...lesson, ...action.patch } : lesson
      )
      return { ...state, lessons }
    }

    case "ADD_QUESTION": {
      const lessons = state.lessons.map((lesson, i) =>
        i === action.lessonIndex
          ? { ...lesson, test: { ...lesson.test, questions: [...lesson.test.questions, emptyQuestion()] } }
          : lesson
      )
      return { ...state, lessons }
    }

    case "REMOVE_QUESTION": {
      const lessons = state.lessons.map((lesson, i) =>
        i === action.lessonIndex
          ? {
              ...lesson,
              test: {
                ...lesson.test,
                questions: lesson.test.questions.filter((_, qi) => qi !== action.questionIndex),
              },
            }
          : lesson
      )
      return { ...state, lessons }
    }

    case "UPDATE_QUESTION": {
      const lessons = state.lessons.map((lesson, i) =>
        i === action.lessonIndex
          ? {
              ...lesson,
              test: {
                ...lesson.test,
                questions: lesson.test.questions.map((q, qi) =>
                  qi === action.questionIndex ? { ...q, text: action.text } : q
                ),
              },
            }
          : lesson
      )
      return { ...state, lessons }
    }

    case "SET_PASSING_SCORE": {
      const lessons = state.lessons.map((lesson, i) =>
        i === action.lessonIndex
          ? { ...lesson, test: { ...lesson.test, passingScore: action.score } }
          : lesson
      )
      return { ...state, lessons }
    }

    case "ADD_OPTION": {
      const lessons = state.lessons.map((lesson, i) =>
        i === action.lessonIndex
          ? {
              ...lesson,
              test: {
                ...lesson.test,
                questions: lesson.test.questions.map((q, qi) =>
                  qi === action.questionIndex
                    ? { ...q, options: [...q.options, { text: "", isCorrect: false }] }
                    : q
                ),
              },
            }
          : lesson
      )
      return { ...state, lessons }
    }

    case "REMOVE_OPTION": {
      const lessons = state.lessons.map((lesson, i) =>
        i === action.lessonIndex
          ? {
              ...lesson,
              test: {
                ...lesson.test,
                questions: lesson.test.questions.map((q, qi) =>
                  qi === action.questionIndex
                    ? { ...q, options: q.options.filter((_, oi) => oi !== action.optionIndex) }
                    : q
                ),
              },
            }
          : lesson
      )
      return { ...state, lessons }
    }

    case "UPDATE_OPTION_TEXT": {
      const lessons = state.lessons.map((lesson, i) =>
        i === action.lessonIndex
          ? {
              ...lesson,
              test: {
                ...lesson.test,
                questions: lesson.test.questions.map((q, qi) =>
                  qi === action.questionIndex
                    ? {
                        ...q,
                        options: q.options.map((o, oi) =>
                          oi === action.optionIndex ? { ...o, text: action.text } : o
                        ),
                      }
                    : q
                ),
              },
            }
          : lesson
      )
      return { ...state, lessons }
    }

    case "SET_CORRECT_OPTION": {
      const lessons = state.lessons.map((lesson, i) =>
        i === action.lessonIndex
          ? {
              ...lesson,
              test: {
                ...lesson.test,
                questions: lesson.test.questions.map((q, qi) =>
                  qi === action.questionIndex
                    ? { ...q, options: q.options.map((o, oi) => ({ ...o, isCorrect: oi === action.optionIndex })) }
                    : q
                ),
              },
            }
          : lesson
      )
      return { ...state, lessons }
    }

    default:
      return state
  }
}
