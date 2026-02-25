import { SearchInput } from "@/components/common/searchInput";
import DashboardSidebar from "@/components/layout/sidebar/dashboard-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserCard } from "@/features/dashboard/components/user-card";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-neutral-100 h-dvh overflow-x-hidden relative flex flex-col">
        <header className="bg-primary-800 z-1 text-white sticky top-0 flex h-13 shrink-0 items-center gap-2  px-4">
          <SidebarTrigger className="hover:bg-white hover:text-primary-600" />
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex justify-between items-center w-full gap-2 ">
              <SearchInput placeholder="البحث عن مخطوطات أو أرشيفات أو معرفات" />
              <UserCard />
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
