import { STEPS } from "@/constants";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import StepFourForm from "@/features/dashboard/components/steps/step-four-form";
import { getManuscripts } from "@/features/dashboard/store/useStorage";
import {
  createFileRoute,
  notFound,
  useLoaderData,
} from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(app)/dashboard/manuscrits/$id/(steps)/step-four",
)({
  component: RouteComponent,
  loader: ({ params }) => {
    const { manuscripts } = getManuscripts();
    const manuscript = manuscripts.find((m) => m.id === params.id);

    // if (!manuscript || manuscript.currentStep < 4) {
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
        title={`المرحلة ${STEPS[3].id} • ${STEPS[3].title}`}
        description={"تسجيل وفحص المخطوطة الجديدة"}
      />
      <StepFourForm manuscript={manuscript} />
    </>
  );
}
