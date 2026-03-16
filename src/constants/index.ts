/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BadgeVariant } from "@/components/common/badge";
import { linkOptions } from "@tanstack/react-router";

export const SIDEBAR_LINKS = linkOptions([
  {
    title: "لوحة التحكم",
    to: "/dashboard",

    includeChildren: false,
  },
  {
    title: "المخطوطات",
    to: "/dashboard/manuscrits",
    includeChildren: true,
  },
  {
    title: "الخزانات",
    to: "/dashboard/khizanat",
    includeChildren: true,
  },

  {
    title: "التقارير",
    to: "/dashboard/reports",
    includeChildren: true,
  },
  {
    title: "المستخدمون",
    to: "/dashboard/users",
    includeChildren: true,
  },
]);

export const STEPS = [
  {
    id: "1",
    to: "step-one",
    title: "الفهرسة",
    worker: "موظف الفهرسة",
  },

  {
    id: "2",
    to: "step-two",
    title: "الرقمنة",
    worker: "مشغّل الرقمنة",
  },

  {
    id: "3",
    to: "step-three",
    title: "المراجعة العلمية",
    worker: "المراجع العلمي",
  },

  {
    id: "4",
    to: "step-four",
    title: " المعالجة",
    worker: "مسؤول  المعالجة",
  },

  {
    id: "5",
    to: "step-five",
    title: "المراجعة اللغوية",
    worker: "المُدقِّق العلمي",
  },

  {
    id: "6",
    to: "step-six",
    title: "النشر",
    worker: "مسؤول النشر",
  },
];

type ComboBoxType = {
  label: string;
  value: string;
  variant?: BadgeVariant;
};

export const userRoles: ComboBoxType[] = [
  { value: "khizana_admin", label: "مسؤول خزانة", variant: "secondary" },
  { value: "cataloger", label: "الفهرسة", variant: "success" },
  { value: "digitizer", label: "مكلف بالرقمنة", variant: "warning" },
  { value: "image_processor", label: "مكلف بمعالجة الصور", variant: "danger" },
];

export type TaskStatus = "قيد التنفيذ" | "متاخر" | "مكتمل" | "مرفوض";

export const ManuscriptStatus: ComboBoxType[] = [
  { label: "متاخر", value: "متاخر" },
  { label: "قيد التنفيذ", value: "قيد التنفيذ" },
  { label: "مكتمل", value: "مكتمل" },
  { label: "مرفوض", value: "مرفوض" },
];

export type Khizana = {
  label: string;
  value: string;
  region: string;
  city: string;
  managerId: number;
  totalOfManuscript: number;
};

export const users = [
  {
    id: 1,
    name: "أحمد الوزاني",
    email: "ahmad.ouazzani@habous.ma",
    password: "123456",
    role: "khizana_admin",
    khizana: "KH-005", // كان 01
    isActive: true,
    lastLogin: "2026-02-20T14:15:00",
  },
  {
    id: 2,
    name: "فاطمة التازية",
    email: "fatima.taza@habous.ma",
    password: "123456",
    role: "cataloger",
    khizana: "KH-007", // كان 02
    isActive: true,
    lastLogin: "2026-02-23T08:15:00",
  },
  {
    id: 3,
    name: "يوسف المراكشي",
    email: "youssef.marrakech@habous.ma",
    password: "123456",
    role: "digitizer",
    khizana: "KH-003", // كان 04
    isActive: true,
    lastLogin: "2026-02-22T07:15:00",
  },
  {
    id: 4,
    name: "مريم الفاسية",
    email: "meryem.fes@habous.ma",
    password: "123456",
    role: "image_processor",
    khizana: "KH-002", // كان 06
    isActive: true,
    lastLogin: "2026-02-21T09:15:00",
  },
  {
    id: 5,
    name: "عبدالله المكناسي",
    email: "abdellah.meknes@habous.ma",
    password: "123456",
    role: "khizana_admin",
    khizana: "KH-006", // كان 11
    isActive: false,
    lastLogin: "2026-02-20T09:15:00",
  },
  {
    id: 6,
    name: "سلمى السلاوية",
    email: "salma.sale@habous.ma",
    password: "123456",
    role: "cataloger",
    khizana: "KH-011", // كان 13
    isActive: true,
    lastLogin: "2026-01-29T09:15:00",
  },
  {
    id: 7,
    name: "حمزة الميدلتي",
    email: "hamza.midelt@habous.ma",
    password: "123456",
    role: "digitizer",
    khizana: "KH-004", // كان 10
    isActive: true,
    lastLogin: "2026-01-23T08:15:00",
  },
  {
    id: 8,
    name: "ليلى الصويرية",
    email: "leila.essaouira@habous.ma",
    password: "123456",
    role: "image_processor",
    khizana: "KH-010", // كان 08
    isActive: true,
    lastLogin: "2026-01-24T09:15:00",
  },
  {
    id: 9,
    name: "حسن الزرهوني",
    email: "hassan.zarhoun@habous.ma",
    password: "123456",
    role: "cataloger",
    khizana: "KH-008", // كان 09
    isActive: true,
    lastLogin: "2026-02-12T09:15:00",
  },
  {
    id: 10,
    name: "عائشة الميدلتية",
    email: "aicha.midelt@habous.ma",
    password: "123456",
    role: "digitizer",
    khizana: "KH-004", // كان 10
    isActive: false,
    lastLogin: "2026-02-13T09:15:00",
  },
  {
    id: 11,
    name: "مصطفى المكناسي",
    email: "mustapha.meknes@habous.ma",
    password: "123456",
    role: "image_processor",
    khizana: "KH-006", // كان 11
    isActive: true,
    lastLogin: "2026-02-17T09:15:00",
  },
  {
    id: 12,
    name: "خديجة التمكروطية",
    email: "khadija.tamkroute@habous.ma",
    password: "123456",
    role: "khizana_admin",
    khizana: "KH-001", // كان 12
    isActive: true,
    lastLogin: "2026-02-19T09:15:00",
  },
  {
    id: 13,
    name: "نور الدين السلاوي",
    email: "nour.sale@habous.ma",
    password: "123456",
    role: "cataloger",
    khizana: "KH-011", // كان 13
    isActive: false,
    lastLogin: "2026-02-22T09:15:00",
  },
  {
    id: 14,
    name: "جميلة الفاسية",
    email: "jamila.fes@habous.ma",
    password: "123456",
    role: "digitizer",
    khizana: "KH-002", // كان 06
    isActive: true,
    lastLogin: "2026-02-24T09:15:00",
  },
  {
    id: 15,
    name: "عبدالرحيم الوزاني",
    email: "abderrahim.ouazzan@habous.ma",
    password: "123456",
    role: "image_processor",
    khizana: "KH-005", // كان 01
    isActive: true,
    lastLogin: "2026-01-20T09:15:00",
  },
  {
    id: 16,
    name: "سعاد التازية",
    email: "souad.taza@habous.ma",
    password: "123456",
    role: "khizana_admin",
    khizana: "KH-007", // كان 02
    isActive: false,
    lastLogin: "2026-02-11T09:15:00",
  },
  {
    id: 17,
    name: "رشيد المراكشي",
    email: "rachid.marrakech@habous.ma",
    password: "123456",
    role: "cataloger",
    khizana: "KH-003", // كان 04
    isActive: true,
    lastLogin: "2026-02-01T09:15:00",
  },
  {
    id: 18,
    name: "هدى الصويرية",
    email: "houda.essaouira@habous.ma",
    password: "123456",
    role: "digitizer",
    khizana: "KH-010", // كان 08
    isActive: true,
    lastLogin: "2026-02-13T09:15:00",
  },
  {
    id: 19,
    name: "عبدالعزيز الميدلتي",
    email: "abdelaziz.midelt@habous.ma",
    password: "123456",
    role: "image_processor",
    khizana: "KH-004", // كان 10
    isActive: false,
    lastLogin: "2026-01-13T19:15:00",
  },

  {
    id: 21,
    name: "محمد الفاسي",
    email: "mohammed.fes@habous.ma",
    password: "123456",
    role: "khizana_admin",
    khizana: "KH-002",
    isActive: true,
    lastLogin: "2026-03-01T10:00:00",
  },
  {
    id: 22,
    name: "طارق المراكشي",
    email: "tariq.marrakech@habous.ma",
    password: "123456",
    role: "khizana_admin",
    khizana: "KH-003",
    isActive: true,
    lastLogin: "2026-03-02T09:30:00",
  },
  {
    id: 23,
    name: "ياسين العياشي",
    email: "yassine.midelt@habous.ma",
    password: "123456",
    role: "khizana_admin",
    khizana: "KH-004",
    isActive: true,
    lastLogin: "2026-03-05T11:15:00",
  },
  {
    id: 24,
    name: "إدريس الزرهوني",
    email: "driss.zarhoun@habous.ma",
    password: "123456",
    role: "khizana_admin",
    khizana: "KH-008",
    isActive: true,
    lastLogin: "2026-02-28T14:20:00",
  },
  {
    id: 25,
    name: "عمر المسفيوي",
    email: "omar.safi@habous.ma",
    password: "123456",
    role: "khizana_admin",
    khizana: "KH-009",
    isActive: true,
    lastLogin: "2026-03-10T08:45:00",
  },
  {
    id: 26,
    name: "يونس الصويري",
    email: "younes.essaouira@habous.ma",
    password: "123456",
    role: "khizana_admin",
    khizana: "KH-010",
    isActive: true,
    lastLogin: "2026-03-11T16:10:00",
  },
  {
    id: 27,
    name: "عبدالرحمن السلاوي",
    email: "abderahmane.sale@habous.ma",
    password: "123456",
    role: "khizana_admin",
    khizana: "KH-011",
    isActive: true,
    lastLogin: "2026-03-09T10:05:00",
  },
  {
    id: 28,
    name: "هشام الرحماني",
    email: "hicham.benguerir@habous.ma",
    password: "123456",
    role: "khizana_admin",
    khizana: "KH-012",
    isActive: true,
    lastLogin: "2026-03-12T09:00:00",
  },
];

export const khizanat: Khizana[] = [
  {
    label: "خزانة الزاوية الناصرية بتمكروت",
    value: "KH-001",
    region: "درعة - تافيلالت",
    city: "تمكروت (زاكورة)",
    managerId: 12,
    totalOfManuscript: 4777,
  },
  {
    label: "خزانة القرويين بفاس",
    value: "KH-002",
    region: "فاس - مكناس",
    city: "فاس",
    managerId: 21, // مدير جديد
    totalOfManuscript: 4000,
  },
  {
    label: "خزانة ابن يوسف بمراكش",
    value: "KH-003",
    region: "مراكش - آسفي",
    city: "مراكش",
    managerId: 22, // مدير جديد
    totalOfManuscript: 2736,
  },
  {
    label: "خزانة الزاوية الحمزية العياشية بميدلت",
    value: "KH-004",
    region: "درعة - تافيلالت",
    city: "ميدلت",
    managerId: 23, // مدير جديد
    totalOfManuscript: 1540,
  },
  {
    label: "خزانة المسجد الأعظم بوزان",
    value: "KH-005",
    region: "طنجة - تطوان - الحسيمة",
    city: "وزان",
    managerId: 1,
    totalOfManuscript: 1386,
  },
  {
    label: "خزانة المسجد الأعظم بمكناس",
    value: "KH-006",
    region: "فاس - مكناس",
    city: "مكناس",
    managerId: 5,
    totalOfManuscript: 925,
  },
  {
    label: "خزانة المسجد الأعظم بتازة",
    value: "KH-007",
    region: "فاس - مكناس",
    city: "تازة",
    managerId: 16,
    totalOfManuscript: 703,
  },
  {
    label: "خزانة مولاي ادريس زرهون",
    value: "KH-008",
    region: "فاس - مكناس",
    city: "زرهون",
    managerId: 24, // مدير جديد
    totalOfManuscript: 454,
  },
  {
    label: "خزانة المسجد الأعظم بآسفي",
    value: "KH-009",
    region: "مراكش - آسفي",
    city: "آسفي",
    managerId: 25, // مدير جديد
    totalOfManuscript: 410,
  },
  {
    label: "خزانة مسجد القصبة بالصويرة",
    value: "KH-010",
    region: "مراكش - آسفي",
    city: "الصويرة",
    managerId: 26, // مدير جديد
    totalOfManuscript: 248,
  },
  {
    label: "خزانة المسجد الأعظم بسلا",
    value: "KH-011",
    region: "الرباط - سلا - القنيطرة",
    city: "سلا",
    managerId: 27, // مدير جديد
    totalOfManuscript: 149,
  },
  {
    label: "خزانة القايد العيادي بابن جرير",
    value: "KH-012",
    region: "مراكش - آسفي",
    city: "ابن جرير",
    managerId: 28, // مدير جديد
    totalOfManuscript: 50,
  },
];

export const MANUSCRIPTS = [
  {
    id: "MS-2026-001",
    title: "كتاب الحكمة و الفلسفة",
    author: "ابن رشد",
    scribe: null,
    storageLocation: "KH-001", // خزانة 1
    releaseDate: "01-01-2000",
    stepStatus: "قيد التنفيذ",
    fontType: "عربي مغربي",
    currentStep: 3,
    material: "ورق",
    linesPerPage: 29,
    dimensions: "20/30",
    classification: "الفلسفة",
    firstDigitalizationDate: "01-12-2026",
    lastDigitalizationDate: "05-12-2026",
    CreationDate: "15-01-2026",
    manuscriptStatus: "جيدة",
    startsWith: "الحمد لله الذي ألهمنا حقائق المعاني ودقائق البيان...",
    endsWith: "...والصلاة والسلام على محمد ذوي النفوس الزكية وشرف وكرم.",
    needToBeMaintenance: false,
    isCurrentlyMaintaning: false,
    maintananceFinished: false,
    numPages: 145,
    language: "العربية",
    cover: "/covers/ms-2026-001.jpg",
    link: "https://manuscripts.gov.ma/view/MS-2026-001",
    century: "القرن الثاني عشر",
    visibility: "private",
    logs: [
      {
        id: "step-1",
        title: "الفهرسة",
        status: "completed",
        user: { name: "أحمد الوزاني", role: "مسؤول خزانة" },
        date: "2026-02-20T12:47:27.646Z",
      },
      {
        id: "step-2",
        title: "الرقمنة",
        status: "completed",
        user: { name: "أحمد الوزاني", role: "مسؤول خزانة" },
        date: "2026-02-20T12:47:27.646Z",
      },
    ],
    pages: [
      {
        id: 1,
        size: "12.4 MB",
        status: "محملة",
        url: "/covers/ms-2026-001.jpg",
      },
    ],
  },
  {
    id: "MS-2026-002",
    title: "القانون في الطب",
    author: "ابن سينا",
    storageLocation: "KH-002", // خزانة 2
    releaseDate: "01-01-1025",
    stepStatus: "مرفوض",
    fontType: "نسخ",
    currentStep: 3,
    size: 18,
    classification: "الطب",
    firstDigitalizationDate: "02-12-2026",
    lastDigitalizationDate: "04-12-2026",
    manuscriptStatus: "ضعيفة",
    startsWith: "الحمد لله الذي خلق الإنسان...",
    endsWith: "...وهذا آخر القول في الأدوية",
    needToBeMaintenance: true,
    isCurrentlyMaintaning: true,
    maintananceFinished: true,
    latestMaintenance: "02-12-2026",
    numPages: 65,
    language: "العربية",
    cover: "/covers/ms-2026-001.jpg",
  },
  {
    id: "MS-2026-003",
    title: "رحلة ابن بطوطة",
    author: "ابن بطوطة",
    storageLocation: "KH-003", // خزانة 3
    releaseDate: "01-01-1355",
    stepStatus: "متاخر",
    fontType: "مغربي مبسوط",
    currentStep: 5, // تم التعديل من 6 إلى 5 لأن 6 أصبح يعني "مكتمل"
    size: 20,
    classification: "أدب الرحلات",
    firstDigitalizationDate: "01-02-2026",
    lastDigitalizationDate: "01-02-2026",
    manuscriptStatus: "متوسطة",
    startsWith: "قال الشيخ شمس الدين...",
    endsWith: "...انتهت الرحلة في غرناطة",
    needToBeMaintenance: false,
    isCurrentlyMaintaning: false,
    maintananceFinished: false,
    numPages: 70,
    language: "العربية",
    cover: "/covers/ms-2026-001.jpg",
  },
  {
    id: "MS-2026-004",
    title: "المقدمة",
    author: "ابن خلدون",
    storageLocation: "KH-004", // خزانة 4
    releaseDate: "01-01-1377",
    stepStatus: "مكتمل",
    fontType: "مغربي مجوهر",
    currentStep: 6, // تم التعديل من 7 إلى 6
    size: 22,
    classification: "علم الاجتماع",
    firstDigitalizationDate: "01-12-2026",
    lastDigitalizationDate: "05-12-2026",
    manuscriptStatus: "جيدة",
    startsWith: "اعلم أن فن التاريخ...",
    endsWith: "...والله يؤيد بنصره من يشاء",
    needToBeMaintenance: true,
    isCurrentlyMaintaning: true,
    maintananceFinished: false,
    numPages: 206,
    language: "العربية",
    cover: "/covers/ms-2026-001.jpg",
  },
  {
    id: "MS-2026-005",
    title: "كتاب الشفاء",
    author: "ابن سينا",
    storageLocation: "KH-005", // خزانة 5
    releaseDate: "01-01-1020",
    stepStatus: "قيد التنفيذ",
    fontType: "ثلث",
    currentStep: 4,
    size: 16,
    classification: "فلسفة وعلوم",
    firstDigitalizationDate: "10-12-2026",
    lastDigitalizationDate: "15-12-2026",
    manuscriptStatus: "جيدة",
    startsWith: "أما بعد حمد الله...",
    endsWith: "...وهذا تمام المنطق",
    needToBeMaintenance: true,
    isCurrentlyMaintaning: false,
    maintananceFinished: false,
    numPages: 336,
    language: "العربية",
    cover: "/covers/ms-2026-001.jpg",
  },
  {
    id: "MS-2026-006",
    title: "ديوان المتنبي",
    author: "أبو الطيب المتنبي",
    storageLocation: "KH-006", // خزانة 6
    releaseDate: "01-01-0950",
    stepStatus: "متاخر",
    fontType: "كوفي",
    currentStep: 5,
    size: 14,
    classification: "الشعر",
    firstDigitalizationDate: "01-02-2026",
    lastDigitalizationDate: "01-02-2026",
    manuscriptStatus: "متوسطة",
    startsWith: "واحر قلباه ممن قلبه شبم...",
    endsWith: "...أنا الذي نظر الأعمى إلى أدبي",
    needToBeMaintenance: true,
    isCurrentlyMaintaning: true,
    maintananceFinished: true,
    numPages: 145,
    language: "العربية",
    cover: "/covers/ms-2026-001.jpg",
  },
  {
    id: "MS-2026-007",
    title: "البيان والتبيين",
    author: "الجاحظ",
    storageLocation: "KH-007", // خزانة 7
    releaseDate: "01-01-0847",
    stepStatus: "مكتمل",
    fontType: "نسخ",
    currentStep: 6, // تم التعديل من 7 إلى 6
    size: 17,
    classification: "الأدب والبلاغة",
    firstDigitalizationDate: "01-12-2026",
    lastDigitalizationDate: "10-12-2026",
    manuscriptStatus: "جيدة",
    startsWith: "هذا كتاب البيان...",
    endsWith: "...تم الجزء الثالث",
    needToBeMaintenance: false,
    isCurrentlyMaintaning: false,
    maintananceFinished: false,
    numPages: 220,
    language: "العربية",
    cover: "/covers/ms-2026-001.jpg",
  },
  {
    id: "MS-2026-008",
    title: "العقد الفريد",
    author: "ابن عبد ربه",
    storageLocation: "KH-008", // خزانة 8
    releaseDate: "01-01-0940",
    stepStatus: "مرفوض",
    fontType: "أندلسي",
    currentStep: 4,
    size: 19,
    classification: "الأدب",
    firstDigitalizationDate: "05-12-2026",
    lastDigitalizationDate: "06-12-2026",
    manuscriptStatus: "متوسطة",
    startsWith: "الحمد لله رب العالمين...",
    endsWith: "...انتهى كتاب الجوهرة",
    needToBeMaintenance: true,
    isCurrentlyMaintaning: true,
    maintananceFinished: true,
    numPages: 310,
    language: "العربية",
    cover: "/covers/ms-2026-001.jpg",
  },
  {
    id: "MS-2026-009",
    title: "الكامل في التاريخ",
    author: "ابن الأثير",
    storageLocation: "KH-009", // خزانة 9
    releaseDate: "01-01-1231",
    stepStatus: "قيد التنفيذ",
    fontType: "نسخ بغدادي",
    currentStep: 5, // تم التعديل من 6 إلى 5 لأن 6 أصبح يعني "مكتمل"
    size: 15,
    classification: "التاريخ",
    firstDigitalizationDate: "04-12-2026",
    lastDigitalizationDate: "09-12-2026",
    manuscriptStatus: "ضعيفة",
    startsWith: "ذكر أخبار الأنبياء...",
    endsWith: "...والله الموفق للصواب",
    needToBeMaintenance: true,
    isCurrentlyMaintaning: false,
    maintananceFinished: false,
    numPages: 412,
    language: "العربية",
    cover: "/covers/ms-2026-001.jpg",
  },
  {
    id: "MS-2026-010",
    title: "الأغاني",
    author: "أبو الفرج الأصفهاني",
    storageLocation: "KH-010", // خزانة 10
    releaseDate: "01-01-0967",
    stepStatus: "مكتمل",
    fontType: "ديواني",
    currentStep: 6, // تم التعديل من 7 إلى 6
    size: 18,
    classification: "الفن والأدب",
    firstDigitalizationDate: "01-11-2026",
    lastDigitalizationDate: "15-11-2026",
    manuscriptStatus: "متوسطة",
    startsWith: "هذا خبر الأصوات...",
    endsWith: "...تم كتاب الأغاني بحمد الله",
    needToBeMaintenance: false,
    isCurrentlyMaintaning: false,
    maintananceFinished: false,
    numPages: 520,
    language: "العربية",
    cover: "/covers/ms-2026-001.jpg",
  },
  {
    id: "MS-2026-011",
    title: "الفهرست",
    author: "ابن النديم",
    storageLocation: "KH-011", // خزانة 11
    releaseDate: "01-01-0987",
    stepStatus: "متاخر",
    fontType: "نسخ",
    currentStep: 4,
    size: 16,
    classification: "الببليوغرافيا",
    firstDigitalizationDate: "01-02-2026",
    lastDigitalizationDate: "01-02-2026",
    manuscriptStatus: "جيدة",
    startsWith: "هذا فهرست كتب الأمم...",
    endsWith: "...انتهت المقالة العاشرة",
    needToBeMaintenance: false,
    isCurrentlyMaintaning: false,
    maintananceFinished: false,
    numPages: 198,
    language: "العربية",
    cover: "/covers/ms-2026-001.jpg",
  },
  {
    id: "MS-2026-012",
    title: "المنقذ من الضلال",
    author: "أبو حامد الغزالي",
    storageLocation: "KH-012", // خزانة 12
    releaseDate: "01-01-1106",
    stepStatus: "قيد التنفيذ",
    fontType: "نسخ قديم",
    currentStep: 3,
    size: 13,
    classification: "التصوف",
    firstDigitalizationDate: "05-12-2026",
    lastDigitalizationDate: "10-12-2026",
    manuscriptStatus: "جيدة",
    startsWith: "الحمد لله الذي بنعمته...",
    endsWith: "...والحمد لله وحده",
    needToBeMaintenance: false,
    isCurrentlyMaintaning: false,
    maintananceFinished: false,
    numPages: 88,
    language: "العربية",
    cover: "/covers/ms-2026-001.jpg",
  },
];
