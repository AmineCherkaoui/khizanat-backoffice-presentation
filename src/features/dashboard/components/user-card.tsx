import { userRoles, users } from "@/constants";
import { UserRound } from "lucide-react";
export function UserCard() {
  return (
    <>
      <section className="flex items-center justify-start gap-2 py-1 px-3 bg-white rounded-lg">
        <div className="flex items-center justify-center p-2 bg-base-200 text-primary-700 rounded-full">
          <UserRound />
        </div>

        <div className="flex flex-col ">
          <p className="text-primary-700 font-bold text-sm md:text-base truncate">
            {users[0].name}
          </p>
          <p className="text-base-500 text-xs md:text-sm whitespace-nowrap">
            {userRoles.find((r) => users[0].role === r.value)?.label}
          </p>
        </div>
      </section>
    </>
  );
}
