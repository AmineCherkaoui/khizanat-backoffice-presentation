/* eslint-disable @typescript-eslint/no-explicit-any */
import { MANUSCRIPTS } from "@/constants";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import StepThreeForm from "@/features/dashboard/components/steps/step-three-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard/(steps)/step-three")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardHeader
        title="المرحلة 3 • المراجعة العلمية"
        description="التحليل و التحقق العلمي"
      />
      <StepThreeForm manuscript={MANUSCRIPTS[0]} />
    </>
  );
}
