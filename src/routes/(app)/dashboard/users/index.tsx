// @ts-nocheck
import Badge from "@/components/common/badge";
import { BaseModal } from "@/components/common/base-modal";
import { SearchInput } from "@/components/common/searchInput";
import { AnimatedNumber } from "@/components/motion/animated-number";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { khizanat, userRoles } from "@/constants";
import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { KhizanaSelect } from "@/features/dashboard/components/khizana-select";
import { UserRoleSelect } from "@/features/dashboard/components/user-role-select";
import UserForm from "@/features/dashboard/components/users/user-form";
import { useStorage } from "@/features/dashboard/store/useStorage";
import { generateUserReport } from "@/features/dashboard/utils/usersStats";
import { cn, paginate } from "@/lib/utils";
import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Pen, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 7;

type SearchParamsType = {
  page: number;
};

export const Route = createFileRoute("/(app)/dashboard/users/")({
  validateSearch: (search: Record<string, unknown>): SearchParamsType => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpdateUserModal, setUpdateUserModal] = useState<number | null>(
    null,
  );
  const [openDeleteUserId, setOpenDeleteUserId] = useState<number | null>(null);

  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const { users, addUser, updateUser, deleteUser, toggleUserActive } =
    useStorage();

  // FILTER

  const form = useForm({
    defaultValues: {
      khizana: searchParams.khizana || "",
      userRole: searchParams.role || "",
      search: searchParams.search || "",
    },
  });
  const formValues = useStore(form.store, (state) => state.values);

  const filteredUsers = useMemo(() => {
    const selectedKhizana = formValues.khizana?.value;
    const selectedRole = formValues.userRole?.value;
    const searchTerm = formValues.search?.toLowerCase().trim();

    if (!selectedKhizana && !selectedRole && !searchTerm) {
      return users;
    }

    return users.filter((user) => {
      const matchesKhizana =
        !selectedKhizana || user.khizana === selectedKhizana;

      const matchesRole = !selectedRole || user.role === selectedRole;

      const matchesSearch =
        !searchTerm ||
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);

      return matchesKhizana && matchesRole && matchesSearch;
    });
  }, [users, formValues]);

  // PAGINATION
  const { page = 1 } = Route.useSearch();

  const pagination = useMemo(() => {
    return paginate(filteredUsers, page, PAGE_SIZE);
  }, [page, filteredUsers]);

  const { items, totalPages } = pagination;

  const handlePageChange = (dir: "next" | "prev") => {
    const newPage =
      dir === "next" ? Math.min(page + 1, totalPages) : Math.max(page - 1, 1);

    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  useEffect(() => {
    if (page < 1 || page > totalPages) {
      navigate({
        search: (prev) => ({
          ...prev,
          page: 1,
        }),
        replace: true,
      });
    }
  }, [page, totalPages]);

  // RAPPORT
  const report = generateUserReport(filteredUsers);

  // ADD USER
  const initialData = {
    name: "",
    email: "",
    khizana: "",
    role: "",
    password: "",
    "password-confirm": "",
  };
  function handleAddUser(value: any) {
    addUser({
      id: Date.now(),
      name: value.name,
      email: value.email,
      password: value.password,
      role: value.role.value,
      khizana: value.khizana.value,
      isActive: true,
    });
    setIsOpen(false);
  }
  // UPDATE USER
  function handleUpdateUser(value: any) {
    updateUser({
      id: value.id,
      name: value.name,
      email: value.email,
      password: value.password,
      role: value.role.value,
      khizana: value.khizana.value,
      isActive: true,
    });
    setUpdateUserModal(null);
  }

  return (
    <>
      {(isOpen || openUpdateUserModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"></div>
      )}

      <DashboardHeader
        title="إدارة الصلاحيات"
        description="إدارة أدوار المستخدمين داخل الخزانات"
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
              <DialogTitle>إضافة مستخدم جديد</DialogTitle>
            </DialogHeader>
            <UserForm initialData={initialData} onSubmit={handleAddUser} />
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="flex gap-4 w-full flex-col @xl:flex-row">
        <form.Field
          name="khizana"
          children={(field) => (
            <KhizanaSelect
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
            />
          )}
        />
        <form.Field
          name="userRole"
          children={(field) => (
            <UserRoleSelect
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
            />
          )}
        />
        <form.Field
          name="search"
          children={(field) => (
            <SearchInput
              placeholder="البحث عن مستخدم..."
              className="w-full max-w-full @xl:max-w-fit"
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
            />
          )}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {report.map(({ value, icon, label, className }) => (
          <UserState
            value={value}
            label={label}
            icon={icon}
            className={`${className} flex-1`}
            key={label}
          />
        ))}
      </div>

      <DashboardCard>
        <DashboardCardHeader title="قائمة المستخدمين" />
        <ScrollArea
          type="always"
          className="border rounded-xl border-base-300 mt-4 w-full"
        >
          <table className="w-full text-nowrap">
            <thead className="text-xs font-bold text-green-700 border-b border-base-300">
              <tr>
                <th className="p-4 text-start">اسم المستخدم</th>
                <th className="p-4 text-start">البريد الإلكتروني</th>
                <th className="p-4 text-start">الخزانة</th>
                <th className="p-4 text-start">الدور</th>
                <th className="p-4 text-start">الحالة</th>
                <th className="p-4 text-start">تعديل او مسح</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {items.length > 0 ? (
                items.map((user: any) => {
                  const userRole = userRoles.find((u) => u.value === user.role);
                  const khizana = khizanat.find(
                    (k) => k.value === user.khizana,
                  );
                  return (
                    <tr
                      key={user.name + user.role}
                      className="not-last:border-b border-base-300 hover:bg-base-100 transition-colors duration-200"
                    >
                      <td className="p-4 font-semibold text-base-700">
                        {user.name}
                      </td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{khizana?.label}</td>
                      <td className="p-4">
                        <Badge variant={userRole?.variant}>
                          {userRole?.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-2">
                          <Switch
                            onClick={() => {
                              toggleUserActive(user.id);
                              const newStatus = !user.isActive
                                ? "نشط"
                                : "غير نشط";
                              toast.success(
                                `تم تغيير حالة المستخدم إلى ${newStatus}`,
                              );
                            }}
                            checked={user.isActive}
                            className="data-[state=checked]:bg-primary-500"
                          />
                          {user.isActive ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Dialog
                            modal={false}
                            open={openUpdateUserModal === user.id}
                            onOpenChange={(open) =>
                              setUpdateUserModal(open ? user.id : null)
                            }
                          >
                            <DialogTrigger asChild>
                              <button className="flex items-center justify-center gap-2 hover:bg-current/10 hover:text-green-500 p-2  rounded-full">
                                <Pen className="size-4 text-current" />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-full max-h-full h-full rounded-none sm:rounded-3xl sm:max-w-2xl sm:h-fit sm:max-h-2xl">
                              <DialogHeader>
                                <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                              </DialogHeader>
                              <UserForm
                                initialData={{
                                  ...user,
                                  role: userRole ?? null,
                                  khizana: khizana ?? null,
                                }}
                                onSubmit={handleUpdateUser}
                              />
                            </DialogContent>
                          </Dialog>

                          <BaseModal
                            open={openDeleteUserId === user.id}
                            onOpenChange={(open) =>
                              setOpenDeleteUserId(open ? user.id : null)
                            }
                            title={`هل أنت متأكد أنك تريد حذف  المخطوطة "${user.name}"؟`}
                            description="سيتم حذف  المخطوطة نهائيًا ولا يمكن استعادته لاحقًا. يرجى التأكد قبل المتابعة."
                            variant="alert"
                            onConfirm={() => {
                              deleteUser(user.id);
                              toast.success(" تم حذف المستخدم بنجاح");
                            }}
                            trigger={
                              <button className="flex items-center justify-center gap-2 hover:bg-current/5 hover:text-red-500 p-2 rounded-full">
                                <Trash2 className="size-4 text-current" />
                              </button>
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={11}
                    className="p-8 text-center text-muted-foreground"
                  >
                    لا يوجد نتائج تطابق اختياراتك
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <ScrollBar
            orientation="horizontal"
            className="[&>div]:bg-primary-500/50  "
          />
        </ScrollArea>
        {items.length > 0 && (
          <div className="mt-4 flex justify-center items-center gap-4">
            <button
              disabled={page <= 1}
              className="cursor-pointer disabled:opacity-20 transition-opacity"
              onClick={() => handlePageChange("prev")}
            >
              <ChevronRight />
            </button>

            <span dir="ltr" className="font-medium">
              {page} / {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              className="cursor-pointer disabled:opacity-20 transition-opacity"
              onClick={() => handlePageChange("next")}
            >
              <ChevronLeft />
            </button>
          </div>
        )}
      </DashboardCard>
    </>
  );
}

function UserState({
  value,
  label,
  icon,
  className,
}: {
  value: number;
  label: string;
  className?: string;
  icon?: any;
}) {
  const CurrentIcon = icon;
  return (
    <div
      className={cn(
        "bg-white border-base-200 border p-4  flex justify-between items-center gap-4 rounded",
        className,
      )}
    >
      <div className="flex gap-2 flex-col">
        <p className="text-base-400 truncate">{label}</p>
        <AnimatedNumber
          value={value}
          className="font-bold text-base-800 text-3xl"
        />
      </div>
      <span className="text-current bg-current/10 p-4 block rounded-lg">
        {icon && <CurrentIcon />}
      </span>
    </div>
  );
}
