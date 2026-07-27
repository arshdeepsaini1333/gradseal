// Types for the Courses catalog page. Kept separate from `types/index.ts`
// (the simpler `Course` used on the homepage) so the richer marketplace-style
// shape here can evolve independently until it's backed by a real API.

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Instructor {
  id: string;
  name: string;
  title: string;
  initials: string;
  color: string;
  rating: number;
  studentsCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  gradient: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  instructorId: string;
  level: CourseLevel;
  rating: number;
  reviewCount: number;
  studentsEnrolled: number;
  duration: string;
  durationWeeks: number;
  lessons: number;
  hasCertificate: boolean;
  bestseller?: boolean;
  language: string;
  price: number;
  originalPrice: number;
  icon: string;
  gradient: string;
  createdAt: string;
  demoProgress?: number;
}

export interface LearningPathStep {
  title: string;
  description: string;
}

export interface LearningPath {
  id: string;
  title: string;
  icon: string;
  gradient: string;
  totalDuration: string;
  steps: LearningPathStep[];
}

export interface ComparisonTrack {
  id: string;
  name: string;
  icon: string;
}

export interface ComparisonRow {
  feature: string;
  values: string[];
  highlightBest?: number;
}
