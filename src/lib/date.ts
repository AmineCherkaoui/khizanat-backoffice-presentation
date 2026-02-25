import {
  differenceInCalendarDays,
  format,
  formatDistanceToNow,
} from "date-fns";
import { ar } from "date-fns/locale";

export const formatRelative = (date: Date | string | number): string => {
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
}): string => {
  const dateObj = new Date(date);

  return format(dateObj, formatStr, {
    locale: ar,
  });
};

export function getDaysBetween(
  dateA: Date | string | number,
  dateB: Date | string | number,
): number {
  const d1 = new Date(dateA);
  const d2 = new Date(dateB);

  return Math.abs(differenceInCalendarDays(d2, d1));
}
