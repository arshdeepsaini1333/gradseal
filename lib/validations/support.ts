import { z } from "zod";

export const supportRequestSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(3, { error: "Subject must be at least 3 characters" })
    .max(150, { error: "Subject is too long" }),
  orderId: z.string().trim().max(50, { error: "Order ID is too long" }).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, { error: "Message must be at least 10 characters" })
    .max(2000, { error: "Message must be under 2000 characters" }),
});

export type SupportRequestInput = z.infer<typeof supportRequestSchema>;
