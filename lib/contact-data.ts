export interface ContactCard {
  icon: string;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}

export const contactCards: ContactCard[] = [
  {
    icon: "📚",
    title: "Course Admissions",
    description: "Need help choosing the right certification course?",
    buttonLabel: "Talk to Admissions",
    href: "#contact-form",
  },
  {
    icon: "🎓",
    title: "Student Support",
    description: "Get assistance with your account, learning portal, or certification.",
    buttonLabel: "Get Support",
    href: "#contact-form",
  },
  {
    icon: "🤝",
    title: "Business Partnerships",
    description: "Partner with GradSeal for educational collaborations.",
    buttonLabel: "Partner With Us",
    href: "#contact-form",
  },
  {
    icon: "💬",
    title: "General Questions",
    description: "Reach out for anything else.",
    buttonLabel: "Contact Us",
    href: "#contact-form",
  },
];

export interface SupportHighlight {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

export const supportHighlights: SupportHighlight[] = [
  {
    icon: "⚡",
    title: "Fast Response",
    description: "Average response under 24 hours.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: "🧭",
    title: "Expert Guidance",
    description: "Talk directly with course advisors.",
    gradient: "from-indigo-500 to-blue-400",
  },
  {
    icon: "🛟",
    title: "Dedicated Student Support",
    description: "Support before, during, and after certification.",
    gradient: "from-cyan-500 to-teal-400",
  },
];

export interface ContactFaqItem {
  question: string;
  answer: string;
}

export const contactFaqs: ContactFaqItem[] = [
  { question: "How do I enroll?", answer: "Browse our course catalog, pick a certification track, and register through the course page. You'll get instant access to your learning dashboard." },
  { question: "Can I contact an instructor?", answer: "Yes. Once enrolled, you can reach instructors directly through the course discussion board or by contacting student support." },
  { question: "How do I verify my certificate?", answer: "Use our certificate verification tool with your certificate ID, or scan the QR code printed on the certificate." },
  { question: "Do you offer placement assistance?", answer: "Yes, certified students get access to career support resources including client acquisition guidance and job placement leads." },
  { question: "Can I switch courses later?", answer: "Yes, reach out to student support and we'll help you transfer to a different certification track." },
  { question: "How quickly will I receive a response?", answer: "Our team typically responds within 24 hours, often much sooner during business hours." },
];

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
  color: string;
}

export const socialLinks: SocialLink[] = [
  { label: "Facebook", href: "#", icon: "facebook", color: "#1877F2" },
  { label: "Instagram", href: "#", icon: "instagram", color: "#E1306C" },
  { label: "LinkedIn", href: "#", icon: "linkedin", color: "#0A66C2" },
  { label: "YouTube", href: "#", icon: "youtube", color: "#FF0000" },
  { label: "X (Twitter)", href: "#", icon: "twitter", color: "#0F172A" },
  { label: "WhatsApp", href: "#", icon: "whatsapp", color: "#25D366" },
];
