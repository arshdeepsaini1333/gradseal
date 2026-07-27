export interface AboutStat {
  value: string;
  label: string;
  icon: string;
}

export const aboutStats: AboutStat[] = [
  { value: "10,000+", label: "Students Certified", icon: "🎓" },
  { value: "50+", label: "Courses", icon: "📚" },
  { value: "25+", label: "Industry Experts", icon: "👨‍🏫" },
  { value: "98%", label: "Completion Rate", icon: "✅" },
  { value: "15,000+", label: "Certificates Issued", icon: "🏅" },
];

export interface CourseCategory {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

export const courseCategories: CourseCategory[] = [
  {
    icon: "🏋️",
    title: "Gym Training",
    description: "Master strength training, equipment use, and safe workout programming.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: "🧘",
    title: "Yoga",
    description: "Learn asanas, pranayama, and anatomy through certified teacher training.",
    gradient: "from-indigo-500 to-blue-400",
  },
  {
    icon: "💪",
    title: "Personal Training",
    description: "Build client programs, form assessments, and one-on-one coaching skills.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: "🥗",
    title: "Nutrition",
    description: "Evidence-based diet science to guide clients toward lasting health.",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    icon: "❤️",
    title: "Wellness",
    description: "Holistic coaching covering recovery, mindset, and lifestyle balance.",
    gradient: "from-rose-500 to-pink-400",
  },
  {
    icon: "🏃",
    title: "Functional Fitness",
    description: "Movement-based training that builds real-world strength and mobility.",
    gradient: "from-orange-500 to-amber-400",
  },
  {
    icon: "⚡",
    title: "Strength & Conditioning",
    description: "Periodization and performance programming for athletes of all levels.",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    icon: "🏅",
    title: "Sports Science",
    description: "The physiology and biomechanics behind elite athletic performance.",
    gradient: "from-sky-500 to-indigo-400",
  },
];

export interface WhyFeature {
  icon: string;
  title: string;
  description: string;
}

export const whyChooseFeatures: WhyFeature[] = [
  { icon: "Users", title: "Expert Trainers", description: "Learn directly from certified professionals with real industry experience." },
  { icon: "BadgeCheck", title: "Industry Recognized Certificates", description: "Certifications that employers and clients trust and verify instantly." },
  { icon: "Clock", title: "Flexible Learning", description: "Study whenever it suits you — no fixed schedules, no missed classes." },
  { icon: "ClipboardCheck", title: "Practical Training", description: "Hands-on assignments and real scenarios, not just theory." },
  { icon: "IndianRupee", title: "Affordable Courses", description: "Premium fitness education priced for accessibility, not exclusivity." },
  { icon: "Infinity", title: "Lifetime Access", description: "Revisit your course materials anytime, even after certifying." },
  { icon: "MessageSquareQuote", title: "Interactive Assessments", description: "Quizzes and practical evaluations designed to reinforce real learning." },
  { icon: "Rocket", title: "Career Support", description: "Guidance and resources to help you launch your fitness career." },
];

export interface TimelineStep {
  title: string;
  description: string;
  icon: string;
}

export const timelineSteps: TimelineStep[] = [
  { title: "Choose Course", description: "Browse programs across fitness, yoga, nutrition, and more.", icon: "Compass" },
  { title: "Enroll", description: "Sign up in minutes and get instant access to your dashboard.", icon: "ClipboardCheck" },
  { title: "Watch Lessons", description: "Learn from expert-led video lessons at your own pace.", icon: "Play" },
  { title: "Complete Assessments", description: "Test your knowledge with structured quizzes and practicals.", icon: "Target" },
  { title: "Earn Certificate", description: "Receive your industry-recognized digital certificate.", icon: "Award" },
  { title: "Start Your Career", description: "Launch your journey as a certified fitness professional.", icon: "Rocket" },
];

export interface CertificationSample {
  name: string;
  course: string;
  id: string;
}

export const certificationSamples: CertificationSample[] = [
  { name: "Priya Sharma", course: "Certified Personal Trainer", id: "GS-PT-48213" },
  { name: "Rahul Mehta", course: "Sports Performance Specialist", id: "GS-SP-30987" },
  { name: "Ananya Reddy", course: "Yoga Instructor 200-Hour", id: "GS-YG-51204" },
  { name: "Karan Verma", course: "Nutrition Coach Certification", id: "GS-NC-29471" },
];

export interface PhilosophyStep {
  title: string;
  description: string;
  icon: string;
}

export const philosophySteps: PhilosophyStep[] = [
  { title: "Learn", description: "Absorb expert-led lessons broken into clear, structured modules.", icon: "BookOpen" },
  { title: "Practice", description: "Apply your knowledge through real-world drills and assignments.", icon: "Dumbbell" },
  { title: "Assess", description: "Prove your understanding with practical, scenario-based evaluations.", icon: "ClipboardCheck" },
  { title: "Achieve", description: "Earn your certificate and step confidently into your new career.", icon: "Trophy" },
];

export interface SuccessStory {
  name: string;
  role: string;
  quote: string;
}

export const successStories: SuccessStory[] = [
  { name: "Priya Sharma", role: "Certified Personal Trainer", quote: "GradSeal gave me the confidence and credentials to start my own training studio." },
  { name: "Ananya Reddy", role: "Yoga Instructor", quote: "The 200-hour program was thorough, practical, and genuinely transformed how I teach." },
  { name: "Vikram Nair", role: "Gym Coach", quote: "I went from hobbyist to head coach at my local gym in under six months." },
  { name: "Karan Verma", role: "Nutrition Consultant", quote: "Evidence-based, well structured, and immediately applicable with my clients." },
];

export interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

export const values: ValueItem[] = [
  { icon: "Sparkles", title: "Quality Education", description: "Every course is built and reviewed by industry practitioners." },
  { icon: "ShieldCheck", title: "Integrity", description: "Honest, evidence-based content — no shortcuts, no fluff." },
  { icon: "Lightbulb", title: "Innovation", description: "Constantly evolving our platform and curriculum with the industry." },
  { icon: "TrendingUp", title: "Student Success", description: "Your outcomes are the measure of everything we build." },
  { icon: "Rocket", title: "Professional Growth", description: "We invest in your long-term career, not just a single course." },
  { icon: "Handshake", title: "Community", description: "A network of trainers, coaches, and instructors who support each other." },
];

export interface AboutTestimonial {
  name: string;
  role: string;
  course: string;
  rating: number;
  review: string;
}

export const aboutTestimonials: AboutTestimonial[] = [
  { name: "Priya Sharma", role: "Certified Personal Trainer", course: "Certified Personal Trainer", rating: 5, review: "GradSeal completely changed my career. The course was detailed, practical, and the certificate opened doors I never expected." },
  { name: "Rahul Mehta", role: "Sports Performance Coach", course: "Sports Performance Specialist", rating: 5, review: "Exceptional instruction quality. I studied at my own pace and my clients now trust my credentials instantly." },
  { name: "Ananya Reddy", role: "Yoga Instructor", course: "Yoga Instructor 200-Hour", rating: 5, review: "Two certifications, world-class content, and certificates that are easy to share with employers." },
  { name: "Vikram Nair", role: "Gym Coach", course: "Gym Trainer Professional", rating: 5, review: "Practical, structured, and taught by people who actually work in the industry. Worth every rupee." },
  { name: "Karan Verma", role: "Nutrition Consultant", course: "Nutrition Coach Certification", rating: 5, review: "The nutrition science is genuinely evidence-based. I use what I learned with every client I coach." },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const aboutFaqs: FaqItem[] = [
  { question: "Are certificates recognized?", answer: "Yes. GradSeal certificates are industry-recognized and verifiable online, trusted by gyms, studios, and wellness employers." },
  { question: "Can I learn online?", answer: "Absolutely. Every course is delivered fully online with video lessons, reading material, and assessments you can complete from anywhere." },
  { question: "How long are courses?", answer: "Course length varies by program, typically ranging from 6 to 16 weeks, but all courses are self-paced so you can go faster or slower." },
  { question: "Do I get lifetime access?", answer: "Yes. Once enrolled, you have lifetime access to your course content, including any future updates to the material." },
  { question: "Are there practical sessions?", answer: "Yes. Courses include hands-on assignments, case studies, and practical assessments designed to build real-world skills." },
  { question: "Will I receive placement assistance?", answer: "Yes. Certified students get access to career support resources, including guidance on client acquisition and job placement leads." },
];
