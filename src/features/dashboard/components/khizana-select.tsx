import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { khizanat } from "@/constants";

type Khizana = (typeof khizanat)[number];

type Props = {
  value?: Khizana | null;
  onChange?: (value: Khizana | null) => void;
};

export function KhizanaSelect(props: Props) {
  return (
    <ComboboxSelect
      items={khizanat}
      placeholder="اختر الخزانة..."
      emptyText="لم يتم العثور على خزانات."
      {...props}
    />
  );
}
