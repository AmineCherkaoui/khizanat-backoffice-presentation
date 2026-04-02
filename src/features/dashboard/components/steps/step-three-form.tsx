/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseButton from "@/components/common/base-button";
import { useState } from "react";

import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import type { ManuscriptType } from "@/types/common";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageSquareWarning,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useStorage } from "../../store/useStorage";

import { BaseModal } from "@/components/common/base-modal";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { userRoles, users } from "@/constants";

const currentUser = users[0];
const userRole = userRoles.find((u) => u.value === currentUser.role)?.label;

export default function StepThreeForm({
  manuscript,
}: {
  manuscript: ManuscriptType;
}) {
  const navigate = useNavigate();
  const { updateManuscript, manuscripts } = useStorage();

  // Read live data from store to avoid stale loader snapshot
  const liveManuscript =
    manuscripts.find((m) => m.id === manuscript.id) ?? manuscript;

  const initialPages = [...(liveManuscript.pages || [])]
    .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
    .map((page) => ({
      ...page,
      observation: page?.observation || "",
    }));

  const [pages, setPages] = useState<any[]>(initialPages);
  const totalPages = pages.length;

  // Find the 1-based array index of the last reviewed page (matched by id)
  const lastReviewedIndex = liveManuscript.lastReviewedPage
    ? Math.max(
        1,
        initialPages.findIndex(
          (p) => p.id === liveManuscript.lastReviewedPage,
        ) + 1,
      )
    : 1;

  const [currentPageIndex, setCurrentPageIndex] = useState(lastReviewedIndex);

  const form = useForm({
    defaultValues: {
      markAsCompleted: manuscript.currentStep > 3,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedManuscript = {
        ...manuscript,
        logs: manuscript.logs?.map((log) => {
          if (log.id === "step-3") {
            if (value.markAsCompleted) {
              return {
                ...log,
                status: "completed",
                user: {
                  name: currentUser.name,
                  role: userRole,
                },
                date: new Date().toISOString(),
                content: "تم تأكيد المراجعة العلمية بنجاح.",
              };
            } else {
              return {
                ...log,
                status: "pending",
                user: null,
                date: null,
                content: "في انتظار التدقيق العلمي .",
              };
            }
          }
          return log;
        }),

        lastDigitalizationDate: new Date(),
        pages: pages,
        lastReviewedPage: pages[currentPageIndex - 1]?.id ?? currentPageIndex,
        currentStep: value.markAsCompleted ? 4 : 3,
        stepStatus: "قيد التنفيذ",
      };

      updateManuscript(updatedManuscript);

      form.reset();
      if (value.markAsCompleted) {
        navigate({ to: ".." });
      }

      if (value.markAsCompleted) {
        toast.success("تم حفظ التقدم و التنقل إلى المرحلة التالية بنجاح");
      } else {
        toast.success("تم حفظ تقدم بنجاح ");
      }
    },
  });

  const [rejectLoading, setRejectLoading] = useState(false);
  const handleReject = async () => {
    setRejectLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedManuscript = {
      ...manuscript,
      logs: manuscript.logs?.map((log) => {
        if (log.id === "step-3") {
          return {
            ...log,
            status: "rejected",
            user: {
              name: currentUser.name,
              role: userRole,
            },
            date: new Date().toISOString(),
            content:
              "تم رفض المراجعة العلمية. المخطوط يحتاج إلى إعادة فحص أو تدقيق إضافي.",
          };
        }
        return log;
      }),
      pages: pages,
      lastReviewedPage: pages[currentPageIndex - 1]?.id ?? currentPageIndex,
      stepStatus: "مرفوض",
    };

    updateManuscript(updatedManuscript);
    setRejectLoading(false);
    navigate({ to: ".." });
    toast.error("تم رفض  المخطوطة ");
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages) setCurrentPageIndex((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 1) setCurrentPageIndex((prev) => prev - 1);
  };

  const updateCurrentPageObservation = (text: string) => {
    setPages((prevPages) => {
      const newPages = [...prevPages];
      newPages[currentPageIndex - 1] = {
        ...newPages[currentPageIndex - 1],
        observation: text,
      };
      return newPages;
    });
  };

  const currentPageData = pages[currentPageIndex - 1];

  const currentActualPageNum = currentPageData?.id ?? currentPageIndex;

  const pagesWithObservationsCount = pages.filter(
    (p) => p?.observation && p?.observation.trim() !== "",
  ).length;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="grid grid-cols-1 gap-4 @5xl:grid-cols-12 "
    >
      <div className="@5xl:col-span-8 gap-4 flex flex-col ">
        <DashboardCard className="flex flex-col flex-1 min-h-[80dvh]">
          <DashboardCardHeader title="عارض الصفحات" />

          {totalPages > 0 ? (
            <>
              <div className="mt-4 flex flex-row  gap-8">
                <div className="flex items-center justify-between gap-2 px-4 py-1 bg-neutral-100 rounded-full">
                  <span className="text-sm  text-black">إجمالي الصفحات</span>
                  <span
                    className="text-sm  text-gray-500   rounded-md"
                    dir="ltr"
                  >
                    {totalPages} / {liveManuscript.numPages}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 px-4 py-1 bg-red-50 rounded-full">
                  <span className="text-sm text-black ">
                    صفحات بها ملاحظات/عيوب
                  </span>
                  <span className="text-sm text-red-600">
                    {pagesWithObservationsCount}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex-1 flex flex-col">
                <div className="bg-base-100 flex-1 rounded-lg flex flex-col items-center justify-center text-gray-400 overflow-hidden relative border border-base-200">
                  {currentPageData?.url && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="relative group w-full h-full flex items-center justify-center max-h-[70vh] cursor-zoom-in outline-none"
                        >
                          <img
                            src={currentPageData.url}
                            alt={`Page ${currentActualPageNum}`}
                            className="object-contain w-full h-full transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="size-12 text-white drop-shadow-md" />
                          </div>
                        </button>
                      </DialogTrigger>

                      <DialogPortal>
                        <DialogContent
                          showCloseButton={false}
                          className="flex flex-col justify-center items-center bg-transparent border-none shadow-none sm:max-w-[90dvw] max-h-[90dvh]"
                        >
                          <div className="flex-1 flex items-center justify-center">
                            <img
                              src={currentPageData.url}
                              alt={`Page ${currentActualPageNum}`}
                              className="object-contain max-h-[90dvh] w-auto rounded-md"
                            />
                          </div>
                        </DialogContent>

                        <DialogClose asChild>
                          <button className="fixed top-4 right-4 z-9999 bg-white p-2 rounded-full">
                            <X className="size-6 text-base-800" />
                          </button>
                        </DialogClose>
                      </DialogPortal>
                    </Dialog>
                  )}
                </div>
                <div className="mt-4 flex justify-between items-center  rounded-lg ">
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 1}
                    className="flex items-center gap-2 font-medium text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="size-4" />
                    <span className="hidden sm:block">الصفحة السابقة</span>
                  </button>

                  <p className="text-black font-bold">
                    الصفحة
                    <span dir="ltr" className="me-1">
                      {currentActualPageNum} / {liveManuscript.numPages}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPageIndex >= totalPages}
                    className="flex items-center gap-2 font-medium text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:block">الصفحة التالية</span>
                    <ChevronLeft className="size-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquareWarning className="w-16 h-16 opacity-20 mb-4" />
              <p className="text-lg font-semibold">لا توجد صفحات للمراجعة</p>
            </div>
          )}
        </DashboardCard>
      </div>

      <div className="flex flex-col gap-4 @5xl:sticky @5xl:top-4 @5xl:col-span-4 ">
        {totalPages > 0 && (
          <DashboardCard className="flex flex-col gap-4 @2xl:top-4 @2xl:col-span-4  border-yellow-200  bg-yellow-50/80">
            <DashboardCardHeader
              title={`ملاحظة الصفحة الحالية (${currentActualPageNum})`}
            />
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-yellow-800 mb-1">
                <MessageSquareWarning className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  هل يوجد ملاحظة في هذه الصفحة
                </span>
              </div>

              <textarea
                className="w-full rounded-md border border-yellow-300 bg-white focus:ring-2 focus:ring-yellow-400 transition-all p-3 text-sm  outline-none"
                rows={5}
                placeholder={`اكتب ملاحظتك حول الصفحة ${currentActualPageNum} هنا...`}
                value={currentPageData?.observation || ""}
                onChange={(e) => updateCurrentPageObservation(e.target.value)}
              />

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <BaseButton
                    type="submit"
                    disabled={!canSubmit}
                    isLoading={isSubmitting}
                    loadingText="جاري الحفظ..."
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white transition-colors rounded-full"
                  >
                    حفظ الملاحظة
                  </BaseButton>
                )}
              />
            </div>
          </DashboardCard>
        )}

        {/* <DashboardCard className="flex flex-col gap-4 @2xl:sticky @2xl:top-4 @2xl:col-span-4">
          <DashboardCardHeader title="قائمة المراجعة و المراقبة" />
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm  text-black">إجمالي الصفحات</span>
              <span className="text-sm  text-gray-500   rounded-md" dir="ltr">
                {totalPages} / {liveManuscript.numPages}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-black">صفحات بها ملاحظات/عيوب</span>
              <span className="text-sm text-red-600">
                {pagesWithObservationsCount}
              </span>
            </div>
          </div>
        </DashboardCard> */}

        {currentPageIndex >= totalPages &&
          totalPages > 0 &&
          liveManuscript.numPages === currentPageData?.id && (
            <DashboardCard className="bg-primary-50/50 border border-primary-200">
              <DashboardCardHeader
                title="الإجراءات"
                className="text-primary-500"
              />
              <div className="mt-6 flex flex-col gap-4">
                <form.Field
                  name="markAsCompleted"
                  children={(field) => {
                    const isChecked = field.state.value;
                    return (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between rounded-full border p-3 bg-white">
                          <Label
                            htmlFor={field.name}
                            className="text-sm font-medium cursor-pointer"
                          >
                            تحديد كمكتمل
                            <span className="block text-xs font-normal text-gray-500 mt-0.5">
                              الانتقال إلى المرحلة 4
                            </span>
                          </Label>
                          <Switch
                            id={field.name}
                            checked={isChecked}
                            onCheckedChange={field.handleChange}
                            className="data-[state=checked]:bg-primary-500"
                          />
                        </div>
                      </div>
                    );
                  }}
                />

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <div className="flex flex-col gap-3 mt-2">
                      <BaseButton
                        type="submit"
                        disabled={!canSubmit}
                        isLoading={isSubmitting}
                        loadingText="جاري الحفظ..."
                        className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors rounded-full"
                      >
                        حفظ التقدم
                      </BaseButton>

                      <BaseModal
                        title="رفض  المخطوطة"
                        description='هل أنت متأكد من رغبتك في رفض هذه  المخطوطة سيتم حفظ جميع ملاحظاتك والصفحات التي قمت بمراجعتها حتى الآن، ولكن سيتم تغيير حالة المخطوطة إلى "مرفوض".'
                        variant="alert"
                        onConfirm={handleReject}
                        isLoading={rejectLoading}
                        confirmText="رفض  المخطوطة"
                        trigger={
                          <BaseButton
                            type="button"
                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors rounded-full"
                          >
                            رفض المخطوطة
                          </BaseButton>
                        }
                      />
                    </div>
                  )}
                />
              </div>
            </DashboardCard>
          )}
      </div>
    </form>
  );
}
