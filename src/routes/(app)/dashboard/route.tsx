import { SearchInput } from "@/components/common/searchInput";
import DashboardSidebar from "@/components/layout/sidebar/dashboard-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  createFileRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/(app)/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const routerState = useRouterState();

  const currentSearchParam = (routerState.location.search as any)?.search || "";
  const [searchValue, setSearchValue] = useState(currentSearchParam);

  useEffect(() => {
    setSearchValue(currentSearchParam);
  }, [currentSearchParam]);

  const executeSearch = () => {
    if (searchValue !== currentSearchParam) {
      navigate({
        to: "/dashboard/manuscrits",
        search: (prev: any) => ({
          ...prev,
          search: searchValue || undefined,
          page: 1,
        }),
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch();
      e.currentTarget.blur();
    }
  };

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-neutral-100 h-dvh overflow-x-hidden relative flex flex-col">
        <header className="bg-primary-800 z-1 text-white sticky top-0 flex h-13 shrink-0 items-center gap-2  px-4">
          <SidebarTrigger className="hover:bg-white hover:text-primary-600" />
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex justify-between items-center w-full gap-2 ">
              <SearchInput
                placeholder="البحث عن مخطوطات "
                value={searchValue}
                onChange={(val: string) => setSearchValue(val)}
                onKeyDown={handleKeyDown}
                onBlur={executeSearch}
              />
            </div>
          </div>
        </header>
        <section className="flex flex-col flex-1 gap-4 p-4 bg-neutral-100 @container">
          <Outlet />
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
