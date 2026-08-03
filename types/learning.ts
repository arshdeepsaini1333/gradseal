export interface LearnerLesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  images: string[];
  duration: number;
  position: number;
  isFree: boolean;
  moduleId: string;
  locked: boolean;
  completed: boolean;
  scrollPercent: number;
  hasQuiz: boolean;
  quizPassed: boolean;
  test: {
    id: string;
    title: string;
    passingScore: number;
    questionCount: number;
  } | null;
}

export interface LearnerModule {
  id: string;
  title: string;
  position: number;
  lessons: LearnerLesson[];
}

export interface LearnerCourse {
  id: string;
  slug: string;
  title: string;
  modules: LearnerModule[];
  progressPercent: number;
  completed: boolean;
  resumeLessonId: string | null;
}

export interface QuizOptionForClient {
  id: string;
  text: string;
  position: number;
}

export interface QuizQuestionForClient {
  id: string;
  text: string;
  position: number;
  options: QuizOptionForClient[];
}

export interface QuizForClient {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestionForClient[];
}

export interface LearnerLessonDetail extends LearnerLesson {
  moduleTitle: string;
  quiz: QuizForClient | null;
  nextLessonId: string | null;
}

export interface QuizResult {
  score: number;
  passed: boolean;
  passingScore: number;
}
