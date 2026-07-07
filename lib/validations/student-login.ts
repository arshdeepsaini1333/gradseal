import { z } from "zod";

export const studentLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: "Email is required" })
    .toLowerCase()
    .pipe(z.email({ error: "Enter a valid email address" })),
  password: z.string().min(1, { error: "Password is required" }),
});

export type StudentLoginInput = z.infer<typeof studentLoginSchema>;
