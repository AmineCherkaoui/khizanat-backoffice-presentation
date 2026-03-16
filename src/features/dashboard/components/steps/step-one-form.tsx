/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseButton from "@/components/common/base-button";
import { FileUploader } from "@/components/common/file-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import { manuscriptSchema } from "@/features/dashboard/schemas/manuscript";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { AlertCircle } from "lucide-react";

const STATUS_STYLES = {
  ضعيفة:
    "peer-checked:border-red-500/50 peer-checked:text-red-600 peer-checked:bg-red-100",
  متوسطة:
    "peer-checked:border-yellow-500/50 peer-checked:text-yellow-700 peer-checked:bg-yellow-100",
  جيدة: "peer-checked:border-green-500/50 peer-checked:text-green-700 peer-checked:bg-green-100",
} as const;

type StatusType = keyof typeof STATUS_STYLES;

export default function StepOneForm({
  initialData,
  onSubmit,
}: {
  initialData: any;
  onSubmit?: (value: any) => void;
}) {
  const form = useForm({
    defaultValues: initialData,
    validators: {
      onSubmit: manuscriptSchema,
    },

    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      form.reset();
      onSubmit?.(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="grid grid-cols-1 gap-4 @5xl:grid-cols-12"
    >
      <div className="flex flex-col gap-4 @5xl:col-span-8">
        <DashboardCard>
          <DashboardCardHeader title="معلومات  المخطوطة" />

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col @xl:grid xl:grid-cols-2 gap-4">
              <form.Field
                name="title"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <Label
                      className="text-xs font-semibold"
                      htmlFor={field.name}
                    >
                      عنوان المخطوطة
                    </Label>
                    <Input
                      className="bg-base-100"
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <form.Field
                name="author"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <Label
                      className="text-xs font-semibold"
                      htmlFor={field.name}
                    >
                      اسم المؤلف
                    </Label>
                    <Input
                      className="bg-base-100"
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <form.Field
                name="scribe"
                validators={{ onChangeAsync: manuscriptSchema.shape.scribe }}
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <Label
                      className="text-xs font-semibold"
                      htmlFor={field.name}
                    >
                      اسم الناسخ
                    </Label>
                    <Input
                      className="bg-base-100"
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              {/* <form.Field
                name="releaseDate"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-semibold">
                      تاريخ الإصدار
                    </Label>

                    <DatePicker
                      className="bg-base-100"
                      ariaInvalid={!field.state.meta.isValid}
                      value={field.state.value}
                      onChange={(date: any) => field.handleChange(date as any)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              /> */}

              <form.Field
                name="language"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-semibold">اللغة</Label>
                    <Input
                      className="bg-base-100"
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <form.Field
                name="classification"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <Label
                      className="text-xs font-semibold"
                      htmlFor={field.name}
                    >
                      التصنيف العلمي المجالي
                    </Label>
                    <Input
                      className="bg-base-100"
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <form.Field
                name="fontType"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-semibold">نوع الخط</Label>
                    <Input
                      className="bg-base-100"
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <form.Field
                name="numPages"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-semibold">
                      عدد الصفحات الكلي
                    </Label>
                    <Input
                      type="number"
                      className="bg-base-100"
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(+e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <form.Field
                name="material"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-semibold">الوعاء </Label>
                    <Input
                      className="bg-base-100"
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <form.Field
                name="linesPerPage"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-semibold">المسطرة</Label>
                    <Input
                      type="number"
                      className="bg-base-100"
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(+e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <form.Field
                name="dimensions"
                children={(field) => (
                  <div className="flex flex-col gap-2 ">
                    <Label className="text-xs font-semibold">المقياس</Label>
                    <Input
                      className="bg-base-100"
                      placeholder="16/20"
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <form.Field
                name="startsWith"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <Label
                      className="text-xs font-semibold"
                      htmlFor={field.name}
                    >
                      أوله
                    </Label>
                    <textarea
                      className="bg-base-100 p-2 rounded border border-base-200 aria-invalid:bg-destructive/5 aria-invalid:border-destructive "
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <form.Field
                name="endsWith"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <Label
                      className="text-xs font-semibold"
                      htmlFor={field.name}
                    >
                      آخره
                    </Label>
                    <textarea
                      className="bg-base-100 p-2 rounded border border-base-200 aria-invalid:bg-red-50 aria-invalid:border-destructive "
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader title="الغلاف" />

          <div className="mt-4">
            <form.Field
              name="cover"
              children={(field) => (
                <div className="flex flex-col gap-2">
                  <FileUploader
                    id={field.name}
                    value={field.state.value}
                    onChange={(files) => field.handleChange(files[0])}
                    accept="image/*"
                    error={!!field.state.meta.errors.length}
                  />
                </div>
              )}
            />
          </div>
        </DashboardCard>
      </div>

      <div className="flex flex-col gap-4 max-h-fit @5xl:sticky @5xl:top-16 @5xl:col-span-4">
        <DashboardCard>
          <DashboardCardHeader title="حالة  المخطوطة" />

          <form.Field
            name="status"
            children={(field) => (
              <div className="flex flex-col gap-3 mt-4">
                <div
                  className="grid grid-cols-1  gap-3"
                  role="radiogroup"
                  aria-labelledby="status-label"
                >
                  {(Object.keys(STATUS_STYLES) as StatusType[]).map(
                    (option) => {
                      const isSelected = field.state.value === option;

                      return (
                        <div key={option} className="relative">
                          <Input
                            type="radio"
                            id={`status-${option}`}
                            name="status"
                            value={option}
                            checked={isSelected}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(e.target.value as any)
                            }
                            aria-invalid={!field.state.meta.isValid}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`status-${option}`}
                            className={cn(
                              "flex items-center justify-center rounded-lg border py-3 px-4 transition-all cursor-pointer text-center font-medium border-base-200",
                              "peer-checked:border-current ",
                              STATUS_STYLES[option],
                              !field.state.meta.isValid && "border-red-500",
                            )}
                          >
                            {option}
                          </Label>
                        </div>
                      );
                    },
                  )}
                </div>

                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          />
        </DashboardCard>
        <DashboardCard className="bg-primary-50/50 border border-primary-200">
          <DashboardCardHeader title="الإجراءات" className="text-primary-500" />

          <div className="mt-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <BaseButton
                  type="submit"
                  disabled={!canSubmit}
                  isLoading={isSubmitting}
                  loadingText="جاري الحفظ..."
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full"
                >
                  حفظ التقدم
                </BaseButton>
              )}
            />
          </div>
        </DashboardCard>
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
