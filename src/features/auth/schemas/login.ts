import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "البريد الإلكتروني مطلوب" })
    .email({ message: "البريد الإلكتروني غير صالح" }),
  password: z
    .string()
    .min(1, { message: "كلمة المرور مطلوبة" })
    .min(6, { message: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل" }),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
