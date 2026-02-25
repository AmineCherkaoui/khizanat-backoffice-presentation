/* eslint-disable @typescript-eslint/no-explicit-any */
import { STEPS } from "@/constants";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import StepTwoForm from "@/features/dashboard/components/steps/step-two-form";
import { getManuscripts } from "@/features/dashboard/store/useStorage";
import {
  createFileRoute,
  notFound,
  useLoaderData,
} from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(app)/dashboard/manuscrits/$id/(steps)/step-two",
)({
  component: RouteComponent,
  loader: ({ params }) => {
    const { manuscripts } = getManuscripts();
    const manuscript = manuscripts?.find((m) => m.id === params.id);

    if (!manuscript || manuscript.currentStep < 2) {
      throw notFound();
    }

    return manuscript;
  },
});

function RouteComponent() {
  const manuscript = useLoaderData({ from: Route.id });

  return (
    <>
      <DashboardHeader
        title={`المرحلة ${STEPS[1].id} • ${STEPS[1].title}`}
        description="مسح و تحميل صفحات  المخطوطة"
      />

      <StepTwoForm manuscript={manuscript} />
    </>
  );
}
