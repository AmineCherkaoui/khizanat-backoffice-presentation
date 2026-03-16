import { createFileRoute } from "@tanstack/react-router";

import { MANUSCRIPTS, STEPS } from "@/constants";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import StepFiveForm from "@/features/dashboard/components/steps/step-five-form";
import { useForm } from "@tanstack/react-form";

export const Route = createFileRoute("/(app)/dashboard/(steps)/step-five")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm({
    defaultValues: {},

    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      form.reset();
    },
  });
  return (
    <>
      <DashboardHeader title={`المرحلة ${STEPS[4].id} • ${STEPS[4].title}`} />
      <StepFiveForm manuscript={MANUSCRIPTS[0]} />
    </>
  );
}
