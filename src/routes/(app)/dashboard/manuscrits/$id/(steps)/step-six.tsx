import { STEPS } from "@/constants";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import StepSixForm from "@/features/dashboard/components/steps/step-six-form";
import { getManuscripts } from "@/features/dashboard/store/useStorage";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(app)/dashboard/manuscrits/$id/(steps)/step-six",
)({
  component: RouteComponent,
  loader: ({ params }) => {
    const { manuscripts } = getManuscripts();
    const manuscript = manuscripts.find((m) => m.id === params.id);

    // if (!manuscript || manuscript.currentStep < 6) {
    //   throw notFound();
    // }

    return manuscript;
  },
});

function RouteComponent() {
  const manuscript = useLoaderData({ from: Route.id });
  return (
    <>
      <DashboardHeader
        title={`المرحلة ${STEPS[3]?.id} • ${STEPS[3]?.title}`}
        description="الفهرسة وإدراج البيانات الوصفية"
      />

      <StepSixForm manuscript={manuscript} />
    </>
  );
}
