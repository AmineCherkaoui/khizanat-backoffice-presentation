import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { userRoles } from "@/constants";

type UserRole = (typeof userRoles)[number];

type UserRoleSelectProps = {
  value?: UserRole | null;
  onChange?: (value: UserRole | null) => void;
};

export function UserRoleSelect(props: UserRoleSelectProps) {
  return (
    <ComboboxSelect
      items={userRoles}
      placeholder="اختر دور المستخدم..."
      emptyText="لا توجد أدوار."
      {...props}
    />
  );
}
