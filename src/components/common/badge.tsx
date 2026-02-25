import { cn } from "@/lib/utils";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const badge = tv({
  base: "inline-flex items-center justify-center gap-2 rounded-full px-4 py-1 text-xs font-bold text-nowrap border border-current/20",

  variants: {
    variant: {
      default: "bg-current/5 text-base-600",
      secondary: "bg-current/10 text-purple-500",
      success: "bg-current/10 text-green-500",
      danger: "bg-current/10 text-red-500",
      warning: "bg-current/10 text-yellow-500",
      info: "bg-current/10 text-blue-500",
    },
  },

  defaultVariants: {
    variant: "default",
  },
});

export type BadgeVariant = VariantProps<typeof badge>["variant"];

type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
};

const Badge = ({ variant = "default", children, className }: BadgeProps) => {
  return <span className={cn(badge({ variant }), className)}>{children}</span>;
};

export default Badge;
