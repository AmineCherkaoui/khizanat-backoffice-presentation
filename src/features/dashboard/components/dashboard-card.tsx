import { cn } from "@/lib/utils";

interface DashboardCardProps {
  className?: string;
  children?: React.ReactNode;
}
export function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-base-300 rounded-md p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface DashboardCardHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function DashboardCardHeader({
  title,
  description,
  icon,
  className,
  children,
}: DashboardCardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 flex-wrap",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {icon && icon}

        <div className="space-y-1">
          <h3 className="font-medium leading-none ">{title}</h3>
          {description && (
            <p className="text-sm text-base-500 font-medium leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {children && <div>{children}</div>}
    </div>
  );
}
