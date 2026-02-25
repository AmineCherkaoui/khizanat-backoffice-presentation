import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { type ReactNode } from "react";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  icon?: ReactNode;
}

export function SearchInput({
  placeholder = "ابحت...",
  value,
  onChange,
  className = "",
  icon,
}: SearchInputProps) {
  return (
    <InputGroup
      className={`max-w-sm bg-white/80 text-base-700 shadow-none border border-base-200 ${className}`}
    >
      <InputGroupInput
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <InputGroupAddon>{icon ?? <Search />}</InputGroupAddon>
    </InputGroup>
  );
}
