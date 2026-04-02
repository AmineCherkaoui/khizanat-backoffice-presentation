import { z } from "zod";

z.config(z.locales.ar());

export const manuscriptSchema = z
  .object({
    title: z
      .string("العنوان مطلوب")
      .min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),

    author: z.string().optional(),
    scribe: z.string().optional(),

    century: z.string().min(1, "الحقبة مطلوبة"),

    language: z.string().min(1, "اللغة مطلوبة"),

    numPages: z.number().min(1, "عدد الصفحات يجب أن يكون أكبر من صفر"),
    linesPerPage: z.number().min(1, "يجب أن تكون أكبر من صفر"),
    material: z.string().min(3, "يجب ألا يقل عن 3 أحرف"),

    dimensions: z
      .string()
      .min(1, "المقياس مطلوب")
      .regex(/^\d+\/\d+$/, "يجب أن تكون الصيغة: رقم/رقم (مثال: 20/16)")
      .refine((val) => {
        const [width, height] = val.split("/").map(Number);
        return width > 0 && height > 0;
      }, "يجب أن تكون الأبعاد أكبر من صفر"),

    startsWith: z.string().min(5, "يجب ألا يقل عن 5 أحرف"),
    endsWith: z.string().min(5, "يجب ألا يقل عن 5 أحرف"),

    fontType: z.string().min(3, "يجب ألا يقل عن 3 أحرف"),
    classification: z.string().min(3, "يجب ألا يقل عن 3 أحرف"),

    status: z.enum(["جيدة", "متوسطة", "ضعيفة"], "يرجى اختيار حالة  المخطوطة"),

    cover: z.union([
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= 5000000,
          "حجم الملف يجب أن يكون أقل من 5 ميجابايت",
        )
        .refine(
          (file) =>
            ["image/jpeg", "image/png", "image/webp"].includes(file.type),
          "يجب أن تكون الصورة بتنسيق JPG أو PNG أو WEBP",
        ),

      z.string("رابط الصورة غير صالح"),
    ]),
  })
  .refine(
    (data) => {
      const hasAuthor = !!data.author && data.author.trim().length > 0;
      const hasScribe = !!data.scribe && data.scribe.trim().length > 0;
      return hasAuthor || hasScribe;
    },
    {
      message: "يجب إدخال اسم المؤلف أو الناسخ على الأقل (أو كلاهما)",
      path: ["author"],
    },
  )
  .refine(
    (data) => {
      const hasAuthor = !!data.author && data.author.trim().length > 0;
      const hasScribe = !!data.scribe && data.scribe.trim().length > 0;
      return hasAuthor || hasScribe;
    },
    {
      message: "يجب إدخال اسم المؤلف أو الناسخ على الأقل (أو كلاهما)",
      path: ["scribe"],
    },
  );

export type ManuscriptFormValues = z.infer<typeof manuscriptSchema>;
