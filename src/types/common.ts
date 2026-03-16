import type { MANUSCRIPTS } from "@/constants";

export type TaskStatus = "قيد التنفيذ" | "متاخر" | "مكتمل" | "مرفوض";

export type ManuscriptStatus = "متوسطة" | "ضعيفة" | "جيدة";

export type ManuscriptType = (typeof MANUSCRIPTS)[0];
