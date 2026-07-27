import { z } from "zod";
import { personalInfoSchema, addressSchema, educationSchema } from "./student-signup";

export const studentProfileSchema = z.object({
  ...personalInfoSchema.omit({ email: true }).shape,
  ...addressSchema.shape,
  ...educationSchema.shape,
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
