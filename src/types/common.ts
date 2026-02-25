import type { MANUSCRIPTS } from "@/constants";

export type TaskStatus = "قيد التنفيذ" | "معلق" | "مكتمل" | "مرفوض";

export type ManuscriptStatus = "متوسطة" | "ضعيفة" | "جيدة";

export type ManuscriptType = (typeof MANUSCRIPTS)[0];
