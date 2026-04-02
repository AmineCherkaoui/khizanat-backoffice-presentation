/* eslint-disable @typescript-eslint/no-explicit-any */
import { khizanat, STEPS, userRoles, users } from "@/constants";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import StepOneForm from "@/features/dashboard/components/steps/step-one-form";
import { useStorage } from "@/features/dashboard/store/useStorage";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/(app)/dashboard/(steps)/step-one")({
  component: RouteComponent,
});

const currentUser = users[0];
const userRole = userRoles.find((u) => u.value === currentUser.role)?.label;

export default function RouteComponent() {
  const { addManuscript, manuscripts } = useStorage();
  const navigate = useNavigate();
  const initialData = {
    title: "",
    author: "",
    scribe: "",
    century: "",
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
  };

  async function handleAddManuscript(value: any) {
    const initialLogs = [
      {
        id: "step-1",
        title: "الفهرسة",
        status: "completed",
        user: { name: currentUser.name, role: userRole },
        date: new Date().toISOString(),
        content: "تم إدخال البيانات الأساسية للمخطوط وتصنيفه.",
      },
      {
        id: "step-2",
        title: "الرقمنة",
        status: "pending",
        user: null,
        date: null,
        content: "في انتظار بدء عملية التصوير الضوئي.",
      },
      {
        id: "step-3",
        title: "المراجعة العلمية",
        status: "pending",
        user: null,
        date: null,
        content: "في انتظار التدقيق العلمي .",
      },
      {
        id: "step-4",
        title: "المعالجة",
        status: "pending",
        user: null,
        date: null,
        content: "في انتظار المعالجة النهائية .",
      },
    ];
    const id = `MS-2026-${String(manuscripts.length + 1).padStart(3, "0")}`;
    addManuscript({
      id,
      title: value.title,
      author: value.author,
      scribe: value.scribe,
      century: value.century,
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
      firstDigitalizationDate: new Date(),
      lastDigitalizationDate: new Date(),
      cover: URL.createObjectURL(value.cover),
      storageLocation: khizanat[0].value,
      currentStep: 2,
      stepStatus: "قيد التنفيذ",
      logs: initialLogs,
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
