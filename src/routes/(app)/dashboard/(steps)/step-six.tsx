import { MANUSCRIPTS, STEPS } from "@/constants";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import StepSixForm from "@/features/dashboard/components/steps/step-six-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard/(steps)/step-six")({
  component: RouteComponent,
});

function RouteComponent() {
  const manuscript = MANUSCRIPTS[0];

  return (
    <>
      <DashboardHeader title={`المرحلة ${STEPS[3]?.id} • ${STEPS[3]?.title}`} />

      <StepSixForm manuscript={manuscript} />
    </>
  );
}
