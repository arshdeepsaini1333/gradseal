import type { Course, Testimonial, StatItem, Feature } from "@/types";

export const categoryEmojis: Record<string, string> = {
  "Personal Training": "🏋️",
  Nutrition: "🥗",
  Yoga: "🧘",
  Sports: "⚡",
  "Gym Training": "💪",
  "Physical Education": "🏃",
};

export const difficultyColors: Record<Course["difficulty"], string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

export const stats: StatItem[] = [
  { value: "12,000+", label: "Students" },
  { value: "100+", label: "Courses" },
  { value: "500+", label: "Certificates Issued" },
  { value: "95%", label: "Completion Rate" },
];

export const features: Feature[] = [
  {
    icon: "🏆",
    title: "Professional Certification",
    description:
      "Earn industry-recognized certificates that employers trust and respect.",
  },
  {
    icon: "👨‍🏫",
    title: "Expert Instructors",
    description:
      "Learn from certified professionals with decades of real-world experience.",
  },
  {
    icon: "⏱️",
    title: "Self-Paced Learning",
    description:
      "Study on your schedule. No deadlines, no pressure — just progress.",
  },
  {
    icon: "📝",
    title: "Online Assessments",
    description:
      "Test your knowledge with structured quizzes designed by experts.",
  },
  {
    icon: "♾️",
    title: "Lifetime Access",
    description:
      "Purchase once and revisit your course content forever, even after certifying.",
  },
  {
    icon: "🚀",
    title: "Career Support",
    description:
      "Get guidance, resources, and connections to launch your fitness career.",
  },
];

export const courses: Course[] = [
  {
    id: "1",
    slug: "certified-personal-trainer",
    title: "Certified Personal Trainer",
    description:
      "Master the science of strength and conditioning. Become a certified PT.",
    duration: "12 Weeks",
    difficulty: "Beginner",
    rating: 4.9,
    reviewCount: 1240,
    image: "/images/course-pt.jpg",
    category: "Personal Training",
    hasCertificate: true,
    purchaseCount: 3120,
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    slug: "nutrition-coach-certification",
    title: "Nutrition Coach Certification",
    description:
      "Evidence-based nutrition science to guide clients toward healthier lives.",
    duration: "8 Weeks",
    difficulty: "Intermediate",
    rating: 4.8,
    reviewCount: 876,
    image: "/images/course-nutrition.jpg",
    category: "Nutrition",
    hasCertificate: true,
    purchaseCount: 2210,
    createdAt: "2025-03-02",
  },
  {
    id: "3",
    slug: "yoga-instructor-200hr",
    title: "Yoga Instructor 200-Hour",
    description:
      "Complete 200-hour yoga teacher training covering asanas, pranayama & anatomy.",
    duration: "16 Weeks",
    difficulty: "Beginner",
    rating: 4.9,
    reviewCount: 654,
    image: "/images/course-yoga.jpg",
    category: "Yoga",
    hasCertificate: true,
    purchaseCount: 1780,
    createdAt: "2025-05-20",
  },
  {
    id: "4",
    slug: "sports-performance-specialist",
    title: "Sports Performance Specialist",
    description:
      "Advanced training protocols for athletes to maximize performance.",
    duration: "10 Weeks",
    difficulty: "Advanced",
    rating: 4.7,
    reviewCount: 432,
    image: "/images/course-sports.jpg",
    category: "Sports",
    hasCertificate: true,
    purchaseCount: 980,
    createdAt: "2026-06-10",
  },
  {
    id: "5",
    slug: "gym-trainer-professional",
    title: "Gym Trainer Professional",
    description:
      "Everything you need to confidently run gym sessions and train clients.",
    duration: "6 Weeks",
    difficulty: "Beginner",
    rating: 4.8,
    reviewCount: 987,
    image: "/images/course-gym.jpg",
    category: "Gym Training",
    hasCertificate: true,
    purchaseCount: 2540,
    createdAt: "2025-11-01",
  },
  {
    id: "6",
    slug: "physical-education-specialist",
    title: "Physical Education Specialist",
    description:
      "Comprehensive PE curriculum for teachers and school sports coaches.",
    duration: "10 Weeks",
    difficulty: "Intermediate",
    rating: 4.6,
    reviewCount: 312,
    image: "/images/course-pe.jpg",
    category: "Physical Education",
    hasCertificate: true,
    purchaseCount: 640,
    createdAt: "2026-06-28",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Certified Personal Trainer",
    avatar: "/images/avatar-1.jpg",
    rating: 5,
    review:
      "GradSeal completely changed my career. The PT course was detailed, practical, and the digital certificate opened doors I never expected. Highly recommended!",
    course: "Certified Personal Trainer",
  },
  {
    id: "2",
    name: "Rahul Mehta",
    role: "Sports Performance Coach",
    avatar: "/images/avatar-2.jpg",
    rating: 5,
    review:
      "The quality of instruction is exceptional. I studied at my own pace, passed the assessment, and got my certificate instantly. My clients are now more confident in my credentials.",
    course: "Sports Performance Specialist",
  },
  {
    id: "3",
    name: "Ananya Reddy",
    role: "Yoga Instructor & Nutritionist",
    avatar: "/images/avatar-3.jpg",
    rating: 5,
    review:
      "I completed two certifications on GradSeal — Yoga and Nutrition. The platform is clean, the content is world-class, and the certificates are easily shareable.",
    course: "Yoga Instructor 200-Hour",
  },
];
