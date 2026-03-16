import Badge from "@/components/common/badge";
import { BaseModal } from "@/components/common/base-modal";
import { AnimatedProgressBar } from "@/components/motion/animated-progressbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { userRoles } from "@/constants";
import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import KhizanaForm from "@/features/dashboard/components/khizanat/khizana-form";
import { useStorage } from "@/features/dashboard/store/useStorage";
import { cn } from "@/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Edit, MapPin, ShieldCheck, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/(app)/dashboard/khizanat/$id/")({
  component: KhizanaDetailsPage,
});

function KhizanaDetailsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    khizanat,
    users,
    manuscripts,
    updateKhizana,
    updateUser,
    deleteKhizana,
  } = useStorage();

  const khizana = useMemo(
    () => khizanat.find((k) => k.value === id),
    [khizanat, id],
  );

  const khizanaUsers = useMemo(
    () => users.filter((u) => u.khizana === id),
    [users, id],
  );

  const { khizanaManuscripts, digitizedAmount } = useMemo(() => {
    const targetManuscripts = manuscripts.filter(
      (m) => m.storageLocation === id,
    );
    const digitized = targetManuscripts.filter(
      (m) => m.stepStatus === "مكتمل" || m.currentStep === 6,
    ).length;

    return {
      khizanaManuscripts: targetManuscripts,
      digitizedAmount: digitized,
    };
  }, [manuscripts, id]);

  if (!khizana) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <h2 className="text-2xl font-bold text-base-500">الخزانة غير موجودة</h2>
        <button
          onClick={() => navigate({ to: "/dashboard/khizanat" })}
          className="text-primary-500 underline"
        >
          العودة لقائمة الخزانات
        </button>
      </div>
    );
  }

  const managerUser = users.find((u) => u.id === khizana.managerId);

  function handleUpdateKhizana(formValues: any) {
    const updatedKhizana = {
      ...khizana,
      label: formValues.label,
      region: formValues.region,
      city: formValues.city,
      managerId: Number(formValues.managerId),
      totalOfManuscript: Number(formValues.totalOfManuscript),
    };

    updateKhizana(updatedKhizana);

    const newManager = users.find((u) => u.id === Number(formValues.managerId));
    if (newManager && newManager.id !== khizana.managerId) {
      updateUser({
        ...newManager,
        khizana: updatedKhizana.value,
      });
    }

    setIsEditOpen(false);
    toast.success("تم تحديث بيانات الخزانة بنجاح");
  }

  function handleDeleteKhizana() {
    deleteKhizana(khizana.value);
    setIsDeleteOpen(false);
    toast.success("تم حذف الخزانة بنجاح");
    navigate({ to: "/dashboard/khizanat" });
  }

  return (
    <>
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"></div>
      )}

      <DashboardHeader
        title={khizana.label}
        description={`إدارة تفاصيل ومستخدمي ${khizana.label}`}
      >
        <div className="flex gap-2">
          <Dialog modal={false} open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white w-full @xl:max-w-fit py-1.5 px-4 rounded cursor-pointer transition-colors">
                <Edit className="size-4 text-current" />
                <span className="truncate">تعديل الخزانة</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-full max-h-full h-full rounded-none sm:rounded-3xl sm:max-w-2xl sm:h-fit sm:max-h-2xl">
              <DialogHeader>
                <DialogTitle>تعديل بيانات الخزانة</DialogTitle>
              </DialogHeader>
              <KhizanaForm
                initialData={{
                  label: khizana.label,
                  value: khizana.value,
                  region: khizana.region,
                  city: khizana.city,
                  managerId: khizana.managerId?.toString() || "",
                  totalOfManuscript: khizana.totalOfManuscript,
                }}
                onSubmit={handleUpdateKhizana}
                isUpdate={true}
              />
            </DialogContent>
          </Dialog>

          <BaseModal
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            title="حذف الخزانة"
            description={`هل أنت متأكد من رغبتك في حذف "${khizana.label}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
            variant="alert"
            onConfirm={handleDeleteKhizana}
            confirmText="حذف الخزانة"
            cancelText="إلغاء"
            trigger={
              <button className="flex items-center justify-center  bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 max-w-fit py-1.5 px-4 rounded cursor-pointer transition-colors">
                <Trash2 className="size-4 text-current" />
              </button>
            }
          />
        </div>
      </DashboardHeader>

      <div className="flex flex-col gap-6 w-full mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard className="md:col-span-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-base-500">
                <MapPin className="size-5" />
                <span className="font-medium text-lg">
                  {khizana.region} — {khizana.city}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-base-500 font-semibold">
                  الرمز المرجعي:
                </span>
                <span className="font-bold text-base-800 bg-base-100 px-3 py-1 rounded">
                  {khizana.value}
                </span>
              </div>

              <div className="mt-4">
                <AnimatedProgressBar
                  current={digitizedAmount}
                  total={Number(khizana.totalOfManuscript)}
                  label="تقدم عملية الرقمنة الإجمالية"
                  className="text-primary-500"
                  barClassName="bg-primary-500"
                />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard className="bg-primary-50 border-primary-200">
            <DashboardCardHeader title="المسؤول عن الخزانة">
              <ShieldCheck className="size-5 text-primary-500" />
            </DashboardCardHeader>
            <div className="flex flex-col mt-4 gap-2">
              <span className="font-bold text-xl text-primary-700">
                {managerUser ? managerUser.name : "غير محدد"}
              </span>
              {managerUser && (
                <span className="text-sm text-primary-600">
                  {managerUser.email}
                </span>
              )}
            </div>
          </DashboardCard>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-base-800">
            <Users className="size-5 text-primary-500" />
            فريق العمل ({khizanaUsers.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {khizanaUsers.length > 0 ? (
              khizanaUsers.map((user) => {
                const role = userRoles.find((r) => r.value === user.role);
                return (
                  <div
                    key={user.id}
                    className="bg-white p-4 rounded-lg border border-base-200 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-base-800">
                        {user.name}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] px-2 py-1 rounded-full font-bold",
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700",
                        )}
                      >
                        {user.isActive ? "نشط" : "غير نشط"}
                      </span>
                    </div>
                    <span className="text-xs text-base-500">{user.email}</span>
                    <Badge className="w-fit self-end" variant={role?.variant}>
                      {role?.label}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-base-50 p-6 text-center rounded-lg text-base-400">
                لا يوجد مستخدمين مسجلين في هذه الخزانة حالياً.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
