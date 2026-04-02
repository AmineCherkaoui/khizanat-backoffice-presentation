"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import { CircleAlert } from "lucide-react";
import * as React from "react";
import BaseButton from "./base-button";

interface BaseModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: "normal" | "alert";
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  isLoading?: boolean;
}

export function BaseModal({
  open,
  onOpenChange,
  title,
  description,
  variant = "normal",
  onConfirm,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  children,
  trigger,
  isLoading,
}: BaseModalProps) {
  const isDesktop = useMediaQuery("only screen and (min-width: 768px)");

  const VisualRoot = isDesktop ? Dialog : Drawer;
  const VisualContent = isDesktop ? DialogContent : DrawerContent;
  const VisualHeader = isDesktop ? DialogHeader : DrawerHeader;
  const VisualTitle = isDesktop ? DialogTitle : DrawerTitle;
  const VisualDescription = isDesktop ? DialogDescription : DrawerDescription;

  const VisualClose = isDesktop ? DialogClose : DrawerClose;

  const VisualTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <VisualRoot modal={true} open={open} onOpenChange={onOpenChange}>
      {trigger && <VisualTrigger asChild>{trigger}</VisualTrigger>}
      <VisualContent
        className={cn(
          "flex flex-col outline-none overflow-hidden",
          variant === "alert" && "border-destructive/10",
          isDesktop
            ? "rounded-4xl max-h-[80dvh] p-0!"
            : "rounded-t-3xl max-h-[96dvh]",
        )}
      >
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <VisualHeader className="text-right">
            <VisualTitle className={cn("space-y-4 text-base-700")}>
              {variant === "alert" && (
                <span className="p-2 rounded-full bg-destructive/10 inline-flex ">
                  <CircleAlert className=" text-destructive size-7 " />
                </span>
              )}
              <p>{title}</p>
            </VisualTitle>
            {description && (
              <VisualDescription>{description}</VisualDescription>
            )}
          </VisualHeader>

          {children && <div className="py-4 text-right">{children}</div>}
        </div>

        <div
          className={cn(
            "flex gap-2 w-full p-6 md:p-8 md:pt-0 pt-4",
            isDesktop ? "flex-row-reverse" : "flex-col",
          )}
        >
          <BaseButton
            className="rounded-full px-12 cursor-pointer"
            variant={variant === "alert" ? "destructive" : "default"}
            isLoading={isLoading}
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm?.();
              onOpenChange?.(false);
            }}
          >
            {confirmText}
          </BaseButton>
          <VisualClose asChild>
            <Button
              className="rounded-full px-12 shadow-none bg-base-100 cursor-pointer"
              variant="ghost"
              onClick={() => onOpenChange?.(false)}
            >
              {cancelText}
            </Button>
          </VisualClose>
        </div>
      </VisualContent>
    </VisualRoot>
  );
}
