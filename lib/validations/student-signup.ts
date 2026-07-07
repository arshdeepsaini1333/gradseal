import { z } from "zod";
import { Gender, HighestQualification } from "@/generated/prisma/enums";

export const MIN_AGE = 13;

export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  return age;
}

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

export const QUALIFICATION_OPTIONS: { value: HighestQualification; label: string }[] = [
  { value: "HIGH_SCHOOL", label: "High School" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "BACHELORS", label: "Bachelor's Degree" },
  { value: "MASTERS", label: "Master's Degree" },
  { value: "DOCTORATE", label: "Doctorate / PhD" },
  { value: "OTHER", label: "Other" },
];

const nameField = (label: string) =>
  z
    .string()
    .trim()
    .min(2, { error: `${label} must be at least 2 characters` })
    .max(50, { error: `${label} is too long` })
    .regex(/^[a-zA-Z\s'-]+$/, { error: `${label} can only contain letters` });

export const passwordSchema = z
  .string()
  .min(8, { error: "Password must be at least 8 characters" })
  .max(72, { error: "Password must be at most 72 characters" })
  .regex(/[a-z]/, { error: "Include at least one lowercase letter" })
  .regex(/[A-Z]/, { error: "Include at least one uppercase letter" })
  .regex(/[0-9]/, { error: "Include at least one number" })
  .regex(/[^a-zA-Z0-9]/, { error: "Include at least one special character" });

export const personalInfoSchema = z.object({
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
    .refine((v) => /^\+?[1-9]\d{7,14}$/.test(v), {
      error: "Enter a valid phone number",
    }),
  dateOfBirth: z.coerce
    .date({ error: "Enter a valid date of birth" })
    .refine((dob) => dob <= new Date(), {
      error: "Date of birth cannot be in the future",
    })
    .refine((dob) => calculateAge(dob) >= MIN_AGE, {
      error: `You must be at least ${MIN_AGE} years old to register`,
    }),
  gender: z.enum(Object.values(Gender) as [string, ...string[]], {
    error: "Please select a gender",
  }),
});

export const addressSchema = z.object({
  country: z.string().trim().min(1, { error: "Country is required" }).max(100),
  state: z.string().trim().min(1, { error: "State is required" }).max(100),
  city: z.string().trim().min(1, { error: "City is required" }).max(100),
  pincode: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9\- ]{3,10}$/, { error: "Enter a valid pincode" }),
  address: z
    .string()
    .trim()
    .max(500, { error: "Address is too long" })
    .optional()
    .or(z.literal("")),
});

export const educationSchema = z.object({
  highestQualification: z.enum(
    Object.values(HighestQualification) as [string, ...string[]],
    { error: "Please select your highest qualification" }
  ),
  collegeOrUniversity: z.string().trim().max(150).optional().or(z.literal("")),
  currentOccupation: z.string().trim().max(150).optional().or(z.literal("")),
  fieldOfStudy: z.string().trim().max(150).optional().or(z.literal("")),
});

export const accountSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const studentSignupSchema = z
  .object({
    ...personalInfoSchema.shape,
    ...addressSchema.shape,
    ...educationSchema.shape,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type StudentSignupInput = z.infer<typeof studentSignupSchema>;
