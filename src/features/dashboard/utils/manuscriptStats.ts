import { STEPS } from "@/constants";
import type { ManuscriptType } from "@/types/common";
import { format, isValid, parse, parseISO } from "date-fns";

const arabicMonths = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليوز",
  "غشت",
  "شتنبر",
  "أكتوبر",
  "نونبر",
  "دجنبر",
];

export const getManuscriptStats = (data: ManuscriptType[]) => {
  if (!Array.isArray(data)) {
    return {
      generalStats: {
        total: 0,
        inCataloging: 0,
        completed: 0,
        underMaintenance: 0,
      },
      statusDistribution: [],
      digitalizationEvolution: [],
      stepsDistribution: [],
    };
  }

  const statusMap: Record<string, number> = {};
  const timelineMap: Record<string, number> = {};

  const currentYear = new Date().getFullYear();
  for (let i = 1; i <= 12; i++) {
    const monthKey = `${currentYear}-${i.toString().padStart(2, "0")}`;
    timelineMap[monthKey] = 0;
  }

  let maintenanceCount = 0;
  let completedCount = 0;
  let catalogingCount = 0;
  let proccededCount = 0;

  const stepsMap = STEPS.map((step) => ({
    name: step.title,
    value: 0,
    id: parseInt(step.id),
  }));

  data.forEach((item) => {
    if (
      // item.isCurrentlyMaintaning ||
      item.manuscriptStatus === "ضعيفة"
    )
      maintenanceCount += 1;
    if (item.currentStep > 4) proccededCount += 1;
    if (item.stepStatus === "مكتمل") completedCount += 1;
    if (item.currentStep > 1) catalogingCount += 1;

    const status = item.stepStatus || "غير محدد";
    statusMap[status] = (statusMap[status] || 0) + 1;

    if (item.firstDigitalizationDate) {
      let dateObj: Date | null = null;
      const rawDate = item.firstDigitalizationDate;

      if (rawDate instanceof Date) {
        dateObj = rawDate;
      } else if (typeof rawDate === "string") {
        dateObj = parseISO(rawDate);
        if (!isValid(dateObj)) {
          dateObj = parse(rawDate, "MM-dd-yyyy", new Date());
        }
      }

      if (dateObj && isValid(dateObj)) {
        const key = format(dateObj, "yyyy-MM");
        if (timelineMap.hasOwnProperty(key)) {
          timelineMap[key] += 1;
        }
      }
    }

    if (item.currentStep) {
      const stepIndex = stepsMap.findIndex((s) => s.id === item.currentStep);
      if (stepIndex !== -1) {
        stepsMap[stepIndex].value += 1;
      }
    }
  });

  const digitalizationEvolution = Object.keys(timelineMap)
    .sort()
    .map((key) => {
      const [_, month] = key.split("-");
      const monthIndex = parseInt(month, 10) - 1;
      return {
        name: arabicMonths[monthIndex] || "غير معروف",
        dateKey: key,
        value: timelineMap[key],
      };
    });

  const statusDistribution = Object.keys(statusMap).map((key) => ({
    name: key,
    value: statusMap[key],
  }));

  const stepsDistribution = stepsMap.map(({ name, value }) => ({
    name,
    value,
  }));

  return {
    generalStats: {
      total: data.length,
      inCataloging: catalogingCount,
      completed: completedCount,
      underMaintenance: maintenanceCount,
      procceded: proccededCount,
    },
    statusDistribution,
    digitalizationEvolution,
    stepsDistribution,
  };
};
