import { AnimatedNumber } from "@/components/motion/animated-number";
import { AnimatedProgressBar } from "@/components/motion/animated-progressbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import KhizanaForm from "@/features/dashboard/components/khizanat/khizana-form";
import { useStorage } from "@/features/dashboard/store/useStorage";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Library, MapPin, Plus, ScrollText } from "lucide-react";

import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/(app)/dashboard/khizanat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const { khizanat, users, addKhizana, updateUser } = useStorage();

  const totalKhizanat = khizanat.length;
  const totalManuscripts = useMemo(() => {
    return khizanat.reduce(
      (acc, curr) => acc + (Number(curr.totalOfManuscript) || 0),
      0,
    );
  }, [khizanat]);

  const nextKhizanaCode = useMemo(() => {
    if (!khizanat || khizanat.length === 0) return "KH-001";
    const nextNumber = khizanat.length + 1;
    return `KH-${String(nextNumber).padStart(3, "0")}`;
  }, [khizanat]);

  const initialData = {
    label: "",
    value: nextKhizanaCode,
    region: "",
    city: "",
    managerId: "",
    totalOfManuscript: 0,
  };

  function handleAddKhizana(formValues: any) {
    const selectedManager = users.find(
      (u) => u.id === Number(formValues.managerId),
    );

    const newKhizana = {
      label: formValues.label,
      value: formValues.value,
      region: formValues.region,
      city: formValues.city,
      managerId: selectedManager ? selectedManager.id : null,
      totalOfManuscript: Number(formValues.totalOfManuscript),
    };

    addKhizana(newKhizana, selectedManager?.id);

    if (selectedManager && updateUser) {
      updateUser({
        ...selectedManager,
        khizana: newKhizana.value,
      });
    }

    setIsOpen(false);
    toast.success("تمت إضافة الخزانة وتعيين المسؤول بنجاح");
  }
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"></div>
      )}

      <DashboardHeader
        title="الخزانات"
        description="إدارة خزانات ومجموعات المخطوطات"
      >
        <Dialog modal={false} open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className=" flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white w-full @xl:max-w-fit py-1.5  px-4 rounded cursor-pointer">
              <Plus className="size-4 text-current" />
              <span className="truncate">إضافة مستخدم</span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-full max-h-full h-full rounded-none sm:rounded-3xl sm:max-w-2xl sm:h-fit sm:max-h-2xl">
            <DialogHeader>
              <DialogTitle>إضافة خزانة جديدة</DialogTitle>
            </DialogHeader>
            <KhizanaForm
              initialData={initialData}
              onSubmit={handleAddKhizana}
            />
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="flex flex-col gap-6 w-full">
        <div className="grid @xl:grid-cols-2 @5xl:grid-cols-4 gap-4 w-full mb-4">
          <DashboardCard className="w-full">
            <DashboardCardHeader title="إجمالي الخزانات">
              <Library className="size-5 text-base-400" />
            </DashboardCardHeader>
            <div className="flex flex-col mt-4">
              <AnimatedNumber
                value={totalKhizanat}
                className="font-bold text-4xl text-blue-500"
              />
              <span className="text-sm text-base-400 mt-1">خزانة وقفية</span>
            </div>
          </DashboardCard>
          <DashboardCard className="w-full">
            <DashboardCardHeader title="المخطوطات">
              <ScrollText className="size-5 text-base-400" />
            </DashboardCardHeader>
            <div className="flex flex-col mt-4">
              <AnimatedNumber
                value={totalManuscripts}
                className="font-bold text-4xl text-primary-500"
              />
              <span className="text-sm text-base-400 mt-1">مخطوطة</span>
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-4">
          {khizanat.map((khizana, index) => (
            <KhizanaCard key={khizana.value} khizana={khizana} index={index} />
          ))}
        </div>
      </div>
    </>
  );
}

// ----------------------------------------------------------------------
// Card Component
// ----------------------------------------------------------------------
// function KhizanaCard({ khizana, index }: { khizana: any; index: number }) {
//   const { users } = useStorage();

//   const managerUser = users.find((u) => u.id === khizana.managerId);
//   const managerName = managerUser
//     ? managerUser.name
//     : khizana.manager || "غير محدد";

//   const digitizationPercentage =
//     index === 0
//       ? 67
//       : index === 1
//         ? 30
//         : index === 2
//           ? 12
//           : Math.floor(Math.random() * 50) + 10;
//   const digitizedAmount = Math.floor(
//     (khizana.totalOfManuscript * digitizationPercentage) / 100,
//   );

//   const referenceCode = khizana.value;

//   return (
//     <div
//       className={cn(
//         "bg-white rounded-lg p-6 flex flex-col gap-4 relative transition-all text-right border border-base-300 hover:border-base-500",
//       )}
//     >
//       <div className="flex flex-col gap-1 mb-2">
//         <h3 className={cn("text-lg font-bold text-primary-500")}>
//           {khizana.label}
//         </h3>
//         <div className="flex items-center justify-start gap-1 text-base-400 text-xs font-medium">
//           <MapPin className="size-3 ml-1" />
//           <span>
//             {khizana.region} • {khizana.city}
//           </span>
//         </div>
//       </div>

//       <div className="flex flex-col gap-3 text-sm">
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-base-500 text-xs font-semibold">
//             الرمز المرجعي
//           </span>
//           <span className="font-bold text-base-800 text-xs">
//             {referenceCode}
//           </span>
//         </div>

//         <AnimatedProgressBar
//           current={digitizedAmount}
//           total={Number(khizana.totalOfManuscript)}
//           label="إجمالي الرقمنة"
//           className="text-primary-500"
//           barClassName="bg-primary-500"
//         />
//       </div>

//       <div className="border-t border-base-100 mt-4 pt-4 flex justify-between items-center text-xs">
//         <span className="text-base-500 font-semibold">الشخص المسؤول</span>
//         <span className="text-primary-600 font-medium">{managerName}</span>
//       </div>
//     </div>
//   );
// }

function KhizanaCard({ khizana, index }: { khizana: any; index: number }) {
  const { users, manuscripts } = useStorage();

  const managerUser = users.find((u) => u.id === khizana.managerId);
  const managerName = managerUser
    ? managerUser.name
    : khizana.manager || "غير محدد";

  const digitizedAmount = manuscripts.filter(
    (m) =>
      m.storageLocation === khizana.value &&
      (m.stepStatus === "مكتمل" || m.currentStep === 6),
  ).length;

  const referenceCode = khizana.value;

  return (
    <Link
      to="/dashboard/khizanat/$id"
      params={{ id: khizana.value }}
      className={cn(
        "bg-white rounded-lg p-6 flex flex-col gap-4 relative transition-all text-right border border-base-300",
        "hover:border-primary-500 hover:shadow-md cursor-pointer group block",
      )}
    >
      <div className="flex flex-col gap-1 mb-2">
        <h3
          className={cn(
            "text-lg font-bold text-primary-500 group-hover:text-primary-600 transition-colors",
          )}
        >
          {khizana.label}
        </h3>
        <div className="flex items-center justify-start gap-1 text-base-400 text-xs font-medium">
          <MapPin className="size-3 ml-1" />
          <span>
            {khizana.region} • {khizana.city}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-base-500 text-xs font-semibold">
            الرمز المرجعي
          </span>
          <span className="font-bold text-base-800 text-xs bg-base-100 px-2 py-1 rounded">
            {referenceCode}
          </span>
        </div>

        <AnimatedProgressBar
          current={digitizedAmount}
          total={Number(khizana.totalOfManuscript)}
          label="إجمالي الرقمنة"
          className="text-primary-500"
          barClassName="bg-primary-500"
        />
      </div>

      <div className="border-t border-base-100 mt-4 pt-4 flex justify-between items-center text-xs">
        <span className="text-base-500 font-semibold">الشخص المسؤول</span>
        <span className="text-blue-500 font-medium  px-2 py-1 rounded">
          {managerName}
        </span>
      </div>
    </Link>
  );
}
