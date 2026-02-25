import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  className?: string;

  children?: React.ReactNode;
}

export function DashboardHeader({
  title,
  description,
  className,
  children,
}: DashboardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 mb-2 @2xl:flex-row @2xl:items-start @md:justify-between",
        className,
      )}
    >
      <div className="grid gap-1">
        <h1 className="text-lg @xl:text-2xl tracking-tight text-primary-500 font-cairo font-bold">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-neutral-500 ">{description}</p>
        )}
      </div>
      {children && children}
    </div>
  );
}
