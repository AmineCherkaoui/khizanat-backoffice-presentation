// @ts-nocheck
import BaseButton from "@/components/common/base-button";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { AnimatedProgressBar } from "@/components/motion/animated-progressbar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { khizanat, users } from "@/constants";
import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { KhizanaSelect } from "@/features/dashboard/components/khizana-select";
import { LateManuscriptsCard } from "@/features/dashboard/components/reports/LateManuscripts";
import ResponsiveLineChart from "@/features/dashboard/components/reports/responsive-charts";
import { useStorage } from "@/features/dashboard/store/useStorage";
import { getManuscriptStats } from "@/features/dashboard/utils/manuscriptStats";
import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle,
  Clock,
  Download,
  Printer,
  Scroll,
  Settings,
} from "lucide-react";
import { useMemo } from "react";

const userReports = users.slice(0, 5).map((user) => {
  const performance = Math.floor(Math.random() * 101);
  return {
    name: user.name,
    avgDuration: Math.floor(Math.random() * 5) + 2,
    manuscripts: Math.floor(Math.random() * 10) + 1,
    performance,
  };
});

export const Route = createFileRoute("/(app)/dashboard/reports/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { manuscripts } = useStorage();

  // FILTER
  const form = useForm({
    defaultValues: {
      khizana: "",
    },
  });
  const formValues = useStore(form.store, (state) => state.values);
  const filteredManuscripts = useMemo(() => {
    const selectedKhizana = formValues.khizana?.value;

    if (!selectedKhizana) {
      return manuscripts;
    }

    return manuscripts.filter((m) => m.storageLocation === selectedKhizana);
  }, [manuscripts, formValues]);

  const realTotal = useMemo(() => {
    const selectedKhizanaValue = formValues.khizana?.value;

    if (selectedKhizanaValue) {
      const selected = khizanat.find((k) => k.value === selectedKhizanaValue);
      return selected?.totalOfManuscript || 0;
    }

    return khizanat.reduce(
      (acc, khizana) => acc + (khizana.totalOfManuscript || 0),
      0,
    );
  }, [khizanat, formValues.khizana]);

  const {
    digitalizationEvolution,

    stepsDistribution,
    generalStats,
  } = getManuscriptStats(filteredManuscripts);

  return (
    <>
      <DashboardHeader title="تقارير و بيانات سير العمل">
        <div className="flex gap-4 flex-col-reverse @lg:flex-row transition-all">
          <form.Field
            name="khizana"
            children={(field) => (
              <KhizanaSelect
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
              />
            )}
          />
          <BaseButton
            icon={<Download />}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <span>تصدير التقارير</span>
          </BaseButton>
        </div>
      </DashboardHeader>

      <section className="grid grid-cols-1 gap-4 @xl:grid-cols-4 @5xl:grid-cols-12 ">
        <DashboardCard className="@xl:col-span-full @5xl:col-span-3 @5xl:row-span-2 p-2">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1  gap-2">
              <div className="flex flex-col border p-4 rounded-lg bg-blue-100 col-span-full">
                <Scroll className="size-10 bg-current/10 text-blue-500 p-2 rounded" />
                <AnimatedNumber
                  value={realTotal}
                  className="font-bold text-lg text-base-800"
                />
                <p className="text-xs">إجمالي المخطوطات</p>
              </div>

              <div className="flex flex-col border p-4 rounded-lg bg-base-100">
                <Clock className="size-10 bg-current/10 text-yellow-500 p-2 rounded" />
                <AnimatedNumber
                  className="font-bold text-2xl text-base-800"
                  value={generalStats.inCataloging}
                />
                <p className="text-xs">تم الفهرسة</p>
              </div>

              <div className="flex flex-col border p-4 rounded-lg bg-base-100">
                <Printer className="size-10 bg-current/10 text-purple-500 p-2 rounded" />
                <AnimatedNumber
                  className="font-bold text-2xl text-base-800"
                  value={generalStats.digitalized}
                />
                <p className="text-xs">تم رقمنتها</p>
              </div>

              <div className="flex flex-col border p-4 rounded-lg bg-base-100">
                <CheckCircle className="size-10 bg-current/10 text-green-500 p-2 rounded" />
                <AnimatedNumber
                  className="font-bold text-2xl text-base-800"
                  value={generalStats.completed}
                />
                <p className="text-xs">تم نشرها</p>
              </div>

              <div className="flex flex-col border p-4 rounded-lg bg-base-100">
                <Settings className="size-10 bg-current/10 text-red-500 p-2 rounded" />
                <AnimatedNumber
                  className="font-bold text-2xl text-base-800"
                  value={generalStats.underMaintenance}
                />
                <p className="text-xs">قيد الصيانة</p>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard className=" @xl:col-span-full @5xl:col-span-9 p-4">
          <DashboardCardHeader title="التطور الشهري للرقمنة" />
          <div className="mt-6">
            <ResponsiveLineChart
              data={digitalizationEvolution}
              xAxisKey="name"
              dataKey="value"
              color="#0095ff"
            />
          </div>
        </DashboardCard>

        <DashboardCard className="@xl:col-span-full @5xl:col-span-3">
          <DashboardCardHeader title="تطور الإنجاز السنوي" />
          <ScrollArea
            type="always"
            className="border rounded-xl border-base-300 mt-4 w-full"
          >
            <table className="w-full text-nowrap">
              <thead className="text-xs font-bold text-green-700 border-b border-base-300">
                <tr>
                  <th className="p-3 text-start">اسم الموظف</th>
                  <th className="p-3 text-start">عدد المخطوطات</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {userReports.map((user, index) => {
                  return (
                    <tr
                      key={index}
                      className="not-last:border-b border-base-300 hover:bg-base-100 transition-colors duration-200"
                    >
                      <td className="p-3 font-semibold text-base-700">
                        {user.name}
                      </td>

                      <td className="p-3">{user.manuscripts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <ScrollBar
              orientation="horizontal"
              className="[&>div]:bg-primary-500/50  "
            />
          </ScrollArea>
        </DashboardCard>

        <div className="flex flex-col gap-2 @xl:col-span-full @5xl:col-span-6">
          <DashboardCard>
            <DashboardCardHeader title="تقدم نشر المخطوطات" />
            <div className="mt-4">
              {(() => {
                const completed = generalStats.completed || 0;
                const remaining = Math.max(0, realTotal - completed);
                const percentage =
                  realTotal > 0 ? Math.round((completed / realTotal) * 100) : 0;

                return (
                  <>
                    <AnimatedProgressBar
                      current={completed}
                      total={realTotal === 0 ? 1 : realTotal}
                      className="text-primary-500"
                      barClassName="bg-primary-500"
                    />
                    <p className="text-xs mt-1 text-base-500 font-medium">
                      <span className="text-primary-600 font-bold">
                        {percentage}%
                      </span>{" "}
                      مكتمل – المتبقي {remaining} مخطوطة من أصل {realTotal}
                    </p>
                  </>
                );
              })()}
            </div>
          </DashboardCard>

          <LateManuscriptsCard
            manuscripts={filteredManuscripts}
            selectedKhizana={formValues.khizana?.value}
          />
        </div>
      </section>
    </>
  );
}
