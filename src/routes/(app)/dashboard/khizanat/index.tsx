import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard/khizanat/")({
  component: RouteComponent,
});

function RouteComponent() {
  // TODO
  return (
    <div className="flex-1 flex flex-col  justify-center items-center">
      <h2 className="text-2xl font-bold mb-4 text-base-700">الخزانات</h2>
    </div>
  );
}
