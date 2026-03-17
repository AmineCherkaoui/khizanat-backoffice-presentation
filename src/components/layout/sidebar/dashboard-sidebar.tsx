/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SIDEBAR_LINKS, STEPS, users } from "@/constants";
import { UserCard } from "@/features/dashboard/components/user-card";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";

export default function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, setOpenMobile } = useSidebar();
  function closeSideBar() {
    if (isMobile) {
      setOpenMobile(false);
    }
  }
  return (
    <Sidebar side="left" collapsible="offcanvas" {...props}>
      <SidebarHeader className="h-13 p-0 flex items-center justify-center">
        <SidebarLogo onLinkChange={closeSideBar} />
      </SidebarHeader>
      <SidebarContent className="bg-primary-800 text-white py-4">
        <SidebarNavigation onLinkChange={closeSideBar} />
        <SidebarSteps onLinkChange={closeSideBar} />
      </SidebarContent>
      <SidebarFooter>
        <UserCard user={users[0]} />
      </SidebarFooter>
    </Sidebar>
  );
}

function SidebarLogo({ onLinkChange }: { onLinkChange: () => void }) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = !isMobile && state === "collapsed";

  return (
    <Link
      onClick={onLinkChange}
      to="/dashboard"
      className="flex justify-center items-center gap-1"
    >
      <img src="/images/logo.png" />
      {!isCollapsed && (
        <div className="flex flex-col gap-0.5 overflow-hidden leading-tight">
          <p className="text-primary-800 text-[14px] font-bold truncate whitespace-nowrap">
            مخطوطات الخزانات الوقفية
          </p>
          <p className="font-bold text-neutral-500 text-[10px] truncate whitespace-nowrap">
            تراث وقفي... برؤية رقمية
          </p>
        </div>
      )}
    </Link>
  );
}

function SidebarNavigation({ onLinkChange }: { onLinkChange: () => void }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col ">
        <SidebarMenu className="gap-2">
          {SIDEBAR_LINKS.map((link) => (
            <SidebarMenuItem key={link.title}>
              <SidebarMenuButton asChild tooltip={link.title}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: !link?.includeChildren }}
                  onClick={onLinkChange}
                  className="font-medium text-white hover:bg-white/20 hover:text-white [&.active]:bg-white [&.active]:text-primary-600 transition-all duration-200"
                >
                  <span>{link.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function SidebarSteps({ onLinkChange }: { onLinkChange: () => void }) {
  const { open } = useSidebar();

  if (open)
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SidebarGroup className="border-t border-current/40">
            <SidebarGroupLabel className="text-primary-50/80 text-sm">
              مراحل تقدم العمل
            </SidebarGroupLabel>
            <SidebarGroupContent className="text-xs">
              <SidebarMenu className="flex flex-col gap-4 p-4">
                {STEPS.map((step) => (
                  <SidebarMenuItem key={step.id}>
                    <Link
                      to={`/dashboard/${step.to}` as any}
                      className="flex gap-4 items-center font-semibold"
                      onClick={onLinkChange}
                    >
                      {({ isActive }) => (
                        <>
                          <div
                            className={cn(
                              "bg-primary-800 size-1.5 rounded-full ring-3 ring-primary-700 transition-all",
                              isActive && "ring-[#8BFBDF]",
                            )}
                          />
                          <span>
                            المرحلة {step.id} • {step.title}
                          </span>
                        </>
                      )}
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </motion.div>
      </AnimatePresence>
    );
}
