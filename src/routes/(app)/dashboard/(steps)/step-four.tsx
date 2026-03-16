import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { createFileRoute } from "@tanstack/react-router";

import { MANUSCRIPTS, STEPS } from "@/constants";
import StepFourForm from "@/features/dashboard/components/steps/step-four-form";

export const Route = createFileRoute("/(app)/dashboard/(steps)/step-four")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardHeader title={`المرحلة ${STEPS[3].id} • ${STEPS[3].title}`} />

      <StepFourForm manuscript={MANUSCRIPTS[0]} />
    </>
  );
}
