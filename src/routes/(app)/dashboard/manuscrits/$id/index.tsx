/* eslint-disable @typescript-eslint/no-explicit-any */
import Badge, { type BadgeVariant } from "@/components/common/badge";
import { khizanat, STEPS } from "@/constants";
import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { getManuscripts } from "@/features/dashboard/store/useStorage";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { ManuscriptStatus, TaskStatus } from "@/types/common";
import {
  createFileRoute,
  Link,
  notFound,
  useCanGoBack,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import { Check, MoveLeft } from "lucide-react";
import { motion } from "motion/react";

const badgeVariant: Record<TaskStatus | ManuscriptStatus, BadgeVariant> = {
  "قيد التنفيذ": "info",
  معلق: "warning",
  مكتمل: "success",
  جيدة: "success",
  متوسطة: "warning",
  ضعيفة: "danger",
  مرفوض: "danger",
};

export const Route = createFileRoute("/(app)/dashboard/manuscrits/$id/")({
  component: RouteComponent,
  loader: ({ params }) => {
    const { manuscripts } = getManuscripts();

    const manuscript = manuscripts?.find((m) => m.id === params.id);

    if (!manuscript) {
      throw notFound();
    }

    return manuscript;
  },
});

function RouteComponent() {
  const manuscript = useLoaderData({ from: Route.id });
  const storageLocation = khizanat?.find(
    (k) => k?.value === manuscript?.storageLocation,
  )?.label;

  const canGoBack = useCanGoBack();
  const router = useRouter();

  return (
    <>
      <DashboardHeader
        className="flex-row items-start justify-between"
        title={manuscript.title}
        description={manuscript.id}
      >
        {canGoBack && (
          <button
            className="inline-flex gap-2 px-4 bg-white cursor-pointer  rounded py-0.5 text-sm border-2 border-blue-500 text-blue-500"
            onClick={() => router.history.back()}
          >
            <span>الرجوع</span>
            <MoveLeft />
          </button>
        )}
      </DashboardHeader>
      <div className="grid grid-cols-1 gap-4 @4xl:grid-cols-12">
        <DashboardCard className="@4xl:col-span-8 @4xl:h-fit @4xl:sticky @4xl:top-4">
          <DashboardCardHeader
            title="معلومات  المخطوطة"
            className="text-primary-500"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 @5xl:grid-cols-4 mt-6 gap-8"
          >
            <div className="flex  flex-col gap-8">
              <div>
                <p className="font-semibold text-sm text-base-700">
                  عنوان المخطوطة
                </p>
                <p className="text-sm text-base-500">{manuscript.title}</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-base-700">المؤلف</p>
                {manuscript.author ? (
                  <p className="text-sm text-base-500">{manuscript.author}</p>
                ) : (
                  <Badge>غير محدد</Badge>
                )}
              </div>

              <div>
                <p className="font-semibold text-sm text-base-700">
                  اسم الناسخ
                </p>
                {manuscript.scribe ? (
                  <p className="text-sm text-base-500">{manuscript.scribe}</p>
                ) : (
                  <Badge>غير محدد</Badge>
                )}
              </div>

              <div>
                <p className="font-semibold text-sm text-base-700">
                  عدد الصفحات الكلي
                </p>
                <p className="text-sm text-base-500">
                  {manuscript.numPages} صفحة
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <p className="font-semibold text-sm text-base-700">
                  مكان الحفظ
                </p>
                <p className="text-sm text-base-500">{storageLocation}</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-base-700">
                  تاريخ الإشاء
                </p>
                <p className="text-sm text-base-500">
                  {formatDate({ date: manuscript.releaseDate })}
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm text-base-700">نوع الخط</p>
                <p className="text-sm text-base-500">{manuscript.fontType}</p>
              </div>

              <div>
                <p className="font-semibold text-sm text-base-700">
                  التصنيف العلمي المجالي
                </p>
                <p className="text-sm text-base-500">
                  {manuscript.classification}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <p className="font-semibold text-sm text-base-700">
                  تاريخ أول رقمنة
                </p>
                <p className="text-sm text-base-500">
                  {formatDate({ date: manuscript.firstDigitalizationDate })}
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm text-base-700">
                  تاريخ آخر رقمنة
                </p>
                <p className="text-sm text-base-500">
                  {formatDate({ date: manuscript.lastDigitalizationDate })}
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm text-base-700">الحالة</p>
                <p className="text-sm text-base-500">
                  <Badge
                    variant={badgeVariant[manuscript.stepStatus as TaskStatus]}
                  >
                    {manuscript.stepStatus}
                  </Badge>
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm text-base-700">
                  حالة المخطوطة
                </p>
                <p className="text-sm text-base-500">
                  <Badge
                    variant={
                      badgeVariant[manuscript.manuscriptStatus as TaskStatus]
                    }
                  >
                    {manuscript.manuscriptStatus}
                  </Badge>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <p className="font-semibold text-sm text-base-700">الوعاء</p>
                <p className="text-sm text-base-500">{manuscript.material} </p>
              </div>
              <div>
                <p className="font-semibold text-sm text-base-700">المسطرة</p>
                <p className="text-sm text-base-500">
                  {manuscript.linesPerPage}
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm text-base-700">المقياس</p>
                <p className="text-sm text-base-500">{manuscript.dimensions}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 @5xl:grid-cols-2 col-span-full">
              <div>
                <p className="font-semibold text-sm text-base-700">أوله</p>
                <p className="text-sm text-base-500">{manuscript.startsWith}</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-base-700">آخره</p>
                <p className="text-sm text-base-500">{manuscript.endsWith}</p>
              </div>
            </div>
          </motion.div>
        </DashboardCard>

        <DashboardCard className="@4xl:col-span-4">
          <DashboardCardHeader
            title="مراحل تقدم  العمل"
            className="text-primary-500"
          />
          <div className="mt-8 relative border-s-2 ms-4 ps-8 flex flex-col gap-8">
            {STEPS.map((step, index) => {
              const isDisabled = manuscript.currentStep < +step.id;

              return (
                <Link
                  key={step.id}
                  to={`/dashboard/manuscrits/$id/${step.to}`}
                  params={{ id: manuscript.id }}
                  disabled={isDisabled}
                  className={cn(isDisabled && "pointer-events-none opacity-50")}
                >
                  <StepItem
                    step={step}
                    index={index}
                    manuscript={manuscript}
                    badgeVariant={badgeVariant}
                  />
                </Link>
              );
            })}
          </div>
        </DashboardCard>
      </div>
    </>
  );
}

// StepItem.tsx

interface StepItemProps {
  step: any;
  index: number;
  manuscript: any;
  badgeVariant: Record<string, any>;
}

export function StepItem({
  step,
  index,
  manuscript,
  badgeVariant,
}: StepItemProps) {
  const stepId = +step.id;

  const isCompleted =
    manuscript.currentStep > stepId ||
    (manuscript.stepStatus === "مكتمل" && manuscript.currentStep >= stepId);

  const isCurrent = manuscript.currentStep === stepId;

  const circleClass = cn(
    "absolute -start-3.5 p-1 bg-white border rounded-full",
    isCurrent && "border-blue-500 text-blue-500 border-2",
    isCompleted && "bg-blue-500 text-white",
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.05 * index }}
      viewport={{ once: true }}
    >
      <p className={circleClass}>
        {isCompleted ? (
          <Check className="size-4 stroke-4" />
        ) : (
          <span className="size-4 flex items-center justify-center font-mono">
            {step.id}
          </span>
        )}
      </p>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold">{step.title}</p>
          <p className="text-xs">{step.worker}</p>
        </div>

        {isCurrent && (
          <Badge
            variant={
              badgeVariant[manuscript.stepStatus as TaskStatus] ?? "default"
            }
          >
            {manuscript.stepStatus}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}
