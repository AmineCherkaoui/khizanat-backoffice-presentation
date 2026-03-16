import {
  differenceInCalendarDays,
  format,
  formatDistanceToNow,
  isValid,
  parse,
} from "date-fns";
import { ar } from "date-fns/locale";

export const formatRelative = (date: Date | string | number) => {
  if (!date) return null;
  const dateObj = new Date(date);

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: ar,
  });
};

export const formatDate = ({
  date,
  format: formatStr = "dd/MM/yyyy",
}: {
  date: Date | string | number;
  format?: string;
}) => {
  if (!date) return null;

  let dateObj: Date;

  if (
    typeof date === "string" &&
    date.includes("-") &&
    date.split("-")[0].length === 2
  ) {
    dateObj = parse(date, "dd-MM-yyyy", new Date());
  } else {
    dateObj = new Date(date);
  }

  if (!isValid(dateObj)) {
    console.error("Invalid date passed to formatDate:", date);
    return "تاريخ غير صالح";
  }

  return format(dateObj, formatStr, {
    locale: ar,
  });
};

export function getDaysBetween(
  dateA: Date | string | number,
  dateB: Date | string | number,
) {
  if (!dateA || !dateB) return null;
  const d1 = new Date(dateA);
  const d2 = new Date(dateB);

  return Math.abs(differenceInCalendarDays(d2, d1));
}
