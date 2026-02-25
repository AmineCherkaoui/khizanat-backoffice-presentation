import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface FractionProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
  barClassName?: string;
  duration?: number;
}

export function AnimatedProgressBar({
  current,
  total,
  label,
  className,
  barClassName,
  duration = 1.5,
}: FractionProgressBarProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const percentage = total > 0 ? (current / total) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div ref={ref} className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between items-center font-din text-sm">
        {label && <span className="text-base-500 font-medium">{label}</span>}

        <div className="flex items-center gap-1  font-bold" dir="ltr">
          <span className="text-current">{current}</span>
          <span className="text-base-500">/{total}</span>
        </div>
      </div>

      <div className="h-2 w-full bg-base-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${clampedPercentage}%` } : { width: 0 }}
          transition={{
            duration: duration,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={cn(
            "h-full bg-linear-90 from-current/60 to-current rounded-full transition-colors",
            barClassName,
          )}
        />
      </div>
    </div>
  );
}
