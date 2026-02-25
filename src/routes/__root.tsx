import { Loading } from "@/components/common/loading";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { AnimatePresence } from "motion/react";

interface RouterContextType {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContextType>()({
  component: RootLayout,
  pendingComponent: () => <Loading />,
});

function RootLayout() {
  return (
    <>
      <AnimatePresence>
        <Outlet />
      </AnimatePresence>

      <TanStackDevtools
        plugins={[
          {
            name: "TanStack Query",
            render: <ReactQueryDevtoolsPanel />,
            defaultOpen: true,
          },

          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },

          {
            name: "TanStack Form",
            render: <FormDevtoolsPanel />,
          },
        ]}
      />
    </>
  );
}
