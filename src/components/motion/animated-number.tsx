import { cn } from "@/lib/utils";
import {
  animate,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  startValue?: number;
  duration?: number; // In seconds
  className?: string;
  precision?: number;
}

export function AnimatedNumber({
  value,
  startValue = 0,
  duration = 1,
  className,
  precision = 0,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const motionValue = useMotionValue(startValue);

  const springValue = useSpring(motionValue, {
    stiffness: 200,
    damping: 30,
  });

  const displayValue = useTransform(springValue, (latest) =>
    latest.toLocaleString(undefined, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }),
  );

  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, { duration });
    }
  }, [isInView, value, motionValue, duration]);

  useEffect(() => {
    return displayValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest;
      }
    });
  }, [displayValue]);

  return (
    <span ref={ref} className={cn("tabular-nums tracking-tighter", className)}>
      {startValue}
    </span>
  );
}
