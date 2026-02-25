/* eslint-disable @typescript-eslint/no-explicit-any */
import Badge, { type BadgeVariant } from "@/components/common/badge";
import { BaseModal } from "@/components/common/base-modal";
import { SearchInput } from "@/components/common/searchInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { khizanat, ManuscriptStatus, STEPS } from "@/constants";
import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { KhizanaSelect } from "@/features/dashboard/components/khizana-select";
import { useStorage } from "@/features/dashboard/store/useStorage";
import { formatDate } from "@/lib/date";
import { paginate } from "@/lib/utils";
import type { TaskStatus } from "@/types/common";
import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Ellipsis,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const badgeVariant: Record<TaskStatus | ManuscriptStatus, BadgeVariant> = {
  "قيد التنفيذ": "info",
  معلق: "warning",
  مكتمل: "success",
  جيدة: "success",
  متوسطة: "warning",
  ضعيفة: "danger",
  مرفوض: "danger",
};

const PAGE_SIZE = 7;

type SearchParamsType = {
  page: number;
};

export const Route = createFileRoute("/(app)/dashboard/manuscrits/")({
  validateSearch: (search: Record<string, unknown>): SearchParamsType => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);
  const { manuscripts, deleteManuscript } = useStorage();

  const navigate = useNavigate({ from: Route.fullPath });

  // FILTER Form
  const form = useForm({
    defaultValues: {
      search: "",
      khizana: "",
      status: "",
    },
  });
  const formValues = useStore(form.store, (state) => state.values);

  const getFilterValue = (val: any) =>
    typeof val === "object" ? val?.value : val;

  const filteredManuscripts = useMemo(() => {
    const selectedKhizana = getFilterValue(formValues.khizana);
    const selectedStatus = getFilterValue(formValues.status);
    const searchTerm = formValues.search?.toLowerCase().trim();

    if (!selectedKhizana && !searchTerm && !selectedStatus) {
      return manuscripts;
    }

    return manuscripts.filter((m) => {
      const matchesKhizana =
        !selectedKhizana || m.storageLocation === selectedKhizana;

      const matchesSearch =
        !searchTerm ||
        m.id.toLowerCase().includes(searchTerm) ||
        m.title.toLowerCase().includes(searchTerm) ||
        m.startsWith?.toLowerCase().includes(searchTerm) ||
        m.endsWith?.toLowerCase().includes(searchTerm) ||
        m.author?.toLowerCase().includes(searchTerm);

      const matchesStatus = !selectedStatus || m.stepStatus === selectedStatus;

      return matchesKhizana && matchesSearch && matchesStatus;
    });
  }, [manuscripts, formValues]);

  // PAGINATION
  const { page = 1 } = Route.useSearch();
  const pagination = useMemo(() => {
    return paginate(filteredManuscripts, page, PAGE_SIZE);
  }, [page, filteredManuscripts]);

  const { items, totalPages } = pagination;

  const handlePageChange = (dir: "next" | "prev") => {
    const newPage =
      dir === "next" ? Math.min(page + 1, totalPages) : Math.max(page - 1, 1);
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  useEffect(() => {
    if (page < 1 || (page > totalPages && totalPages > 0)) {
      navigate({
        search: (prev) => ({ ...prev, page: 1 }),
        replace: true,
      });
    }
  }, [page, totalPages, navigate]);

  return (
    <>
      <DashboardHeader
        title="المخطوطات"
        description="تصفح وإدارة جميع المخطوطات المسجلة"
      >
        <form.Field
          name="khizana"
          children={(field) => (
            <KhizanaSelect
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
            />
          )}
        />
      </DashboardHeader>
      <DashboardCard>
        <DashboardCardHeader
          className="items-center text-lg md:text-2xl"
          title={formValues.khizana?.label || "جميع الخزانات"}
        >
          <div className="flex flex-col @sm:flex-row gap-2 w-full">
            <form.Field
              name="status"
              children={(field) => {
                const val = getFilterValue(field.state.value);
                return (
                  <Popover
                    open={isStatusPopoverOpen}
                    onOpenChange={setIsStatusPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isStatusPopoverOpen}
                        className={cn(
                          "w-full @sm:w-36 text-base-400 shadow-none font-normal px-2",
                          val && "text-base-800",
                        )}
                      >
                        <span className="flex-1 text-start">
                          {val
                            ? ManuscriptStatus.find(
                                (item: any) => item.value === val,
                              )?.label || "اختر الحالة..."
                            : "اختر الحالة..."}
                        </span>

                        {val ? (
                          <button
                            onClick={() => {
                              field.handleChange("");
                            }}
                          >
                            <X className="size-4 opacity-50" />
                          </button>
                        ) : (
                          <ChevronsUpDown className="size-4 opacity-50" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-2" align="start">
                      <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                        {ManuscriptStatus.map((status: any) => (
                          <button
                            key={status.value}
                            type="button"
                            onClick={() => {
                              field.handleChange(
                                status.value === val ? "" : status.value,
                              );
                              setIsStatusPopoverOpen(false);
                            }}
                            className={cn(
                              "relative flex gap-4 items-center w-full cursor-pointer select-none  rounded-sm px-2 py-1 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                              val === status.value
                                ? "bg-base-100 font-medium"
                                : "",
                            )}
                          >
                            <span className="flex-1">{status.label}</span>
                            <Check
                              className={cn(
                                "size-4",
                                val === status.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              }}
            />

            <form.Field
              name="search"
              children={(field) => (
                <SearchInput
                  placeholder="البحث..."
                  className="w-full max-w-full @xl:max-w-fit"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                />
              )}
            />
          </div>
        </DashboardCardHeader>

        <ScrollArea
          type="always"
          className="border rounded-xl border-base-300 mt-8 w-full"
        >
          <table className="w-full text-nowrap">
            <thead className="text-xs font-bold text-green-700 border-b border-base-300">
              <tr>
                <th className="p-4 text-start">الرقم التسلسلي</th>
                <th className="p-4 text-start">العنوان</th>
                <th className="p-4 text-start">مكان الحفظ</th>
                <th className="p-4 text-start">الحالة</th>
                <th className="p-4 text-start">الخطوة الحالية</th>
                <th className="p-4 text-start">تاريخ أول رقمنة</th>
                <th className="p-4 text-start">تاريخ آخر رقمنة</th>
                <th className="p-4 text-start">حالة المخطوطة</th>
                <th className="p-4 text-start">عدد الصفحات</th>
                <th className="p-4 text-start">المزيد</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {items.length > 0 ? (
                items.map((manuscript: any) => {
                  return (
                    <tr
                      key={manuscript.id}
                      className="not-last:border-b border-base-300 hover:bg-base-100 transition-colors duration-200"
                    >
                      <td className="p-4">{manuscript.id}</td>
                      <td className="p-4">{manuscript.title}</td>
                      <td className="p-4">
                        {
                          khizanat.find(
                            (k) => k.value === manuscript.storageLocation,
                          )?.label
                        }
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            badgeVariant[manuscript.stepStatus as TaskStatus]
                          }
                        >
                          {manuscript.stepStatus}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">
                          خطوة {manuscript.currentStep}
                        </p>
                        <p>{STEPS[manuscript.currentStep - 1]?.title}</p>
                      </td>
                      <td className="p-4">
                        {formatDate({
                          date: manuscript.firstDigitalizationDate,
                        })}
                      </td>
                      <td className="p-4">
                        {formatDate({
                          date: manuscript.lastDigitalizationDate,
                        })}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            badgeVariant[
                              manuscript.manuscriptStatus as TaskStatus
                            ]
                          }
                        >
                          {manuscript.manuscriptStatus}
                        </Badge>
                      </td>

                      <td className="p-4">{manuscript.numPages} صفحة</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Ellipsis className="cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="shadow-sm border-base-200 rounded-sm"
                            align="end"
                          >
                            <DropdownMenuGroup>
                              <DropdownMenuItem asChild>
                                <Link
                                  to="/dashboard/manuscrits/$id"
                                  params={{ id: manuscript.id }}
                                  className="flex items-center justify-center gap-2 hover:bg-green-50! hover:text-green-700! rounded"
                                >
                                  <SquarePen className="size-4 text-current" />
                                  <span>تحديث </span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                asChild
                                onSelect={(e) => e.preventDefault()}
                              >
                                <BaseModal
                                  open={isOpenModal}
                                  onOpenChange={setIsOpenModal}
                                  title={`هل أنت متأكد أنك تريد حذف المخطوطة "${manuscript.title}"؟`}
                                  description="سيتم حذف المخطوطة نهائيًا ولا يمكن استعادته لاحقًا. يرجى التأكد قبل المتابعة."
                                  variant="alert"
                                  onConfirm={() => {
                                    deleteManuscript(manuscript.id);
                                    toast.success("تم حذف المخطوطة بنجاح");
                                    setIsOpenModal(false);
                                  }}
                                  trigger={
                                    <button className="flex items-center justify-center gap-2 hover:bg-destructive/5! hover:text-destructive! w-full p-1 rounded">
                                      <Trash2 className="size-4 text-current" />
                                      <span>حذف</span>
                                    </button>
                                  }
                                />
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="p-8 text-center text-muted-foreground"
                  >
                    لا توجد مخطوطات متاحة
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <ScrollBar
            orientation="horizontal"
            className="[&>div]:bg-primary-500/50"
          />
        </ScrollArea>
        {items.length > 0 && (
          <div className="mt-4 flex justify-center items-center gap-4">
            <button
              disabled={page <= 1}
              className="cursor-pointer disabled:opacity-20 transition-opacity"
              onClick={() => handlePageChange("prev")}
            >
              <ChevronRight />
            </button>

            <span dir="ltr" className="font-medium">
              {page} / {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              className="cursor-pointer disabled:opacity-20 transition-opacity"
              onClick={() => handlePageChange("next")}
            >
              <ChevronLeft />
            </button>
          </div>
        )}
      </DashboardCard>
    </>
  );
}
