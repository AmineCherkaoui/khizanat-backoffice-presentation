/* eslint-disable @typescript-eslint/no-explicit-any */
import { userRoles, users } from "@/constants";
import { cn, sleep } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Check, Download, Globe, Lock } from "lucide-react";
import { useState } from "react";

import BaseButton from "@/components/common/base-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DashboardCard,
  DashboardCardHeader,
} from "@/features/dashboard/components/dashboard-card";
import { useQRCodeDownload } from "@/hooks/useQRCodeDownload";
import { getDaysBetween } from "@/lib/date";
import type { ManuscriptType } from "@/types/common";
import { useNavigate } from "@tanstack/react-router";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { useStorage } from "../../store/useStorage";

const currentUser = users[0];
const userRole = userRoles.find((u) => u.value === currentUser.role)?.label;

const parseSize = (sizeStr: string) => {
  const match = sizeStr?.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
};

export default function StepSixForm({
  manuscript,
}: {
  manuscript: ManuscriptType & Record<string, any>;
}) {
  const [activeAction, setActiveAction] = useState<"publish" | "save" | null>(
    null,
  );

  const { updateManuscript } = useStorage();
  const navigate = useNavigate();
  const totalSizeMB =
    manuscript.pages?.reduce((acc, page) => acc + parseSize(page?.size), 0) ||
    0;

  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const visibilityStatus = [
    {
      label: "العامة (Public)",
      description: "متاح للجميع على الإنترنت",
      value: "public",
      icon: <Globe color="#006419" />,
    },
    {
      label: "مقيد (Restricted)",
      description: "للأحثين المعتمدين فقط",
      value: "restricted",
      icon: <Lock color="#e20000" />,
    },
    {
      label: "خاص (Private)",
      description: "وصول داخلي فقط - غير منشور",
      value: "private",
      icon: <Lock color="#e20000" />,
    },
  ];

  const form = useForm({
    defaultValues: {
      visibility: manuscript.visibility || "public",
      allowDownloads: manuscript.allowDownloads ?? false,
      addWatermark: manuscript.addWatermark ?? false,
      enableExport: manuscript.enableExport ?? false,
      seo: {
        description: manuscript.seo?.description || "",
        keywords: manuscript.seo?.keywords || "",
      },
    },

    onSubmit: async ({ value, meta }) => {
      const isPublish = meta?.action === "publish";
      await sleep(3000);

      const updatedManuscript = {
        ...manuscript,
        logs: [
          ...(manuscript.logs ?? []),
          {
            id: crypto.randomUUID(),
            title: isPublish
              ? "تمت  نشر المخطوطة"
              : "تم حفظ التقدم  نشر المخطوطة",
            user: {
              name: currentUser.name,
              role: userRole,
            },
            date: new Date(),
          },
        ],
        stepStatus: isPublish ? "مكتمل" : manuscript.stepStatus,
        visibility: value.visibility,
        allowDownloads: value.allowDownloads,
        addWatermark: value.addWatermark,
        enableExport: value.enableExport,
        seo: value.seo,
      };

      updateManuscript(updatedManuscript);
      navigate({ to: ".." });
      toast.success("تم نشر المخطوطة بنجاح");
    },
  });

  const { qrRef, download: qrDownload } = useQRCodeDownload(
    `https://manuscripts.gov.ma/view/${manuscript.id}`,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="grid grid-cols-1 gap-4 @5xl:grid-cols-12 items-start"
    >
      <div className="gap-4 flex flex-col  @5xl:sticky @5xl:top-16 @5xl:col-span-8">
        <DashboardCard className="flex flex-col  ">
          <DashboardCardHeader title="التحكم في الرؤية والوصول" />
          <section className="flex flex-col gap-4">
            <form.Field
              name="visibility"
              children={(field) => (
                <div className="flex flex-col gap-4 mt-4">
                  <div
                    role="radiogroup"
                    aria-labelledby="visibility-label"
                    className="flex flex-col gap-2"
                  >
                    {visibilityStatus.map((option) => {
                      const isSelected = field.state.value === option.value;
                      return (
                        <div key={option.value} className="relative">
                          <Input
                            type="radio"
                            id={`visibility-${option.value}`}
                            name="visibility"
                            value={option.value}
                            checked={isSelected}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(e.target.value as any)
                            }
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`visibility-${option.value}`}
                            className={cn(
                              "flex items-center rounded-lg ring py-4 px-4 transition-all cursor-pointer ring-base-200",
                              "peer-checked:ring-2 peer-checked:bg-primary-50 peer-checked:ring-primary-600",
                            )}
                          >
                            {option.icon}
                            <div className="flex flex-col">
                              <h3 className="text-black">{option.label}</h3>
                              <p className="text-xs font-normal text-base-500">
                                {option.description}
                              </p>
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            />
          </section>

          <section className="flex mt-6 flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="allowDownloads"
                className="flex flex-col items-start gap-1"
              >
                <h3 className="text-black">تفعيل التنزيلات</h3>
                <p className="text-xs text-base-500">
                  السماح للمستخدمين بتنزيل المخطوطة
                </p>
              </Label>
              <form.Field
                name="allowDownloads"
                children={(field) => (
                  <Switch
                    id="allowDownloads"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                    className="data-[state=checked]:bg-primary-500"
                  />
                )}
              />
            </div>
            <div className="flex justify-between items-center ">
              <Label
                htmlFor="addWatermark"
                className="flex flex-col items-start gap-1"
              >
                <h3 className="text-black">إضافة علامة مائية</h3>
                <p className="text-xs text-base-500">
                  حماية الصور بعلامة مائية
                </p>
              </Label>
              <form.Field
                name="addWatermark"
                children={(field) => (
                  <Switch
                    id="addWatermark"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                    className="data-[state=checked]:bg-primary-500"
                  />
                )}
              />
            </div>
          </section>
        </DashboardCard>

        <DashboardCard className="flex flex-col  ">
          <DashboardCardHeader title="تحسين محركات البحث وقابلية الاكتشاف" />
          <div className="mt-4 flex-1 gap-4 flex flex-col @xl:flex-row">
            <div className="flex flex-col  w-full">
              <label className="text-sm mb-1">وصف المخطوطة</label>

              <form.Field
                name="seo.description"
                children={(field) => (
                  <textarea
                    placeholder="مخطوطة فلسفية من القرن الثاني عشر تستكشف الحكمة والفلسفة، وتجمع بين اللاهوت الإسلامي والفكر الأرسطي"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full h-24 bg-base-100 rounded-md px-3 py-2"
                  />
                )}
              />
            </div>
            <div className="flex flex-col  w-full">
              <label className="text-sm mb-1">الكلمات المفتاحية</label>
              <form.Field
                name="seo.keywords"
                children={(field) => (
                  <textarea
                    placeholder="التفسير,الحديث,البلاغة,الشعر العربي,الطب القديم,التاريخ الإسلامي..."
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full h-24 bg-base-100 rounded-md px-3 py-2"
                  />
                )}
              />
            </div>
          </div>
        </DashboardCard>

        {/* <DashboardCard className="flex flex-col">
          <DashboardCardHeader title="معاينة الصفحة العامة" />

          <div className=" mt-4 flex gap-4">
            <div className="bg-base-100 w-32 rounded-lg overflow-hidden shadow h-36">
              <img
                className="object-contain w-full h-full"
                src={manuscript.cover}
                alt={`غلاف ${manuscript.title}`}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {manuscript.title}
              </h2>

              <span>
                {manuscript?.author}, {manuscript?.language}
              </span>

              <p>{manuscript?.seo?.description}</p>

              <div className="w-full flex  gap-2 mt-2">
                <button
                  type="button"
                  className="px-6 py-2 text-xs  bg-black text-white border rounded-md hover:bg-gray-700 transition-colors"
                >
                  عرض المخطوطة
                </button>

                <button
                  type="button"
                  className="px-6 py-2 text-xs  text-black border rounded-md hover:bg-gray-100 transition-colors ml-2"
                >
                  تنزيل
                </button>
              </div>
            </div>
          </div>
        </DashboardCard> */}
      </div>

      <div className="flex flex-col gap-4  @5xl:sticky @5xl:top-4 @5xl:col-span-4">
        <DashboardCard>
          <DashboardCardHeader title="قائمة مراجعة النشر" />
          <div className=" flex flex-col gap-2 mt-4">
            {[
              "اكتملت جميع خطوات سير العمل",
              "تم التحقق من البيانات الوصفية",
              "تمت معالجة الصور",
              "تم إنشاء رمز الاستجابة السريعة",
              "تم تكوين إعدادات تحسين محركات البحث",
            ].map((item, idx) => (
              <div key={idx} className="flex flex-row gap-2 items-center">
                <Check className="text-primary-600 size-4" />
                <p className="text-primary-600 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard className="flex flex-col gap-4">
          <DashboardCardHeader title="الرابط العام (Public URL)" />
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-center w-full min-h-52 border border-grey-500 rounded-md">
              <div ref={qrRef} className="rounded-xl bg-primary-50 p-1">
                <QRCodeCanvas
                  value={`https://manuscripts.gov.ma/view/${manuscript.id}`}
                  size={180}
                  bgColor="transparent"
                  marginSize={1}
                  level="H"
                  imageSettings={{
                    src: "/images/logo.png",
                    height: 32,
                    width: 32,
                    excavate: true,
                  }}
                  className="rounded-lg"
                />
              </div>
            </div>

            <BaseButton
              className="bg-transparent border text-base-800 hover:bg-base-50"
              icon={<Download />}
              onClick={qrDownload}
            >
              تنزيل رمز الإستجابة السريعة
            </BaseButton>
          </div>
          <div className="mt-1 flex flex-col gap-4">
            <p className="text-xs text-center text-gray-500 bg-gray-100 p-2 rounded-md break-all">
              https://manuscripts.gov.ma/view/{manuscript.id}
            </p>
            <button
              type="button"
              onClick={() =>
                handleCopy(`https://manuscripts.gov.ma/view/${manuscript.id}`)
              }
              disabled={copied}
              className="px-3 py-1 text-xs text-black border rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:hover:bg-white"
            >
              {copied ? "تم نسخ الرابط" : "نسخ الرابط"}
            </button>
          </div>
        </DashboardCard>

        <DashboardCard className="flex flex-col gap-4">
          <DashboardCardHeader title="قائمة المراجعة و المراقبة" />
          <div className="mt-2 flex flex-col gap-2">
            <StatRow label="الصفحات" value={manuscript?.pages?.length} />
            <StatRow label="حجم الملف" value={`${totalSizeMB.toFixed(2)} MB`} />
            <StatRow
              label="وقت المعالجة"
              value={`${
                getDaysBetween(
                  manuscript.firstDigitalizationDate,
                  manuscript.lastDigitalizationDate,
                ) + 1
              } أيام`}
            />
          </div>
        </DashboardCard>

        <DashboardCard className="bg-primary-50/50 border-[1.5px] border-primary-200">
          <DashboardCardHeader title="الإجراءات" className="text-primary-600" />
          <div className="mt-6 flex flex-col gap-2">
            <form.Subscribe selector={(state) => state.canSubmit}>
              {(canSubmit) => (
                <>
                  <BaseButton
                    type="button"
                    disabled={!canSubmit}
                    isLoading={activeAction === "publish"}
                    onClick={async () => {
                      setActiveAction("publish");
                      await form.handleSubmit({ action: "publish" });
                      setActiveAction(null);
                    }}
                    className="w-full bg-green-600 border-gray-200 hover:bg-green-700 rounded-full"
                  >
                    نشر المخطوطة
                  </BaseButton>

                  <BaseButton
                    type="button"
                    disabled={!canSubmit}
                    isLoading={activeAction === "save"}
                    onClick={async () => {
                      setActiveAction("save");
                      await form.handleSubmit({ action: "save" });
                      setActiveAction(null);
                    }}
                    className="w-full text-black bg-transparent hover:bg-black/10 rounded-full"
                  >
                    حفظ التقدم
                  </BaseButton>
                </>
              )}
            </form.Subscribe>
          </div>
        </DashboardCard>
      </div>
    </form>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-black">{label}</span>
      <span className="text-sm text-base-500" dir="ltr">
        {value}
      </span>
    </div>
  );
}
