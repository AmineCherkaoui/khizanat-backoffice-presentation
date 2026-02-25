/* eslint-disable @typescript-eslint/no-explicit-any */
import { MANUSCRIPTS, STEPS } from "@/constants";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import StepTwoForm from "@/features/dashboard/components/steps/step-two-form";
import { createFileRoute } from "@tanstack/react-router";

function RouteComponent() {
  const initialData = {
    attachments: [] as File[],
  };

  return (
    <>
      <DashboardHeader
        title={`المرحلة ${STEPS[1].id} • ${STEPS[1].title}`}
        description="مسح و تحميل صفحات  المخطوطة"
      />

      <StepTwoForm manuscript={MANUSCRIPTS[0]} />
    </>
  );
}

export const Route = createFileRoute("/(app)/dashboard/(steps)/step-two")({
  component: RouteComponent,
});
