"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/date";

import { cn } from "@/lib/utils";
import { ar } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

interface DatePickerProps {
  value?: Date | string;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  ariaInvalid?: boolean;
  className?: string;
}

export function DatePicker({
  ariaInvalid,
  value,
  onChange,
  placeholder = "اختر التاريخ",
  className,
}: DatePickerProps) {
  const dateValue = value ? new Date(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-invalid={ariaInvalid}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal aria-invalid:border-destructive aria-invalid:bg-destructive/5 shadow-none",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          {value ? (
            formatDate({ date: value, format: "dd MMMM yyyy" })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          locale={ar}
          mode="single"
          selected={dateValue}
          onSelect={onChange}
          captionLayout="dropdown"
          endMonth={new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}
