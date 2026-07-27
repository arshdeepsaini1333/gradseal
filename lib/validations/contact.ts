import { z } from "zod";

export const COURSE_INTEREST_OPTIONS = [
  "Gym Training",
  "Personal Training",
  "Yoga",
  "Nutrition",
  "Wellness",
  "Strength & Conditioning",
  "Sports Science",
  "Other",
] as const;

const nameField = (label: string) =>
  z
    .string()
    .trim()
    .min(2, { error: `${label} must be at least 2 characters` })
    .max(50, { error: `${label} is too long` })
    .regex(/^[a-zA-Z\s'-]+$/, { error: `${label} can only contain letters` });

export const MESSAGE_MAX_LENGTH = 1000;

export const contactFormSchema = z.object({
  firstName: nameField("First name"),
  lastName: nameField("Last name"),
  email: z
    .string()
    .trim()
    .min(1, { error: "Email is required" })
    .toLowerCase()
    .pipe(z.email({ error: "Enter a valid email address" })),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s\-().]/g, ""))
    .refine((v) => v === "" || /^\+?[1-9]\d{7,14}$/.test(v), {
      error: "Enter a valid phone number",
    })
    .optional()
    .or(z.literal("")),
  courseInterest: z.enum(COURSE_INTEREST_OPTIONS, {
    error: "Please select a course you're interested in",
  }),
  subject: z
    .string()
    .trim()
    .min(3, { error: "Subject must be at least 3 characters" })
    .max(150, { error: "Subject is too long" }),
  message: z
    .string()
    .trim()
    .min(10, { error: "Message must be at least 10 characters" })
    .max(MESSAGE_MAX_LENGTH, { error: `Message must be under ${MESSAGE_MAX_LENGTH} characters` }),
  agreeToPolicy: z.preprocess(
    (v) => v ?? "",
    z.string().refine((v) => v === "on" || v === "true", {
      error: "You must agree to the Privacy Policy",
    })
  ),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: "Email is required" })
    .toLowerCase()
    .pipe(z.email({ error: "Enter a valid email address" })),
});
