// @ts-nocheck
import Badge from "@/components/common/badge";
import BaseButton from "@/components/common/base-button";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { AnimatedProgressBar } from "@/components/motion/animated-progressbar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { users } from "@/constants";
import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { KhizanaSelect } from "@/features/dashboard/components/khizana-select";
import ResponsiveLineChart from "@/features/dashboard/components/reports/responsive-charts";
import { useStorage } from "@/features/dashboard/store/useStorage";
import { getManuscriptStats } from "@/features/dashboard/utils/manuscriptStats";
import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  Clock,
  Download,
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

  const {
    digitalizationEvolution,

    stepsDistribution,
    generalStats,
  } = getManuscriptStats(filteredManuscripts);

  return (
    <>
      <DashboardHeader
        title="تقارير و بيانات سير العمل"
        description="لعرض الموظفين وتوزيع مهامهم"
      >
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

      <section className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @5xl:grid-cols-12 ">
        <DashboardCard className=" @5xl:col-span-3 p-2">
          <div className="grid grid-cols-1 @md:grid-cols-2 gap-2 h-full">
            <div className="flex flex-col border p-4 rounded-lg bg-blue-800 text-base-50">
              <p className="text-xs font-bold">المخطوطات المعالجة</p>
              <AnimatedNumber value={920} className="font-bold text-lg " />
              <p className="text-[10px] mt-auto text-current/70">
                مخطوطة تمت معالجتها{" "}
              </p>
            </div>

            <div className="flex flex-col border p-4 rounded-lg bg-radial from-blue-50 to-blue-200 text-blue-700">
              <p className="text-xs font-bold">صفحة محسّنة</p>
              <AnimatedNumber value={507} className="font-bold text-lg " />
              <p className="text-[10px] mt-auto text-current/70">
                صفحة تم تحسينها
              </p>
            </div>

            <div className="flex flex-col border p-4 rounded-lg bg-radial from-blue-50 to-blue-200 text-blue-700">
              <p className="text-xs font-bold">مخطوطة مُحقَّقة</p>
              <AnimatedNumber value={420} className="font-bold text-lg " />
              <p className="text-[10px] mt-auto text-current/70">
                المخطوطات المُحقَّقة
              </p>
            </div>

            <div className="flex flex-col border p-4 rounded-lg bg-radial from-blue-50 to-blue-200 text-blue-700">
              <p className="text-xs font-bold">خطأ مصحح</p>
              <AnimatedNumber value={114} className="font-bold text-lg " />
              <p className="text-[10px] mt-auto text-current/70">
                المخطوطات المصححة
              </p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard className="@5xl:col-span-3 p-2">
          <div className="grid grid-cols-1 @md:grid-cols-2 gap-2">
            <div className="flex flex-col border p-4 rounded-lg bg-base-100">
              <Scroll className="size-10 bg-current/10 text-blue-500 p-2 rounded" />
              <AnimatedNumber
                value={generalStats.total}
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
              <p className="text-xs">قيد الفهرسة</p>
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
        </DashboardCard>

        <DashboardCard className=" @xl:col-span-full @5xl:col-span-6 p-4">
          <Tabs defaultValue="digitalizationEvolution" className="w-full">
            <TabsList className="w-full rounded-full">
              <TabsTrigger
                className="data-[state=active]:text-blue-500 rounded-full"
                value="digitalizationEvolution"
              >
                التطور الشهري للرقمنة
              </TabsTrigger>
              <TabsTrigger
                className="rounded-full data-[state=active]:text-blue-500"
                value="stepsDistribution"
              >
                توزيع المخطوطات حسب المرحلة
              </TabsTrigger>
            </TabsList>
            <TabsContent
              className="h-60 @5xl:h-full"
              value="digitalizationEvolution"
            >
              <ResponsiveLineChart
                data={digitalizationEvolution}
                xAxisKey="name"
                dataKey="value"
                color="#0095ff"
              />
            </TabsContent>
            <TabsContent value="stepsDistribution" className="h-60 @5xl:h-full">
              <ResponsiveLineChart
                data={stepsDistribution}
                xAxisKey="name"
                dataKey="value"
                color="#0095ff"
              />
            </TabsContent>
          </Tabs>
        </DashboardCard>

        <DashboardCard className="@xl:col-span-full @5xl:col-span-6">
          <DashboardCardHeader title="تطور الإنجاز السنوي" />
          <ScrollArea
            type="always"
            className="border rounded-xl border-base-300 mt-4 w-full"
          >
            <table className="w-full text-nowrap">
              <thead className="text-xs font-bold text-green-700 border-b border-base-300">
                <tr>
                  <th className="p-3 text-start">اسم الموظف</th>
                  <th className="p-3 text-start">متوسط مدة الإنجاز</th>
                  <th className="p-3 text-start">عدد المخطوطات</th>
                  <th className="p-3 text-start">نسبة الأداء</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {userReports
                  .sort((a, b) => b.performance - a.performance)
                  .map((emp, index) => {
                    let variant: BadgeVariant = "default";
                    let label = `${emp.performance}%`;

                    if (emp.performance >= 75) {
                      variant = "success";
                      label = `مرتفع (${emp.performance}%)`;
                    } else if (emp.performance >= 40) {
                      variant = "warning";
                      label = `متوسط (${emp.performance}%)`;
                    } else {
                      variant = "danger";
                      label = `منخفض (${emp.performance}%)`;
                    }

                    return (
                      <tr
                        key={index}
                        className="not-last:border-b border-base-300 hover:bg-base-100 transition-colors duration-200"
                      >
                        <td className="p-3 font-semibold text-base-700">
                          {emp.name}
                        </td>
                        <td className="p-3">{emp.avgDuration} أيام</td>
                        <td className="p-3">{emp.manuscripts}</td>
                        <td className="p-3">
                          <Badge variant={variant}>{label}</Badge>
                        </td>
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
              <AnimatedProgressBar
                current={812}
                total={1200}
                className="text-primary-500"
                barClassName="bg-primary-500"
              />
              <p className="text-xs mt-1">67% مكتمل – المتبقي 388 مخطوطة</p>
            </div>
          </DashboardCard>

          <DashboardCard>
            <DashboardCardHeader title="مخطوطات متأخرة" />
            <div className="flex gap-4 mt-4 flex-col @lg:flex-row">
              <div className="flex flex-col">
                <div className="flex gap-2">
                  <AlertTriangle className="size-10 text-red-500 bg-current/10 p-2 rounded-md" />
                  <p className="text-3xl font-semibold">
                    23 <span className="text-base">مخطوط</span>
                  </p>
                </div>

                <p className="text-sm text-red-500">
                  عدد المخطوطات المتوقفة أكثر من 20 أيام
                </p>

                <BaseButton className="bg-primary-400 hover:bg-primary-500 mt-4 rounded-xl">
                  <p className="flex items-center gap-4">
                    <span>عرض التفاصيل</span>
                    <ChevronLeft className="stroke-3" />
                  </p>
                </BaseButton>
              </div>

              <div className="py-4 px-4 border rounded-lg border-red-500/20 flex-1 flex flex-col justify-between gap-2">
                <div className="flex justify-between items-center gap-2">
                  <p className="text-sm">في مرحلة المعالجة</p>
                  <p className="text-red-500 bg-current/10 px-2 py-0.5 rounded-lg text-xs font-bold">
                    12
                  </p>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className="text-sm">في مرحلة المراجعة</p>
                  <p className="text-red-500 bg-current/10 px-2 py-0.5 rounded-lg text-xs font-bold">
                    7
                  </p>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className="text-sm">في مرحلة الفهرسة</p>
                  <p className="text-red-500 bg-current/10 px-2 py-0.5 rounded-lg text-xs font-bold">
                    4
                  </p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </section>
    </>
  );
}
