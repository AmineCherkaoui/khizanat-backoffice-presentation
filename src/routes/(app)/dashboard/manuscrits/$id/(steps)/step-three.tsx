/* eslint-disable @typescript-eslint/no-explicit-any */
import { STEPS } from "@/constants";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import StepThreeForm from "@/features/dashboard/components/steps/step-three-form";
import { getManuscripts } from "@/features/dashboard/store/useStorage";
import {
  createFileRoute,
  notFound,
  useLoaderData,
} from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(app)/dashboard/manuscrits/$id/(steps)/step-three",
)({
  component: RouteComponent,
  loader: ({ params }) => {
    const { manuscripts } = getManuscripts();
    const manuscript = manuscripts.find((m) => m.id === params.id);

    if (!manuscript || manuscript.currentStep < 3) {
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
        title={`المرحلة ${STEPS[2].id} • ${STEPS[2].title}`}
        description={"التحليل و التحقق العلمي"}
      />
      <StepThreeForm manuscript={manuscript} />
    </>
  );
}
