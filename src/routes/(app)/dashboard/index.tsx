/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserAvatar } from "@/components/common/user-avatar";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { AnimatedProgressBar } from "@/components/motion/animated-progressbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { khizanat } from "@/constants";
import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import DashboardTasks, {
  Task,
} from "@/features/dashboard/components/dashboard-tasks";
import { KhizanaSelect } from "@/features/dashboard/components/khizana-select";
import { useStorage } from "@/features/dashboard/store/useStorage";
import { formatRelative } from "@/lib/date";
import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  ChartNoAxesCombined,
  Clock,
  LibraryBig,
  ListChecks,
  ScrollText,
} from "lucide-react";
import { useMemo } from "react";

const getMaintenanceProgress = (manuscripts: any) => {
  const total = manuscripts.filter(
    (book: any) => book.needToBeMaintenance === true,
  ).length as number;

  const completed = manuscripts.filter(
    (book: any) => book.maintananceFinished === true,
  );

  const inProgress = manuscripts.filter(
    (book: any) =>
      book.isCurrentlyMaintaning === true && book.maintananceFinished === false,
  );

  const waiting = manuscripts.filter(
    (book: any) =>
      book.needToBeMaintenance === true &&
      book.maintananceFinished === false &&
      book.isCurrentlyMaintaning === false,
  );

  return {
    progress: [
      {
        items: completed,
        current: completed.length,
        total,
        label: "تم صيانتها",
      },
      {
        items: inProgress,
        current: inProgress.length,
        total,
        label: "قيد الصيانة",
      },
      {
        items: waiting,
        current: waiting.length,
        total,
        label: "بانتظار الصيانة",
      },
    ],
  };
};

export const Route = createFileRoute("/(app)/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { manuscripts } = useStorage();

  const form = useForm({
    defaultValues: {
      khizana: "" as any,
    },
  });
  const formValues = useStore(form.store, (state) => state.values);

  const { targetManuscripts, totalCount, activeCount, completedCount } =
    useMemo(() => {
      const selectedKhizanaValue = formValues.khizana?.value;

      const filtered = selectedKhizanaValue
        ? manuscripts.filter(
            (m: any) => m.storageLocation === selectedKhizanaValue,
          )
        : manuscripts;

      let total = 0;
      if (selectedKhizanaValue) {
        const khizana = khizanat.find(
          (k: any) => k.value === selectedKhizanaValue,
        );
        total = khizana ? khizana.totalOfManuscript || 0 : 0;
      } else {
        total = khizanat.reduce(
          (sum: number, k: any) => sum + (k.totalOfManuscript || 0),
          0,
        );
      }

      const completed = filtered.filter(
        (m: any) => m.stepStatus === "مكتمل" || m.currentStep === 6,
      ).length;

      const active = filtered.filter(
        (m: any) => m.stepStatus === "قيد التنفيذ",
      ).length;

      return {
        targetManuscripts: filtered,
        totalCount: total,
        activeCount: active,
        completedCount: completed,
      };
    }, [manuscripts, formValues.khizana, khizanat]);

  const { progress } = getMaintenanceProgress(targetManuscripts);

  const data = {
    tasks: [
      { bookId: "MS-2026-001" },
      { bookId: "MS-2026-002" },
      { bookId: "MS-2026-003" },
      { bookId: "MS-2026-005" },
    ],
    progress,
    recentActivities: [
      {
        username: "د. أحمد بنعلي",
        bookId: "MS-2026-001",
        date: "02-06-2026",
        activity: "لمراجعة العلمية",
      },
      {
        username: "فاطمة الزهراء",
        bookId: "MS-2026-002",
        date: "01-06-2026",
        activity: "أنهت معالجة الصور",
      },
      {
        username: "حسان الفاسي",
        bookId: "MS-2026-003",
        date: "12-06-2025",
        activity: "نشر المخطوطة",
      },
      {
        username: "عائشة بناني",
        bookId: "MS-2026-004",
        date: "02-06-2025",
        activity: "استلمت مخطوطة جديدة",
      },
    ],
  };

  return (
    <>
      <DashboardHeader
        title="لوحة التحكم"
        description="مرحباً بعودتك! إليك نظرة عامة على سير عمل المخطوطات الخاصة بك."
      >
        <form.Field
          name="khizana"
          children={(field) => (
            // 5. Pass state directly to the select just like the working component
            <KhizanaSelect
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
            />
          )}
        />
      </DashboardHeader>

      <section className="grid grid-cols-1 @2xl:grid-cols-3 gap-4">
        <DashboardCard>
          <DashboardCardHeader title="إجمالي المخطوطات">
            <ScrollText />
          </DashboardCardHeader>
          <div className="flex flex-col mt-4">
            <AnimatedNumber
              value={totalCount}
              className="font-bold text-4xl text-blue-500"
            />
            <span className="text-sm text-base-400">
              العدد الإجمالي بالمكتبة
            </span>
          </div>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader title="قيد التنفيذ">
            <Clock />
          </DashboardCardHeader>
          <div className="flex flex-col mt-4">
            <AnimatedNumber
              value={activeCount}
              className="font-bold text-4xl text-cyan-500"
            />
            <span className="text-sm text-base-400">سير عمل نشط حالياً</span>
          </div>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader title="مكتمل">
            <BadgeCheck className="text-green-500" />
          </DashboardCardHeader>
          <div className="flex flex-col mt-4">
            <AnimatedNumber
              value={completedCount}
              className="font-bold text-4xl text-green-500"
            />
            <span className="text-sm text-base-400">تمت رقمنته بالكامل</span>
          </div>
        </DashboardCard>
      </section>

      <section className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
        <DashboardCard key="مهامي">
          <DashboardCardHeader
            key="مهامي"
            title="مهامي"
            icon={<ListChecks className="text-primary-600" />}
          />
          <ScrollArea className="h-54 mt-4" type="always">
            {data.tasks.length > 0 ? (
              <DashboardTasks tasks={data.tasks} className="gap-2" />
            ) : (
              <p className="text-center">لا توجد مهام متاحة حاليًا.</p>
            )}
            <ScrollBar
              orientation="vertical"
              className="[&>div]:bg-primary-500/50!"
            />
          </ScrollArea>
        </DashboardCard>

        <DashboardCard key="المخطوطات التي تمت صيانتها">
          <DashboardCardHeader
            key="المخطوطات التي تمت صيانتها"
            title="المخطوطات التي تمت صيانتها"
            icon={<LibraryBig className="text-primary-600" />}
          />
          <ScrollArea className="h-54 mt-6">
            <div className="flex flex-col justify-between gap-6">
              {data.progress.map(({ label, current, total, items }) => (
                <Dialog key={`${label}-${items}`}>
                  <DialogTrigger>
                    <AnimatedProgressBar
                      key={label}
                      className="text-primary-600 hover:bg-base-100 cursor-pointer p-2 rounded transition-all"
                      barClassName="bg-primary-500"
                      current={current}
                      total={total}
                      label={label}
                    />
                  </DialogTrigger>

                  <DialogContent className="@container max-w-4xl! w-11/12 border border-primary-500 rounded-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-primary-600">
                        المخطوطات {label}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 overflow-y-auto">
                      {items.length === 0 && (
                        <p className="text-muted-foreground text-sm">
                          لا توجد مخطوطات في هذا القسم
                        </p>
                      )}

                      {items.map((manuscript: any) => (
                        <Task task={manuscript} key={manuscript.id} />
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </ScrollArea>
        </DashboardCard>
      </section>

      <section>
        <DashboardCard key="النشاط الأخير">
          <DashboardCardHeader
            key="النشاط الأخير"
            title="النشاط الأخير"
            icon={<ChartNoAxesCombined className="text-primary-600" />}
          />
          <div className="flex flex-col mt-4">
            {data.recentActivities.map(
              ({ username, activity, bookId, date }) => {
                return (
                  <div
                    key={`${username}-${activity}-${bookId}-${date}`}
                    className="py-4 border-b flex items-center gap-8"
                  >
                    <UserAvatar
                      fallBackClassName="bg-primary-700 text-white text-lg"
                      name={username}
                    />
                    <div>
                      <p className="font-bold text-base-600 text-sm @xl:text-base">
                        {username} {activity}
                      </p>
                      <span className="text-xs font-medium text-base-400">
                        {formatRelative(date)} • {bookId}
                      </span>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </DashboardCard>
      </section>
    </>
  );
}
