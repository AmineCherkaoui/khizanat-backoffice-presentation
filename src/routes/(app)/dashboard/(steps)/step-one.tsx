/* eslint-disable @typescript-eslint/no-explicit-any */
import { STEPS, userRoles, users } from "@/constants";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import StepOneForm from "@/features/dashboard/components/steps/step-one-form";
import { useStorage } from "@/features/dashboard/store/useStorage";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/(app)/dashboard/(steps)/step-one")({
  component: RouteComponent,
});

const DEFAULT_STEPS = [
  "اكمال الفحص المادي",
  "التقطت الصور الأولية",
  "توثيق الحالة",
  "تحديث نظام الجرد",
];

const currentUser = users[0];
const userRole = userRoles.find((u) => u.value === currentUser.role)?.label;

export default function RouteComponent() {
  const { addManuscript } = useStorage();
  const navigate = useNavigate();
  const initialData = {
    title: "",
    author: "",
    scribe: "",
    releaseDate: "",
    language: "",
    fontType: "",
    classification: "",
    numPages: 0,
    material: "",
    linesPerPage: 0,
    dimensions: "",
    status: "" as "جيدة" | "متوسطة" | "ضعيفة",
    startsWith: "",
    endsWith: "",
    cover: undefined,
    reviewing: DEFAULT_STEPS.map((title) => ({
      title,
      isChecked: false,
    })),
  };

  async function handleAddManuscript(value: any) {
    const id = `MS-2026-${crypto.randomUUID()}`;
    addManuscript({
      id,
      title: value.title,
      author: value.author,
      scribe: value.scribe,
      releaseDate: value.releaseDate,
      numPages: value.numPages,
      language: value.language,
      fontType: value.fontType,
      classification: value.classification,
      material: value.material,
      linesPerPage: value.linesPerPage,
      dimensions: value.dimensions,
      manuscriptStatus: value.status,
      startsWith: value.startsWith,
      endsWith: value.endsWith,
      reviewing: {
        stepOne: [...value.reviewing],
      },
      firstDigitalizationDate: new Date(),
      lastDigitalizationDate: new Date(),
      cover: URL.createObjectURL(value.cover),
      storageLocation: "01",
      currentStep: 2,
      stepStatus: "قيد التنفيذ",
      logs: [
        {
          id: crypto.randomUUID(),
          title: "تمت الفهرسة",
          user: {
            name: currentUser.name,
            role: userRole,
          },
          date: new Date(),
        },
      ],
    });
    navigate({ to: "/dashboard/manuscrits/$id", params: { id } });
    toast.success("تمت الفهرسة بنجاح");
  }

  return (
    <>
      <DashboardHeader
        title={`المرحلة ${STEPS[0].id} • ${STEPS[0].title}`}
        description="تسجيل وفحص المخطوطة الجديدة"
      />

      <StepOneForm initialData={initialData} onSubmit={handleAddManuscript} />
    </>
  );
}
