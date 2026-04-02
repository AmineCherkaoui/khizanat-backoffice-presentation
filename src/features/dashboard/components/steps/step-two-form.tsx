/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseButton from "@/components/common/base-button";
import { AnimatedProgressBar } from "@/components/motion/animated-progressbar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { userRoles, users } from "@/constants";
import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import { cn, sleep } from "@/lib/utils";
import type { ManuscriptType } from "@/types/common";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useStorage } from "../../store/useStorage";
import ManuscriptIndividualUpload from "../manuscripts/ManuscriptIndividualUpload";

const parseSize = (sizeStr: string) => {
  const match = sizeStr?.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
};

const currentUser = users[0];
const userRole = userRoles.find((u) => u.value === currentUser.role)?.label;

export default function StepTwoForm({
  manuscript,
}: {
  manuscript: ManuscriptType;
}) {
  const { updateManuscript, manuscripts } = useStorage();
  const navigate = useNavigate();

  // Always read live data from the store
  const liveManuscript =
    manuscripts.find((m) => m.id === manuscript.id) ?? manuscript;

  const totalSizeMB =
    liveManuscript.pages?.reduce(
      (acc: number, page: any) => acc + parseSize(page?.size),
      0,
    ) || 0;

  const isUploadComplete =
    (liveManuscript.pages?.length || 0) >= liveManuscript.numPages;
  const progressPercentage = Math.floor(
    ((liveManuscript?.pages?.length || 0) / liveManuscript.numPages) * 100,
  );

  const completedForm = useForm({
    defaultValues: {
      markAsCompleted: manuscript.currentStep > 2,
    },
    onSubmit: async ({ value }) => {
      await sleep(1000);
      const latestManuscript = manuscripts.find((m) => manuscript.id === m.id);

      const updatedManuscript = {
        ...latestManuscript,
        logs: manuscript.logs?.map((log) => {
          if (log.id === "step-2") {
            if (value.markAsCompleted) {
              return {
                ...log,
                status: "completed",
                user: {
                  name: currentUser.name,
                  role: userRole,
                },
                date: new Date().toISOString(),
                content: "اكتملت عملية الرقمنة بنجاح.",
              };
            } else {
              return {
                ...log,
                status: "pending",
                user: null,
                date: null,
                content: "في انتظار بدء عملية التصوير الضوئي.",
              };
            }
          }
          return log;
        }),
        lastDigitalizationDate: new Date(),
        currentStep: value.markAsCompleted ? 3 : 2,
        stepStatus: "قيد التنفيذ",
      };

      updateManuscript(updatedManuscript);

      if (value.markAsCompleted) {
        toast.success("تم حفظ التقدم و التنقل إلى المرحلة التالية بنجاح");
      } else {
        toast.success("تم حفظ  بنجاح ");
      }

      navigate({ to: ".." });
    },
  });

  return (
    <div className="grid grid-cols-1 gap-4 @5xl:grid-cols-12">
      <div className="flex flex-col gap-4 @5xl:col-span-8">
        <DashboardCard>
          <DashboardCardHeader title="تحميل صفحات المخطوطة" />
          {isUploadComplete && (
            <div className="w-full p-4 border mt-4 rounded bg-green-50 text-center text-sm font-medium text-green-700">
              تم اكتمال رفع جميع الصفحات المطلوبة ({manuscript.numPages})
            </div>
          )}
          <ManuscriptIndividualUpload manuscript={liveManuscript} />
        </DashboardCard>
      </div>

      <div className="flex flex-col gap-4 max-h-fit @5xl:sticky @5xl:top-16 @5xl:col-span-4">
        <DashboardCard>
          <DashboardCardHeader title="تقدم الرقمنة" />
          <div className="mt-4">
            <div className="flex flex-col gap-2">
              <AnimatedProgressBar
                key="scanned-pages"
                barClassName="bg-primary-500"
                current={liveManuscript?.pages?.length || 0}
                total={liveManuscript.numPages}
                label="الصفحات الممسوحة"
              />
              <p className="text-sm text-muted-foreground">
                {progressPercentage}% ممسوحة
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
              <StatRow
                label="الحجم الإجمالي"
                value={`${totalSizeMB.toFixed(2)} MB`}
              />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard className="bg-primary-50/50 border border-primary-200">
          <DashboardCardHeader title="الإجراءات" className="text-primary-500" />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              completedForm.handleSubmit();
            }}
            className="mt-6 flex flex-col gap-6"
          >
            <completedForm.Field
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
                        <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                          الانتقال إلى المرحلة 3
                        </span>
                      </Label>
                      <Switch
                        id={field.name}
                        checked={isChecked}
                        onCheckedChange={field.handleChange}
                        className="data-[state=checked]:bg-primary-500"
                      />
                    </div>
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                );
              }}
            />

            <completedForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <BaseButton
                  type="submit"
                  disabled={!canSubmit}
                  isLoading={isSubmitting}
                  loadingText="جاري الحفظ..."
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full"
                >
                  {manuscript.currentStep > 2 ? "تحديث" : "حفظ"}
                </BaseButton>
              )}
            />
          </form>
        </DashboardCard>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-black">{label}</span>
      <span className="text-sm text-base-500" dir="ltr">
        {value}
      </span>
    </div>
  );
}

function FieldError({
  errors,
  className,
}: {
  errors: any;
  className?: string;
}) {
  if (errors.length > 0) {
    return (
      <p
        className={cn(
          "text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1",
          className,
        )}
      >
        {errors.map((err: any) => err.message ?? err).join(", ")}
      </p>
    );
  }
  return null;
}
