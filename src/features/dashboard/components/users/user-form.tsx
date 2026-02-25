/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseButton from "@/components/common/base-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, sleep } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { userSchema } from "../../schemas/user";
import { KhizanaSelect } from "../khizana-select";
import { UserRoleSelect } from "../user-role-select";

export default function UserForm({
  initialData,
  onSubmit,
}: {
  initialData: any;
  onSubmit?: (value: any) => void;
}) {
  const form = useForm({
    defaultValues: initialData,
    validators: {
      onSubmit: userSchema,
    },

    onSubmit: async ({ value }) => {
      await sleep(2000);
      onSubmit?.(value);
      toast.success("تم حفظ البيانات بنجاح");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <form.Field
        name="name"
        children={(field) => (
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold" htmlFor={field.name}>
              الاسم الكامل
            </Label>
            <Input
              className="bg-base-100"
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={!field.state.meta.isValid}
              placeholder="أدخل الاسم الكامل"
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <form.Field
        name="email"
        children={(field) => (
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold" htmlFor={field.name}>
              البريد الإلكتروني
            </Label>
            <Input
              className="bg-base-100"
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={!field.state.meta.isValid}
              placeholder="user@example.com"
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <form.Field
        name="khizana"
        children={(field) => (
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold">اختر الخزانة</Label>

            <KhizanaSelect
              value={field.state.value}
              onChange={field.handleChange}
              ComboboxInputClassName="bg-base-100"
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <form.Field
        name="role"
        children={(field) => (
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold">الدور</Label>

            <UserRoleSelect
              value={field.state.value}
              onChange={field.handleChange}
              ComboboxInputClassName="bg-base-100"
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <form.Field
        name="password"
        children={(field) => (
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold" htmlFor={field.name}>
              كلمة المرور
            </Label>
            <Input
              className="bg-base-100"
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={!field.state.meta.isValid}
              type="password"
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <form.Field
        name="password-confirm"
        children={(field) => (
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold">تأكيد كلمة المرور</Label>
            <Input
              className="bg-base-100"
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={!field.state.meta.isValid}
              type="password"
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <div className="mt-4">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <BaseButton
              type="submit"
              disabled={!canSubmit}
              isLoading={isSubmitting}
              loadingText="جاري الحفظ..."
              className="w-full bg-primary-500 hover:bg-primary-600 rounded-full"
            >
              حفظ
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
  if (errors.length > 0) {
    return (
      <p
        role="alert"
        className={cn(
          "text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-90 inline-flex items-center gap-2",
          className,
        )}
      >
        <AlertCircle className="size-4" />
        <span>{errors[0].message}</span>
      </p>
    );
  }
}
