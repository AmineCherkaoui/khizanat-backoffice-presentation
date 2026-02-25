import { z } from "zod";

export const userSchema = z
  .object({
    name: z
      .string()
      .min(1, "الاسم الكامل مطلوب")
      .min(3, "الاسم الكامل يجب أن يكون 3 أحرف على الأقل"),

    email: z
      .email("صيغة البريد الإلكتروني غير صحيحة")
      .min(1, "البريد الإلكتروني مطلوب"),

    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),

    "password-confirm": z.string(),
  })
  .refine((data) => data.password === data["password-confirm"], {
    path: ["password-confirm"],
    message: "كلمتا المرور غير متطابقتين",
  });

export type UserFormValues = z.infer<typeof userSchema>;
