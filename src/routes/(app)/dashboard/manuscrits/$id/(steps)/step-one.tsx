/* eslint-disable @typescript-eslint/no-explicit-any */
import { STEPS } from "@/constants";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import StepOneForm from "@/features/dashboard/components/steps/step-one-form";
import {
  getManuscripts,
  useStorage,
} from "@/features/dashboard/store/useStorage"; // Import useStorage
import {
  createFileRoute,
  notFound,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/(app)/dashboard/manuscrits/$id/(steps)/step-one",
)({
  component: RouteComponent,
  loader: ({ params }) => {
    const data = getManuscripts();
    const allManuscripts = Array.isArray(data) ? data : data?.manuscripts || [];

    const manuscript = allManuscripts.find((m: any) => m.id === params.id);

    if (!manuscript) {
      throw notFound();
    }

    return manuscript;
  },
});

export default function RouteComponent() {
  const manuscript = useLoaderData({ from: Route.id });
  const { updateManuscript } = useStorage();
  const navigate = useNavigate();

  const initialData = {
    title: manuscript.title || "",
    author: manuscript.author || "",
    scribe: manuscript.scribe || "",
    releaseDate: manuscript?.releaseDate
      ? new Date(manuscript.releaseDate)
      : undefined,
    language: manuscript.language || "",
    fontType: manuscript.fontType || "",
    classification: manuscript.classification || "",
    material: manuscript.material || "",
    linesPerPage: manuscript.linesPerPage || 0,
    dimensions: manuscript.dimensions || "",
    numPages: manuscript.numPages || 0,

    status: manuscript.manuscriptStatus || ("" as "جيدة" | "متوسطة" | "ضعيفة"),
    startsWith: manuscript?.startsWith || "",
    endsWith: manuscript?.endsWith || "",
    cover: manuscript.cover || undefined,
  };

  const handleUpdate = (values: any) => {
    const updatedData = {
      ...manuscript,
      title: values.title,
      author: values.author,
      scribe: values.scribe,
      releaseDate: values.releaseDate,
      numPages: values.numPages,
      language: values.language,
      fontType: values.fontType,
      classification: values.classification,
      material: values.material,
      linesPerPage: values.linesPerPage,
      dimensions: values.dimensions,
      startsWith: values.startsWith,
      endsWith: values.endsWith,
      manuscriptStatus: values.status,

      lastDigitalizationDate: new Date(),
      cover:
        values.cover instanceof File
          ? URL.createObjectURL(values.cover)
          : values.cover,
    };

    updateManuscript(updatedData);
    toast.success("تم تحديث معلومات  المخطوطة بنجاح");
    navigate({ to: ".." });
  };

  return (
    <>
      <DashboardHeader
        title={`المرحلة ${STEPS[0].id} • ${STEPS[0].title}`}
        description={`تعديل: ${manuscript.title}`}
      />

      <StepOneForm initialData={initialData} onSubmit={handleUpdate} />
    </>
  );
}
