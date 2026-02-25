import { BookOpen, Camera, Image, Shield, Users } from "lucide-react";

export const generateUserReport = (userData: any) => {
  const stats = userData.reduce(
    (acc, user) => {
      acc.total++;

      if (user.role === "khizana_admin") acc.admins++;
      else if (user.role === "cataloger") acc.catalogers++;
      else if (user.role === "digitizer") acc.digitizers++;
      else if (user.role === "image_processor") acc.processors++;

      return acc;
    },
    {
      total: 0,
      admins: 0,
      catalogers: 0,
      digitizers: 0,
      processors: 0,
    },
  );

  return [
    {
      label: "إجمالي المستخدمين",
      value: stats.total,
      icon: Users,
      className: "text-blue-500",
    },
    {
      label: "مسؤولي الخزانات",
      value: stats.admins,
      icon: Shield,
      className: "text-purple-500",
    },
    {
      label: "المكلفين بالفهرسة",
      value: stats.catalogers,
      icon: BookOpen,
      className: "text-green-500",
    },
    {
      label: "المكلفين بالرقمنة",
      value: stats.digitizers,
      icon: Camera,
      className: "text-yellow-500",
    },
    {
      label: "مكلفي معالجة الصور",
      value: stats.processors,
      icon: Image,
      className: "text-red-500",
    },
  ];
};
