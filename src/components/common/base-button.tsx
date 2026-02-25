"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

interface BaseButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

export default function BaseButton({
  children,
  isLoading = false,
  loadingText,
  icon,
  disabled,
  className,
  variant,
  ...props
}: BaseButtonProps) {
  return (
    <motion.div
      whileTap={!disabled && !isLoading ? { scale: 0.95 } : {}}
      transition={{ duration: 0.15 }}
    >
      <Button
        disabled={disabled || isLoading}
        variant={variant}
        className={cn(
          "w-full relative overflow-hidden transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed!",
          className,
        )}
        {...props}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center gap-2"
            >
              <Loader2 className="size-4 animate-spin" />
              {loadingText || children}
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center gap-2"
            >
              {icon && <span className="block">{icon}</span>}
              <span>{children}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
