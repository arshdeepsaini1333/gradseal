import { z } from "zod";

export const prepareCertificateSchema = z.object({
  courseId: z.string().min(1),
  name: z
    .string()
    .trim()
    .min(2, { error: "Enter your full name (at least 2 characters)." })
    .max(100, { error: "That name is too long." }),
});
