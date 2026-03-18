import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { useStorage } from "../store/useStorage";

type Khizana = any;

type Props = {
  value?: Khizana | null;
  onChange?: (value: Khizana | null) => void;
};

export function KhizanaSelect({ value, onChange }: Props) {
  const { khizanat } = useStorage();

  return (
    <ComboboxSelect
      items={khizanat}
      value={value}
      onChange={onChange}
      placeholder="اختر الخزانة..."
      emptyText="لم يتم العثور على خزانات."
    />
  );
}
