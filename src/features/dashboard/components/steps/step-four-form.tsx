/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseButton from "@/components/common/base-button";
import { useState, type ChangeEvent } from "react";

import { BaseModal } from "@/components/common/base-modal"; // تم استيراد BaseModal
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
  Image as ImageIcon,
  Maximize2,
  MessageSquareWarning,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useStorage } from "../../store/useStorage";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userRoles, users } from "@/constants";

const currentUser = users[0];
const userRole = userRoles.find((u) => u.value === currentUser.role)?.label;

export default function StepFourForm({
  manuscript,
}: {
  manuscript: ManuscriptType;
}) {
  const navigate = useNavigate();
  const { updateManuscript } = useStorage();

  const [pages, setPages] = useState<any[]>(manuscript.pages || []);

  const pagesWithObservations = pages.filter(
    (page) => page?.observation && page?.observation.trim() !== "",
  );

  const totalPages = pagesWithObservations.length;
  const [currentPage, setCurrentPage] = useState(
    manuscript.lastReviewedImage || 1,
  );

  const [isRejecting, setIsRejecting] = useState(false);

  const currentPageData = pagesWithObservations[currentPage - 1];
  const originalPageNumber = currentPageData?.id || "-";

  const form = useForm({
    defaultValues: {
      markAsCompleted: manuscript.currentStep > 4,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedManuscript = {
        ...manuscript,
        logs: manuscript.logs?.map((log) => {
          if (log.id === "step-4") {
            if (value.markAsCompleted) {
              return {
                ...log,
                status: "completed",
                user: { name: currentUser.name, role: userRole },
                date: new Date().toISOString(),
                content: "تمت المعالجة النهائية بنجاح.",
              };
            } else {
              return {
                ...log,
                status: "pending",
                user: null,
                date: null,
                content: "في انتظار المعالجة النهائية .",
              };
            }
          }
          return log;
        }),
        pages: pages,
        lastReviewedImage: currentPage,
        currentStep: value.markAsCompleted ? 5 : 4,
        stepStatus: "قيد التنفيذ",
      };

      updateManuscript(updatedManuscript);

      form.reset();
      navigate({ to: ".." });

      if (value.markAsCompleted) {
        toast.success("تم حفظ التقدم و التنقل إلى المرحلة التالية بنجاح");
      } else {
        toast.success("تم حفظ تقدم الفحص بنجاح ");
      }
    },
  });

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    pageId: string | number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setPages((prevPages) =>
      prevPages.map((p) =>
        p.id === pageId ? { ...p, processedUrl: imageUrl } : p,
      ),
    );
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleReject = async () => {
    setIsRejecting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedManuscript = {
      ...manuscript,
      logs: manuscript.logs?.map((log) => {
        if (log.id === "step-4") {
          return {
            ...log,
            status: "rejected",
            user: { name: currentUser.name, role: userRole },
            date: new Date().toISOString(),
            content: "تم رفض المعالجة. يرجى مراجعة جودة الصور .",
          };
        }
        return log;
      }),
      currentStep: 4,
      pages: pages,
      stepStatus: "مرفوض",
    };

    updateManuscript(updatedManuscript);
    setIsRejecting(false);
    navigate({ to: ".." });
    toast.error("تم رفض المخطوطة وإيقاف تقدمها");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="grid grid-cols-1 gap-4 @5xl:grid-cols-12"
    >
      <div className="@5xl:col-span-8 gap-4 flex flex-col">
        <DashboardCard className="flex flex-col flex-1 min-h-[80dvh]">
          <DashboardCardHeader title={`مقارنة الصور`} />

          {totalPages === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquareWarning className="w-16 h-16 opacity-20 mb-4" />
              <p className="text-lg font-semibold">
                لا توجد صفحات بها ملاحظات للمراجعة
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 flex-col flex mt-4">
                <Tabs defaultValue="before">
                  <TabsList className="rounded-full w-full">
                    <TabsTrigger
                      value="before"
                      className="rounded-full font-bold"
                    >
                      قبل المعالجة
                    </TabsTrigger>
                    <TabsTrigger
                      value="after"
                      className="rounded-full font-bold"
                    >
                      بعد المعالجة
                    </TabsTrigger>
                  </TabsList>

                  <div className="bg-base-100 flex-1 rounded-lg border border-base-200 overflow-hidden relative">
                    <TabsContent
                      value="before"
                      className="h-full m-0 p-0 outline-none"
                    >
                      <div className="relative w-full h-full">
                        <ImageViewer
                          imageUrl={currentPageData?.url}
                          alt="الصورة قبل المعالجة"
                        />

                        <button
                          onClick={() => {
                            if (!currentPageData?.url) return;

                            const link = document.createElement("a");
                            link.href = currentPageData.url;
                            link.download = `${manuscript.title}-الصفحة ${currentPageData.id} قبل المعالجة`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          type="button"
                          className=" absolute top-4 right-4 z-10 font-bold cursor-pointer bg-white  text-sm shadow text-base-700 px-3 py-1.5 rounded-full transition-colors flex items-center gap-2"
                        >
                          <UploadCloud className="size-4" />
                          تحميل الصورة
                        </button>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="after"
                      className="h-full m-0 p-0 outline-none flex items-center justify-center"
                    >
                      {currentPageData?.processedUrl ? (
                        <div className="relative w-full h-full">
                          <ImageViewer
                            imageUrl={currentPageData.processedUrl}
                            alt="الصورة بعد المعالجة"
                          />
                          <div className="absolute top-4 right-4 z-10">
                            <Label
                              htmlFor={`re-upload-${currentPageData.id}`}
                              className="cursor-pointer bg-white font-bold  text-sm text-base-700 px-3 py-1.5 rounded-full shadow transition-colors flex items-center gap-2"
                            >
                              <UploadCloud className="size-4" />
                              تغيير الصورة
                            </Label>
                            <input
                              id={`re-upload-${currentPageData?.id}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(e, currentPageData?.id)
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[50dvh] text-gray-500 w-full">
                          <UploadCloud className="size-12 mb-4 text-primary-400" />
                          <Label
                            htmlFor={`upload-${currentPageData?.id}`}
                            className="cursor-pointer bg-primary-50 text-primary-700 border border-primary-200 px-6 py-2.5 rounded-full hover:bg-primary-100 transition-colors font-semibold"
                          >
                            رفع الصورة المعالجة الآن
                          </Label>
                          <input
                            id={`upload-${currentPageData?.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e, currentPageData?.id)
                            }
                          />
                        </div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 font-medium text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="size-4" />
                  <span>الصفحة السابقة</span>
                </button>

                <p className="text-black font-bold">
                  ملاحظة
                  <span dir="ltr" className="mx-1">
                    {currentPage} / {totalPages}
                  </span>
                </p>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-2 font-medium text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>الصفحة التالية</span>
                  <ChevronLeft className="size-4" />
                </button>
              </div>
            </>
          )}
        </DashboardCard>
      </div>

      <div className="flex flex-col gap-4 @5xl:sticky @5xl:top-4 @5xl:col-span-4">
        {totalPages > 0 && (
          <DashboardCard className="flex flex-col gap-4 bg-yellow-50/80  border-yellow-200 ">
            <DashboardCardHeader
              title={`ملاحظة حول الصفحة ${originalPageNumber}`}
            />
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex flex-row items-start gap-3 bg-white p-4 rounded-md border border-yellow-200">
                <div className="mt-0.5">
                  <MessageSquareWarning className="size-4 text-yellow-600" />
                </div>
                <p className="w-full text-black text-sm leading-relaxed whitespace-pre-wrap">
                  {currentPageData?.observation}
                </p>
              </div>
            </div>
          </DashboardCard>
        )}

        <DashboardCard className="flex flex-col gap-4 @2xl:sticky @2xl:top-4 border-base-200 bg-white">
          <DashboardCardHeader title="إحصائيات المراجعة" />
          <div className="mt-2 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-black">
                إجمالي الصفحات المخطوطة{" "}
              </span>
              <span className="text-sm  text-gray-500">
                {manuscript.pages?.length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-black">
                الصفحات التي تتطلب مراجعة
              </span>
              <span className="text-sm text-red-600">{totalPages}</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard className="bg-primary-50/50 border-[1.5px] border-primary-200">
          <DashboardCardHeader title="الإجراءات" className="text-primary-600" />
          <div className="mt-6 flex flex-col gap-3">
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
                          الانتقال إلى المرحلة 5
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
                    description='هل أنت متأكد من رغبتك في رفض هذه  المخطوطة؟ سيتم حفظ جميع ملاحظاتك والصفحات التي قمت بمراجعتها حتى الآن، ولكن سيتم تغيير حالة المخطوطة إلى "مرفوض".'
                    variant="alert"
                    onConfirm={handleReject}
                    isLoading={isRejecting}
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
      </div>
    </form>
  );
}

const ImageViewer = ({ imageUrl, alt }: { imageUrl?: string; alt: string }) => {
  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8 text-center h-[50vh] text-gray-400">
        <ImageIcon className="w-16 h-16 opacity-20" />
        <span className="text-lg font-semibold">{alt} غير متوفرة</span>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="relative group w-full h-full flex items-center justify-center min-h-[50vh] max-h-[60vh] cursor-zoom-in outline-none bg-gray-50/50"
        >
          <img
            src={imageUrl}
            alt={alt}
            className="object-contain w-full h-full transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="size-12 text-white drop-shadow-md" />
          </div>
        </button>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50" />
        <DialogContent
          showCloseButton={false}
          className="max-w-5xl p-1 flex flex-col justify-center items-center bg-transparent border-none shadow-none"
        >
          <img
            src={imageUrl}
            alt={alt}
            className="object-contain w-full h-full rounded-md"
          />
        </DialogContent>
        <DialogClose asChild>
          <button className="fixed top-4 right-4 z-[9999] bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
            <X className="size-6 text-base-800" />
          </button>
        </DialogClose>
      </DialogPortal>
    </Dialog>
  );
};
