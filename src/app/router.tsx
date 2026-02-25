import { Loading } from "@/components/common/loading";
import { NotFound } from "@/components/common/not-found";
import { routeTree } from "@/routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { queryClient } from "./queryClient";

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  // defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: false,

  defaultPendingComponent: () => <Loading />,
  defaultNotFoundComponent: () => <NotFound />,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}
