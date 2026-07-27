// Placeholder course-catalog data for the /courses marketplace page.
// Swap this module for real API calls later — every section on the page
// consumes the exported arrays/helpers below, not this file's internals.

import type {
  Category,
  ComparisonRow,
  ComparisonTrack,
  Course,
  Instructor,
  LearningPath,
} from "@/types/course-catalog";

export const instructors: Instructor[] = [
  { id: "priya-sharma", name: "Priya Sharma", title: "NASM-CPT, Personal Trainer", initials: "PS", color: "#2563EB", rating: 4.9, studentsCount: 8400 },
  { id: "rahul-mehta", name: "Rahul Mehta", title: "Sports Performance Coach", initials: "RM", color: "#7C3AED", rating: 4.8, studentsCount: 5200 },
  { id: "ananya-reddy", name: "Ananya Reddy", title: "RYT-500 Yoga & Wellness Expert", initials: "AR", color: "#059669", rating: 4.9, studentsCount: 6100 },
  { id: "karan-verma", name: "Karan Verma", title: "Registered Dietitian, Nutrition Coach", initials: "KV", color: "#DB2777", rating: 4.7, studentsCount: 4300 },
  { id: "vikram-nair", name: "Vikram Nair", title: "Head Strength & Conditioning Coach", initials: "VN", color: "#EA580C", rating: 4.8, studentsCount: 5900 },
  { id: "sneha-kapoor", name: "Sneha Kapoor", title: "Group Fitness Director", initials: "SK", color: "#0891B2", rating: 4.7, studentsCount: 3800 },
  { id: "arjun-malhotra", name: "Arjun Malhotra", title: "Sports Rehabilitation Specialist", initials: "AM", color: "#4F46E5", rating: 4.8, studentsCount: 2900 },
  { id: "meera-iyer", name: "Meera Iyer", title: "Women's Fitness Specialist", initials: "MI", color: "#DC2626", rating: 4.9, studentsCount: 4700 },
  { id: "rohan-desai", name: "Rohan Desai", title: "Fitness Business Consultant", initials: "RD", color: "#65A30D", rating: 4.6, studentsCount: 2100 },
];

export function getInstructor(id: string): Instructor {
  return instructors.find((i) => i.id === id) ?? instructors[0];
}

export const categories: Category[] = [
  { id: "gym-training", name: "Gym Training", icon: "🏋️", description: "Strength equipment, form, and safe programming.", gradient: "from-blue-500 to-cyan-400" },
  { id: "personal-training", name: "Personal Training", icon: "💪", description: "Client programs, assessments, and 1-on-1 coaching.", gradient: "from-cyan-500 to-blue-500" },
  { id: "yoga", name: "Yoga", icon: "🧘", description: "Asanas, pranayama, and certified teacher training.", gradient: "from-indigo-500 to-blue-400" },
  { id: "nutrition", name: "Nutrition", icon: "🥗", description: "Evidence-based diet science for lasting results.", gradient: "from-emerald-500 to-teal-400" },
  { id: "wellness", name: "Wellness", icon: "❤️", description: "Holistic coaching for recovery and lifestyle balance.", gradient: "from-rose-500 to-pink-400" },
  { id: "functional-fitness", name: "Functional Fitness", icon: "🏃", description: "Movement-based training for real-world strength.", gradient: "from-orange-500 to-amber-400" },
  { id: "strength-conditioning", name: "Strength & Conditioning", icon: "⚡", description: "Periodization and performance programming.", gradient: "from-violet-500 to-purple-400" },
  { id: "sports-science", name: "Sports Science", icon: "🏅", description: "Physiology and biomechanics for peak performance.", gradient: "from-sky-500 to-indigo-400" },
];

export function getCategory(name: string): Category | undefined {
  return categories.find((c) => c.name === name);
}

export const LANGUAGES = ["English", "Hindi", "English, Hindi"] as const;

export const mockCourses: Course[] = [
  {
    id: "1", slug: "certified-personal-trainer", title: "Certified Personal Trainer",
    description: "Master the science of strength and conditioning and become a certified PT ready to train real clients.",
    category: "Personal Training", instructorId: "priya-sharma", level: "Beginner",
    rating: 4.9, reviewCount: 1240, studentsEnrolled: 5120, duration: "12 Weeks", durationWeeks: 12,
    lessons: 68, hasCertificate: true, bestseller: true, language: "English",
    price: 7999, originalPrice: 12999, icon: "💪", gradient: "from-cyan-500 to-blue-500",
    createdAt: "2026-01-15", demoProgress: 62,
  },
  {
    id: "2", slug: "advanced-gym-instructor", title: "Advanced Gym Instructor",
    description: "Deepen your equipment expertise and learn advanced programming for serious strength trainees.",
    category: "Gym Training", instructorId: "vikram-nair", level: "Advanced",
    rating: 4.8, reviewCount: 640, studentsEnrolled: 2430, duration: "10 Weeks", durationWeeks: 10,
    lessons: 54, hasCertificate: true, language: "English",
    price: 6499, originalPrice: 9999, icon: "🏋️", gradient: "from-blue-500 to-cyan-400",
    createdAt: "2025-11-02", demoProgress: 35,
  },
  {
    id: "3", slug: "professional-yoga-instructor", title: "Professional Yoga Instructor",
    description: "Complete 200-hour style yoga teacher training covering asanas, pranayama, and anatomy.",
    category: "Yoga", instructorId: "ananya-reddy", level: "Intermediate",
    rating: 4.9, reviewCount: 980, studentsEnrolled: 3760, duration: "16 Weeks", durationWeeks: 16,
    lessons: 82, hasCertificate: true, bestseller: true, language: "English, Hindi",
    price: 8999, originalPrice: 13999, icon: "🧘", gradient: "from-indigo-500 to-blue-400",
    createdAt: "2025-09-20", demoProgress: 80,
  },
  {
    id: "4", slug: "sports-nutrition-fundamentals", title: "Sports Nutrition Fundamentals",
    description: "Evidence-based nutrition science to fuel athletic performance and guide client meal plans.",
    category: "Nutrition", instructorId: "karan-verma", level: "Beginner",
    rating: 4.7, reviewCount: 512, studentsEnrolled: 2180, duration: "8 Weeks", durationWeeks: 8,
    lessons: 40, hasCertificate: true, language: "English",
    price: 4999, originalPrice: 7999, icon: "🥗", gradient: "from-emerald-500 to-teal-400",
    createdAt: "2026-02-10", demoProgress: 15,
  },
  {
    id: "5", slug: "functional-fitness-coach", title: "Functional Fitness Coach",
    description: "Movement-first training methodology that builds real-world strength and mobility for clients.",
    category: "Functional Fitness", instructorId: "sneha-kapoor", level: "Intermediate",
    rating: 4.7, reviewCount: 356, studentsEnrolled: 1540, duration: "9 Weeks", durationWeeks: 9,
    lessons: 46, hasCertificate: true, language: "English",
    price: 5999, originalPrice: 8999, icon: "🏃", gradient: "from-orange-500 to-amber-400",
    createdAt: "2025-12-05", demoProgress: 48,
  },
  {
    id: "6", slug: "strength-conditioning-specialist", title: "Strength & Conditioning Specialist",
    description: "Periodization, athletic programming, and performance testing for competitive athletes.",
    category: "Strength & Conditioning", instructorId: "vikram-nair", level: "Advanced",
    rating: 4.8, reviewCount: 720, studentsEnrolled: 2860, duration: "14 Weeks", durationWeeks: 14,
    lessons: 74, hasCertificate: true, bestseller: true, language: "English",
    price: 9499, originalPrice: 14999, icon: "⚡", gradient: "from-violet-500 to-purple-400",
    createdAt: "2025-08-18", demoProgress: 91,
  },
  {
    id: "7", slug: "weight-management-coach", title: "Weight Management Coach",
    description: "Behavior-change coaching and nutrition strategy for sustainable, long-term weight goals.",
    category: "Nutrition", instructorId: "karan-verma", level: "Beginner",
    rating: 4.6, reviewCount: 298, studentsEnrolled: 1320, duration: "6 Weeks", durationWeeks: 6,
    lessons: 32, hasCertificate: true, language: "English",
    price: 3999, originalPrice: 6499, icon: "🥗", gradient: "from-emerald-500 to-teal-400",
    createdAt: "2026-03-01", demoProgress: 5,
  },
  {
    id: "8", slug: "group-fitness-instructor", title: "Group Fitness Instructor",
    description: "Design and lead high-energy group classes with confidence, music, and crowd coaching cues.",
    category: "Wellness", instructorId: "sneha-kapoor", level: "Beginner",
    rating: 4.7, reviewCount: 410, studentsEnrolled: 1980, duration: "7 Weeks", durationWeeks: 7,
    lessons: 36, hasCertificate: true, language: "English",
    price: 4499, originalPrice: 6999, icon: "❤️", gradient: "from-rose-500 to-pink-400",
    createdAt: "2025-10-14", demoProgress: 22,
  },
  {
    id: "9", slug: "womens-fitness-specialist", title: "Women's Fitness Specialist",
    description: "Specialized training protocols across hormonal cycles, pregnancy, and postpartum recovery.",
    category: "Wellness", instructorId: "meera-iyer", level: "Intermediate",
    rating: 4.9, reviewCount: 588, studentsEnrolled: 2340, duration: "10 Weeks", durationWeeks: 10,
    lessons: 52, hasCertificate: true, bestseller: true, language: "English",
    price: 6999, originalPrice: 10999, icon: "❤️", gradient: "from-rose-500 to-pink-400",
    createdAt: "2026-01-28", demoProgress: 68,
  },
  {
    id: "10", slug: "senior-fitness-trainer", title: "Senior Fitness Trainer",
    description: "Safe, effective programming for older adults focused on balance, mobility, and longevity.",
    category: "Wellness", instructorId: "meera-iyer", level: "Beginner",
    rating: 4.8, reviewCount: 264, studentsEnrolled: 980, duration: "6 Weeks", durationWeeks: 6,
    lessons: 30, hasCertificate: true, language: "English",
    price: 3999, originalPrice: 5999, icon: "❤️", gradient: "from-rose-500 to-pink-400",
    createdAt: "2025-07-09", demoProgress: 100,
  },
  {
    id: "11", slug: "sports-rehabilitation-basics", title: "Sports Rehabilitation Basics",
    description: "Injury recovery fundamentals, corrective exercise, and return-to-play protocols.",
    category: "Sports Science", instructorId: "arjun-malhotra", level: "Intermediate",
    rating: 4.8, reviewCount: 342, studentsEnrolled: 1160, duration: "9 Weeks", durationWeeks: 9,
    lessons: 48, hasCertificate: true, language: "English",
    price: 6499, originalPrice: 9999, icon: "🏅", gradient: "from-sky-500 to-indigo-400",
    createdAt: "2025-11-27", demoProgress: 40,
  },
  {
    id: "12", slug: "fitness-business-essentials", title: "Fitness Business Essentials",
    description: "Client acquisition, pricing, and studio operations for trainers going independent.",
    category: "Personal Training", instructorId: "rohan-desai", level: "Beginner",
    rating: 4.6, reviewCount: 186, studentsEnrolled: 760, duration: "5 Weeks", durationWeeks: 5,
    lessons: 26, hasCertificate: true, language: "English",
    price: 3499, originalPrice: 5499, icon: "💪", gradient: "from-cyan-500 to-blue-500",
    createdAt: "2026-02-22", demoProgress: 0,
  },
  {
    id: "13", slug: "yoga-for-beginners", title: "Yoga for Beginners",
    description: "A gentle, structured introduction to yoga fundamentals, breathwork, and foundational poses.",
    category: "Yoga", instructorId: "ananya-reddy", level: "Beginner",
    rating: 4.8, reviewCount: 890, studentsEnrolled: 4120, duration: "4 Weeks", durationWeeks: 4,
    lessons: 20, hasCertificate: true, language: "English, Hindi",
    price: 1999, originalPrice: 3499, icon: "🧘", gradient: "from-indigo-500 to-blue-400",
    createdAt: "2026-03-10", demoProgress: 0,
  },
  {
    id: "14", slug: "prenatal-postnatal-fitness-coach", title: "Prenatal & Postnatal Fitness Coach",
    description: "Trimester-safe programming and postpartum recovery training for expecting and new mothers.",
    category: "Wellness", instructorId: "meera-iyer", level: "Intermediate",
    rating: 4.9, reviewCount: 214, studentsEnrolled: 690, duration: "8 Weeks", durationWeeks: 8,
    lessons: 38, hasCertificate: true, language: "English",
    price: 5499, originalPrice: 8499, icon: "❤️", gradient: "from-rose-500 to-pink-400",
    createdAt: "2025-12-30", demoProgress: 12,
  },
  {
    id: "15", slug: "injury-prevention-specialist", title: "Injury Prevention Specialist",
    description: "Movement screening and corrective strategies to keep athletes and gym-goers training injury-free.",
    category: "Sports Science", instructorId: "arjun-malhotra", level: "Advanced",
    rating: 4.7, reviewCount: 176, studentsEnrolled: 540, duration: "11 Weeks", durationWeeks: 11,
    lessons: 58, hasCertificate: true, language: "English",
    price: 7499, originalPrice: 11499, icon: "🏅", gradient: "from-sky-500 to-indigo-400",
    createdAt: "2025-09-05", demoProgress: 55,
  },
  {
    id: "16", slug: "online-personal-training-mastery", title: "Online Personal Training Mastery",
    description: "Coach clients remotely with app-based programming, video form checks, and habit accountability.",
    category: "Personal Training", instructorId: "priya-sharma", level: "Intermediate",
    rating: 4.8, reviewCount: 462, studentsEnrolled: 1870, duration: "7 Weeks", durationWeeks: 7,
    lessons: 34, hasCertificate: true, bestseller: true, language: "English",
    price: 5999, originalPrice: 8999, icon: "💪", gradient: "from-cyan-500 to-blue-500",
    createdAt: "2026-01-06", demoProgress: 30,
  },
  {
    id: "17", slug: "metabolic-conditioning-coach", title: "Metabolic Conditioning Coach",
    description: "High-intensity interval programming for fat loss, conditioning, and athletic engine-building.",
    category: "Functional Fitness", instructorId: "sneha-kapoor", level: "Intermediate",
    rating: 4.6, reviewCount: 228, studentsEnrolled: 890, duration: "6 Weeks", durationWeeks: 6,
    lessons: 30, hasCertificate: true, language: "English",
    price: 4499, originalPrice: 6999, icon: "🏃", gradient: "from-orange-500 to-amber-400",
    createdAt: "2025-10-30", demoProgress: 0,
  },
  {
    id: "18", slug: "kids-youth-fitness-instructor", title: "Kids & Youth Fitness Instructor",
    description: "Age-appropriate movement, games, and safe strength introduction for young athletes.",
    category: "Gym Training", instructorId: "vikram-nair", level: "Beginner",
    rating: 4.7, reviewCount: 154, studentsEnrolled: 610, duration: "5 Weeks", durationWeeks: 5,
    lessons: 24, hasCertificate: true, language: "English",
    price: 3499, originalPrice: 5499, icon: "🏋️", gradient: "from-blue-500 to-cyan-400",
    createdAt: "2025-08-22", demoProgress: 0,
  },
  {
    id: "19", slug: "boxing-combat-fitness-coach", title: "Boxing & Combat Fitness Coach",
    description: "Pad work, combinations, and combat-conditioning circuits for fitness-focused boxing classes.",
    category: "Functional Fitness", instructorId: "rahul-mehta", level: "Intermediate",
    rating: 4.8, reviewCount: 302, studentsEnrolled: 1240, duration: "8 Weeks", durationWeeks: 8,
    lessons: 40, hasCertificate: true, language: "English",
    price: 5499, originalPrice: 8499, icon: "🏃", gradient: "from-orange-500 to-amber-400",
    createdAt: "2026-02-14", demoProgress: 18,
  },
  {
    id: "20", slug: "pilates-instructor-certification", title: "Pilates Instructor Certification",
    description: "Mat Pilates fundamentals, core sequencing, and cueing for beginner-to-intermediate classes.",
    category: "Yoga", instructorId: "ananya-reddy", level: "Beginner",
    rating: 4.8, reviewCount: 336, studentsEnrolled: 1420, duration: "6 Weeks", durationWeeks: 6,
    lessons: 28, hasCertificate: true, language: "English",
    price: 3999, originalPrice: 6499, icon: "🧘", gradient: "from-indigo-500 to-blue-400",
    createdAt: "2025-11-19", demoProgress: 44,
  },
  {
    id: "21", slug: "sports-psychology-for-coaches", title: "Sports Psychology for Coaches",
    description: "Motivation, focus, and mental resilience techniques coaches can apply with athletes.",
    category: "Sports Science", instructorId: "rahul-mehta", level: "Advanced",
    rating: 4.7, reviewCount: 138, studentsEnrolled: 420, duration: "7 Weeks", durationWeeks: 7,
    lessons: 32, hasCertificate: true, language: "English",
    price: 4999, originalPrice: 7499, icon: "🏅", gradient: "from-sky-500 to-indigo-400",
    createdAt: "2025-07-28", demoProgress: 0,
  },
  {
    id: "22", slug: "endurance-marathon-coaching", title: "Endurance & Marathon Coaching",
    description: "Periodized running plans, pacing strategy, and race-day preparation for endurance athletes.",
    category: "Strength & Conditioning", instructorId: "rahul-mehta", level: "Intermediate",
    rating: 4.8, reviewCount: 246, studentsEnrolled: 980, duration: "10 Weeks", durationWeeks: 10,
    lessons: 50, hasCertificate: true, language: "English",
    price: 5999, originalPrice: 8999, icon: "⚡", gradient: "from-violet-500 to-purple-400",
    createdAt: "2026-01-02", demoProgress: 27,
  },
  {
    id: "23", slug: "corporate-wellness-coach", title: "Corporate Wellness Coach",
    description: "Design workplace wellness programs that boost employee health, energy, and retention.",
    category: "Wellness", instructorId: "rohan-desai", level: "Beginner",
    rating: 4.5, reviewCount: 96, studentsEnrolled: 380, duration: "5 Weeks", durationWeeks: 5,
    lessons: 22, hasCertificate: true, language: "English",
    price: 3499, originalPrice: 5499, icon: "❤️", gradient: "from-rose-500 to-pink-400",
    createdAt: "2025-09-15", demoProgress: 0,
  },
  {
    id: "24", slug: "mobility-flexibility-specialist", title: "Mobility & Flexibility Specialist",
    description: "Joint-by-joint mobility assessment and programming to improve range of motion and performance.",
    category: "Strength & Conditioning", instructorId: "vikram-nair", level: "Intermediate",
    rating: 4.7, reviewCount: 198, studentsEnrolled: 760, duration: "6 Weeks", durationWeeks: 6,
    lessons: 28, hasCertificate: true, language: "English",
    price: 3999, originalPrice: 6499, icon: "⚡", gradient: "from-violet-500 to-purple-400",
    createdAt: "2025-12-18", demoProgress: 8,
  },
];

export function getCategoryCourseCount(categoryName: string): number {
  return mockCourses.filter((c) => c.category === categoryName).length;
}

export const featuredCourses: Course[] = mockCourses.filter(
  (c) => c.bestseller || c.rating >= 4.8
).slice(0, 10);

// ---------------------------------------------------------------------------
// Learning paths
// ---------------------------------------------------------------------------

export const learningPaths: LearningPath[] = [
  {
    id: "personal-trainer-path",
    title: "Personal Trainer Path",
    icon: "💪",
    gradient: "from-cyan-500 to-blue-500",
    totalDuration: "16–20 Weeks",
    steps: [
      { title: "Gym Fundamentals", description: "Equipment, safety, and foundational movement patterns." },
      { title: "Strength Training", description: "Progressive overload and programming principles." },
      { title: "Client Assessment", description: "Movement screening and goal-setting frameworks." },
      { title: "Nutrition Basics", description: "Macronutrients and meal planning fundamentals." },
      { title: "Certification Exam", description: "Final assessment and Certified Personal Trainer credential." },
    ],
  },
  {
    id: "yoga-instructor-path",
    title: "Yoga Instructor Path",
    icon: "🧘",
    gradient: "from-indigo-500 to-blue-400",
    totalDuration: "18–22 Weeks",
    steps: [
      { title: "Yoga Foundations", description: "Core asanas, alignment, and sequencing basics." },
      { title: "Meditation", description: "Guided meditation techniques and mindfulness practice." },
      { title: "Breathing Techniques", description: "Pranayama practices for control and calm." },
      { title: "Teaching Practice", description: "Cueing, class design, and hands-on adjustments." },
      { title: "Certification", description: "Final evaluation and Yoga Instructor credential." },
    ],
  },
  {
    id: "nutrition-coach-path",
    title: "Nutrition Coach Path",
    icon: "🥗",
    gradient: "from-emerald-500 to-teal-400",
    totalDuration: "10–14 Weeks",
    steps: [
      { title: "Nutrition Basics", description: "Macronutrients, micronutrients, and energy balance." },
      { title: "Meal Planning", description: "Building sustainable, goal-aligned meal plans." },
      { title: "Sports Nutrition", description: "Fueling strategies for performance and recovery." },
      { title: "Client Programs", description: "Designing coaching programs for real clients." },
      { title: "Assessment", description: "Final case study and Nutrition Coach certification." },
    ],
  },
];

// ---------------------------------------------------------------------------
// Comparison section
// ---------------------------------------------------------------------------

export const comparisonTracks: ComparisonTrack[] = [
  { id: "gym-training", name: "Gym Training", icon: "🏋️" },
  { id: "yoga-instructor", name: "Yoga Instructor", icon: "🧘" },
  { id: "nutrition-coach", name: "Nutrition Coach", icon: "🥗" },
  { id: "personal-trainer", name: "Personal Trainer", icon: "💪" },
];

export const comparisonRows: ComparisonRow[] = [
  { feature: "Duration", values: ["10 Weeks", "16 Weeks", "8 Weeks", "12 Weeks"] },
  { feature: "Difficulty", values: ["Beginner–Advanced", "Beginner–Intermediate", "Beginner", "Beginner–Intermediate"] },
  { feature: "Certification", values: ["Included", "Included", "Included", "Included"] },
  { feature: "Career Opportunities", values: ["Gym Trainer", "Studio / Online Instructor", "Nutrition Consultant", "1-on-1 / Online Coach"], highlightBest: 3 },
  { feature: "Practical Sessions", values: ["High", "High", "Moderate", "High"] },
  { feature: "Placement Support", values: ["Yes", "Yes", "Yes", "Yes"] },
];

// ---------------------------------------------------------------------------
// Student success testimonials
// ---------------------------------------------------------------------------

export interface CourseTestimonial {
  name: string;
  initials: string;
  color: string;
  course: string;
  profession: string;
  rating: number;
  review: string;
}

export const courseTestimonials: CourseTestimonial[] = [
  { name: "Priya Sharma", initials: "PS", color: "#2563EB", course: "Certified Personal Trainer", profession: "Personal Trainer, Mumbai", rating: 5, review: "The PT course was detailed and practical. I landed my first client before I'd even finished the certification exam." },
  { name: "Rahul Mehta", initials: "RM", color: "#7C3AED", course: "Strength & Conditioning Specialist", profession: "Sports Performance Coach", rating: 5, review: "Exceptional depth on periodization. I use the programming templates with my athletes every single week." },
  { name: "Ananya Reddy", initials: "AR", color: "#059669", course: "Professional Yoga Instructor", profession: "Yoga Instructor & Studio Owner", rating: 5, review: "World-class content and genuinely practical teaching drills. I opened my own studio six months after certifying." },
  { name: "Karan Verma", initials: "KV", color: "#DB2777", course: "Sports Nutrition Fundamentals", profession: "Nutrition Consultant", rating: 5, review: "Evidence-based and immediately applicable. My clients noticed the difference in their meal plans right away." },
  { name: "Vikram Nair", initials: "VN", color: "#EA580C", course: "Advanced Gym Instructor", profession: "Head Coach, FitZone Gym", rating: 4, review: "Practical, structured, and taught by people who actually work in the industry. Worth every rupee." },
  { name: "Meera Iyer", initials: "MI", color: "#DC2626", course: "Women's Fitness Specialist", profession: "Women's Fitness Coach", rating: 5, review: "Finally a certification that takes hormonal health seriously. My client retention has never been better." },
];

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface CatalogStat {
  value: string;
  label: string;
  icon: string;
}

export const catalogStats: CatalogStat[] = [
  { value: "10,000+", label: "Students", icon: "🎓" },
  { value: "50+", label: "Courses", icon: "📚" },
  { value: "25+", label: "Expert Trainers", icon: "👨‍🏫" },
  { value: "15,000+", label: "Certificates Issued", icon: "🏅" },
  { value: "98%", label: "Completion Rate", icon: "✅" },
  { value: "4.9", label: "Average Rating", icon: "⭐" },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export interface CatalogFaq {
  question: string;
  answer: string;
}

export const catalogFaqs: CatalogFaq[] = [
  { question: "How do I enroll?", answer: "Pick a course from the catalog above, review the curriculum, and click Enroll Now. You'll get instant access to your learning dashboard after registration." },
  { question: "Are the certificates recognized?", answer: "Yes. GradSeal certificates are industry-recognized and digitally verifiable, trusted by gyms, studios, and wellness employers." },
  { question: "Can I learn at my own pace?", answer: "Absolutely. Every course is self-paced — there are no fixed deadlines, so you can move as fast or as slow as you need." },
  { question: "Is there lifetime access?", answer: "Yes. Once enrolled, you keep lifetime access to your course content, including any future updates to the material." },
  { question: "Are there practical assignments?", answer: "Yes. Most courses include hands-on assignments, case studies, and practical assessments designed to build real-world skills." },
  { question: "Will I receive placement assistance?", answer: "Certified students get access to career support resources, including client acquisition guidance and job placement leads." },
];

// ---------------------------------------------------------------------------
// Certificate showcase samples
// ---------------------------------------------------------------------------

export interface CertificateSample {
  name: string;
  course: string;
  certificateId: string;
}

export const certificateSamples: CertificateSample[] = [
  { name: "Priya Sharma", course: "Certified Personal Trainer", certificateId: "GS-PT-48213" },
  { name: "Rahul Mehta", course: "Strength & Conditioning Specialist", certificateId: "GS-SC-30987" },
  { name: "Ananya Reddy", course: "Professional Yoga Instructor", certificateId: "GS-YG-51204" },
  { name: "Karan Verma", course: "Sports Nutrition Fundamentals", certificateId: "GS-NC-29471" },
];
