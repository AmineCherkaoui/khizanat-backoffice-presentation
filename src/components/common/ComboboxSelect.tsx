import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

type BaseItem = {
  value: string;
  label: string;
};

type SelectProps<T extends BaseItem> = {
  items: T[];
  value?: T | null;
  onChange?: (value: T | null) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  ComboboxInputClassName?: string;
  ComboboxContentClassName?: string;
};

export function ComboboxSelect<T extends BaseItem>({
  items,
  value,
  onChange,
  placeholder = "اختر...",
  emptyText = "لم يتم العثور على نتائج.",
  ComboboxInputClassName,
  ComboboxContentClassName,
}: SelectProps<T>) {
  return (
    <Combobox
      items={items}
      value={value}
      onValueChange={onChange}
      itemToStringValue={(item) => item?.label ?? ""}
    >
      <ComboboxInput
        showClear
        placeholder={placeholder}
        className={cn(
          "bg-white outline-none ring-none text-primary-700 border border-base-200 shadow-none focus-within:outline-none",
          ComboboxInputClassName,
        )}
      />

      <ComboboxContent
        className={cn("ring ring-base-300", ComboboxContentClassName)}
      >
        <ComboboxEmpty>{emptyText}</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem
              key={item.value}
              value={item}
              className="not-last:border-b-2 rounded-none py-4 text-base-500"
            >
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
