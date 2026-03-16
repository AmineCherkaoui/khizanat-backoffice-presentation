import BaseButton from "@/components/common/base-button";
import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import { Check, X } from "lucide-react";

import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { userRoles, users } from "@/constants";
import { formatDate, getDaysBetween } from "@/lib/date";
import { cn, sleep } from "@/lib/utils";
import type { ManuscriptType } from "@/types/common";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useStorage } from "../../store/useStorage";

const currentUser = users[0];
const userRole = userRoles.find((u) => u.value === currentUser.role)?.label;
export default function StepFiveForm({
  manuscript,
}: {
  manuscript: ManuscriptType;
}) {
  const navigate = useNavigate();
  const { updateManuscript } = useStorage();

  const form = useForm({
    defaultValues: {
      markAsCompleted: manuscript.currentStep > 5,
    },
    onSubmit: async ({ value }) => {
      await sleep(1000);

      const updatedManuscript = {
        ...manuscript,
        logs: value.markAsCompleted
          ? [
              ...(manuscript.logs ?? []),
              {
                id: crypto.randomUUID(),
                title: "تمت الرقمنة",
                user: {
                  name: currentUser.name,
                  role: userRole,
                },
                date: new Date(),
              },
            ]
          : (manuscript.logs ?? []),
        lastDigitalizationDate: new Date(),
        currentStep: value.markAsCompleted ? 6 : 5,
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

  const areAllStepsCompleted =
    manuscript.logs &&
    manuscript.logs.length > 0 &&
    manuscript.logs.every((log) => log.status === "completed");

  // const [isRejecting, setIsRejecting] = useState(false);
  // const handleReject = async () => {
  //   setIsRejecting(true);
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   const updatedManuscript = {
  //     ...manuscript,
  //     logs: [
  //       ...(manuscript.logs ?? []),
  //       {
  //         id: crypto.randomUUID(),
  //         title: "تم رفض الرقمنة",
  //         user: {
  //           name: currentUser.name,
  //           role: userRole,
  //         },
  //         date: new Date(),
  //       },
  //     ],
  //     lastDigitalizationDate: new Date(),
  //     stepStatus: "مرفوض",
  //   };

  //   updateManuscript(updatedManuscript);
  //   setIsRejecting(false);
  //   navigate({ to: ".." });
  //   toast.error("تم رفض المخطوطة");
  // };

  // const { qrRef, download: qrDownload } = useQRCodeDownload(
  //   `QR-${manuscript.id}`,
  // );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 @5xl:grid-cols-12">
        <div className=" gap-4 flex flex-col @5xl:sticky @5xl:top-16 @5xl:col-span-8 h-fit">
          <DashboardCard>
            <DashboardCardHeader title="ملخص  المخطوطة" />
            <div className="flex flex-col sm:flex-row w-100 justify-between mt-2 gap-y-6 sm:gap-y-0">
              <section className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium text-gray-900">
                    عنوان المخطوطة
                  </p>
                  <p className="text-sm text-gray-500">{manuscript?.title}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium text-gray-900">المؤلف</p>
                  <p className="text-sm text-gray-500">{manuscript?.author}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium text-gray-900">
                    تاريخ الإنشاء
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate({ date: manuscript?.releaseDate })}
                  </p>
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium text-gray-900">
                    عدد الصفحات الكلي
                  </p>
                  <p className="text-sm text-gray-500">
                    {manuscript?.numPages}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium text-gray-900">
                    نوع الخط
                  </p>
                  <p className="text-sm text-gray-500">
                    {manuscript?.fontType}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium text-gray-900">
                    حالة المخطوطة
                  </p>
                  <p className="text-sm text-gray-500">
                    {manuscript?.manuscriptStatus}
                  </p>
                </div>
              </section>
            </div>
          </DashboardCard>

          <DashboardCard>
            <DashboardCardHeader title="سجل المراجعة" />
            <ScrollArea className="h-128 mt-4 pr-4" type="always">
              <div className="flex flex-col gap-4 relative">
                {manuscript.logs.map((log) => {
                  const isCompleted = log.status === "completed";
                  const isRejected = log.status === "rejected";
                  const isPending = !isCompleted && !isRejected;

                  return (
                    <div
                      key={log.id}
                      className={cn(
                        "relative flex flex-col gap-3 p-5 rounded-xl border transition-all",
                        isCompleted && "bg-white border-success/20 shadow-xs",
                        isRejected &&
                          "bg-red-700/5 border-red-700/20 shadow-xs",
                        isPending && "bg-base-50/50 border-base-200 opacity-75",
                      )}
                    >
                      <div className="flex flex-col @sm:flex-row @sm:items-start @sm:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className={cn(
                                "text-base font-bold transition-colors",
                                isCompleted && "text-base-900",
                                isRejected && "text-red-700",
                                isPending && "text-base-500",
                              )}
                            >
                              {isCompleted && "تمت "}
                              {isRejected && "فشل "}
                              {log.title}
                            </h4>
                          </div>

                          {log.user ? (
                            <p className="text-xs text-base-500 mt-1">
                              بواسطة{" "}
                              <span className="font-semibold text-base-700">
                                {log.user.name}
                              </span>{" "}
                              ({log.user.role})
                            </p>
                          ) : (
                            <p className="text-xs text-base-400 mt-1 italic">
                              لم يتم البدء بعد
                            </p>
                          )}
                        </div>

                        {log.date && (
                          <time
                            className={cn(
                              "text-xs font-mono px-2.5 py-1 rounded-full font-bold",
                              isCompleted && "text-success bg-success/5",
                              isRejected && "text-red-700 bg-red-700/5",
                              isPending && "text-base-400 bg-base-100",
                            )}
                          >
                            {formatDate({
                              date: log.date,
                              format: "HH:mm dd/MM/yyyy",
                            })}
                          </time>
                        )}
                      </div>

                      <div
                        className={cn(
                          "text-sm leading-relaxed",
                          isCompleted && "text-base-600",
                          isRejected && "text-red-700/80",
                          isPending && "text-base-400",
                        )}
                      >
                        {log?.content}
                      </div>
                    </div>
                  );
                })}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </DashboardCard>
        </div>

        <div className="flex flex-col gap-4 @5xl:sticky @5xl:top-16 @5xl:col-span-4 h-fit">
          {/* <DashboardCard>
            <DashboardCardHeader title="إنشاء رمز الإستجابة السريعة" />
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-center w-full min-h-52 border border-grey-500 rounded-md">
                <div ref={qrRef} className="rounded-xl bg-primary-50 p-1">
                  <QRCodeCanvas
                    value={`QR-${manuscript.id}`}
                    size={180}
                    bgColor="transparent"
                    marginSize={1}
                    level="H"
                    imageSettings={{
                      src: "/images/logo.png",
                      height: 32,
                      width: 32,
                      excavate: true,
                    }}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className=" w-full rounded-md py-1 px-4 text-sm text-base-700 bg-base-100 border">
                <p>QR-{manuscript.id}</p>
              </div>

              <BaseButton
                className="bg-transparent border text-base-800 hover:bg-base-50"
                icon={<Download />}
                onClick={qrDownload}
              >
                تنزيل رمز الإستجابة السريعة
              </BaseButton>
            </div>
          </DashboardCard> */}

          <DashboardCard>
            <DashboardCardHeader title="ملخص التحقق" />
            <div className="mt-4">
              {areAllStepsCompleted ? (
                <div className="flex justify-between">
                  <span className="text-sm font-sm text-green-700">
                    جميع الخطوات مكتملة
                  </span>
                  <span className="text-green-700">
                    <Check className="size-4" />
                  </span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-sm font-sm text-red-700">
                    جميع الخطوات مكتملة
                  </span>
                  <span className="text-red-700">
                    <X className="size-4" />
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm  text-black">إجمالي الصفحات</span>
                  <span className="text-sm text-grey-600">
                    {manuscript.pages?.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm  text-black">أنجز في</span>
                  <span className="text-sm text-grey-600">
                    {getDaysBetween(
                      manuscript.firstDigitalizationDate,
                      manuscript.lastDigitalizationDate,
                    ) + 1}{" "}
                    أيام
                  </span>
                </div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard className="bg-primary-50/50 border-[1.5px] border-primary-200">
            <DashboardCardHeader
              title="الإجراءات"
              className="text-primary-600"
            />
            <div className="mt-6 flex flex-col gap-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
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

                      {/* <BaseModal
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
                      /> */}
                    </div>
                  )}
                />
              </form>
            </div>
          </DashboardCard>
        </div>
      </div>
    </>
  );
}
