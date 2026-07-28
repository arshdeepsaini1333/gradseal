import { z } from "zod";
import { passwordSchema } from "@/lib/validations/student-signup";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: "Enter your current password" }),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    error: "New password must be different from your current password",
    path: ["newPassword"],
  });

export const createPasswordSchema = z
  .object({
    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, { error: "Enter the 6-digit code" }),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const DELETE_ACCOUNT_CONFIRM_TEXT = "DELETE";

export const deleteAccountSchema = z.object({
  confirmText: z.literal(DELETE_ACCOUNT_CONFIRM_TEXT, {
    error: `Type "${DELETE_ACCOUNT_CONFIRM_TEXT}" to confirm account deletion`,
  }),
});
