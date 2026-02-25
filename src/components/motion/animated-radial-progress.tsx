import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface RadialProgressBarProps {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
  circleClassName?: string;
  duration?: number;
}

export function AnimatedRadialProgress({
  current,
  total,
  size = 100,
  strokeWidth = 8,
  className,
  circleClassName,
  duration = 1.5,
}: RadialProgressBarProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  const offset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex flex-col items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={
            isInView
              ? { strokeDashoffset: offset }
              : { strokeDashoffset: circumference }
          }
          transition={{
            duration: duration,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={cn("text-current", circleClassName)}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col font-din">
          <span className=" leading-none">{current}%</span>
        </div>
      </div>
    </div>
  );
}
