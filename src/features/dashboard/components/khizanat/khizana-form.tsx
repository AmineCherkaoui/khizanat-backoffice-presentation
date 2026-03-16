import BaseButton from "@/components/common/base-button";
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStorage } from "@/features/dashboard/store/useStorage";
import { cn, sleep } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { AlertCircle } from "lucide-react";

type ManagerSelectProps = {
  items: { value: string; label: string }[];
  value?: string | null;
  onChange?: (value: string | null) => void;
};

function ManagerSelect({ items, value, onChange }: ManagerSelectProps) {
  const selectedItem = items.find((item) => item.value === value) || null;

  return (
    <ComboboxSelect
      items={items}
      value={selectedItem}
      onChange={(selected) => onChange?.(selected ? selected.value : null)}
      placeholder="اختر المسؤول"
      emptyText="لا يوجد مدراء متاحين حالياً غير معينين لخزانة."
      ComboboxInputClassName="bg-base-100"
    />
  );
}

export default function KhizanaForm({
  initialData,
  onSubmit,
  isUpdate = false,
}: {
  initialData: any;
  onSubmit: (data: any) => void;
  isUpdate?: boolean;
}) {
  const { users } = useStorage();

  const form = useForm({
    defaultValues: initialData,
    onSubmit: async ({ value }) => {
      await sleep(1000);
      onSubmit(value);
    },
  });

  const adminItems = users
    .filter(
      (u) =>
        u.role === "khizana_admin" &&
        (!u.khizana || u.khizana === initialData.value),
    )
    .map((admin) => ({
      value: String(admin.id),
      label: admin.name,
    }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4 mt-4 text-right"
      dir="rtl"
    >
      <div className="grid grid-cols-1  gap-4 text-right">
        <form.Field
          name="label"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold" htmlFor={field.name}>
                اسم الخزانة
              </Label>
              <Input
                className="bg-base-100 text-right"
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={!field.state.meta.isValid}
                placeholder="مثال: خزانة القرويين بفاس"
                required
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        />

        <form.Field
          name="region"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold" htmlFor={field.name}>
                الجهة
              </Label>
              <Input
                className="bg-base-100 text-right"
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={!field.state.meta.isValid}
                placeholder="مثال: فاس - مكناس"
                required
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        />

        <form.Field
          name="city"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold" htmlFor={field.name}>
                المدينة
              </Label>
              <Input
                className="bg-base-100 text-right"
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={!field.state.meta.isValid}
                placeholder="مثال: فاس"
                required
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        />

        <form.Field
          name="totalOfManuscript"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold" htmlFor={field.name}>
                عدد المخطوطات
              </Label>
              <Input
                className="bg-base-100 text-right"
                id={field.name}
                type="number"
                min="0"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                aria-invalid={!field.state.meta.isValid}
                placeholder="0"
                required
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        />

        <form.Field
          name="managerId"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold" htmlFor={field.name}>
                المسؤول (مدير الخزانة)
              </Label>

              <ManagerSelect
                items={adminItems}
                value={String(field.state.value)}
                onChange={field.handleChange}
              />

              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        />
      </div>

      <div className="mt-4 flex justify-start sm:justify-end">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <BaseButton
              type="submit"
              disabled={!canSubmit}
              isLoading={isSubmitting}
              loadingText="جاري الحفظ..."
              className="w-full sm:w-auto min-w-[120px] bg-primary-500 hover:bg-primary-600 rounded-md"
            >
              {isUpdate ? "تحديث التغييرات" : "حفظ"}
            </BaseButton>
          )}
        />
      </div>
    </form>
  );
}

function FieldError({
  errors,
  className,
}: {
  errors: any;
  className?: string;
}) {
  if (errors && errors.length > 0) {
    return (
      <p
        role="alert"
        className={cn(
          "text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-90 inline-flex items-center gap-2 mt-1",
          className,
        )}
      >
        <AlertCircle className="size-4" />
        <span>{errors[0]?.message || errors[0]}</span>
      </p>
    );
  }
  return null;
}
