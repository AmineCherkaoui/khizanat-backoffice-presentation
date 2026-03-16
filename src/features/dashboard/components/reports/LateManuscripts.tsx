import BaseButton from "@/components/common/base-button";
import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, ChevronLeft } from "lucide-react";

const getValidDate = (dateValue: string | Date | undefined): Date => {
  if (!dateValue) return new Date();

  if (dateValue instanceof Date) return dateValue;

  if (typeof dateValue === "string") {
    const parsedDate = new Date(dateValue);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }

    if (dateValue.includes("-")) {
      const parts = dateValue.split("-");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(`${year}-${month}-${day}`);
      }
    }
  }

  return new Date();
};

export function LateManuscriptsCard({
  manuscripts,
  selectedKhizana,
}: {
  manuscripts: any;
  selectedKhizana?: string;
}) {
  const lateManuscripts = manuscripts.filter((m: any) => {
    if (m.stepStatus === "مكتمل" || m.currentStep === 6) return false;

    if (!m.lastDigitalizationDate) return false;

    const lastDate = getValidDate(m.lastDigitalizationDate);
    const today = new Date();

    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 20;
  });

  const processingCount = lateManuscripts.filter(
    (m: any) => m.currentStep === 4,
  ).length;
  const reviewingCount = lateManuscripts.filter(
    (m: any) => m.currentStep === 5 || m.currentStep === 3,
  ).length;
  const indexingCount = lateManuscripts.filter(
    (m: any) => m.currentStep === 2,
  ).length;

  return (
    <DashboardCard>
      <DashboardCardHeader title="مخطوطات متأخرة" />
      <div className="flex gap-4 mt-4 flex-col @lg:flex-row">
        {/* ... باقي الكود الخاص بالواجهة يبقى كما هو بدون تغيير */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <div className="flex gap-2 items-center">
              <AlertTriangle className="size-10 text-red-500 bg-current/10 p-2 rounded-md" />
              <p className="text-3xl font-semibold flex items-baseline gap-1">
                {lateManuscripts.length}{" "}
                <span className="text-base font-normal">مخطوط</span>
              </p>
            </div>

            <p className="text-sm text-red-500 mt-2">
              عدد المخطوطات المتوقفة أكثر من 20 يوماً
            </p>
          </div>

          <Link
            to="/dashboard/manuscrits"
            search={{
              filter: "late",
              ...(selectedKhizana ? { khizana: selectedKhizana } : {}),
            }}
            className="w-full mt-4"
          >
            <BaseButton className="bg-primary-400 hover:bg-primary-500 rounded-xl w-full">
              <p className="flex items-center justify-center gap-4 w-full">
                <span>عرض التفاصيل</span>
                <ChevronLeft className="stroke-3" />
              </p>
            </BaseButton>
          </Link>
        </div>

        <div className="py-4 px-4 border rounded-lg border-red-500/20 flex-1 flex flex-col justify-between gap-2">
          <div className="flex justify-between items-center gap-2">
            <p className="text-sm">في مرحلة المعالجة</p>
            <p className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded-lg text-xs font-bold">
              {processingCount}
            </p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <p className="text-sm">في مرحلة المراجعة</p>
            <p className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded-lg text-xs font-bold">
              {reviewingCount}
            </p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <p className="text-sm">في مرحلة الرقمنة</p>
            <p className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded-lg text-xs font-bold">
              {indexingCount}
            </p>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
