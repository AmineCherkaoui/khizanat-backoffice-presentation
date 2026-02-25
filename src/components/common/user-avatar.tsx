"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import * as React from "react";

interface UserAvatarProps extends React.ComponentPropsWithoutRef<
  typeof Avatar
> {
  src?: string | null;
  name?: string;
  fallBackClassName?: string;
}

export function UserAvatar({
  src,
  name,
  className,
  fallBackClassName,
  ...props
}: UserAvatarProps) {
  const firstLetter = React.useMemo(() => {
    if (!name || name.trim().length === 0) return "U";
    return name.trim().charAt(0).toUpperCase();
  }, [name]);

  return (
    <Avatar
      className={cn("h-10 w-10 shrink-0 select-none border", className)}
      {...props}
    >
      {src && (
        <AvatarImage
          src={src}
          alt={name ?? "User"}
          className="aspect-square object-cover"
        />
      )}
      <AvatarFallback
        className={cn(
          "font-bold flex items-center justify-center uppercase",
          fallBackClassName,
        )}
      >
        {firstLetter}
      </AvatarFallback>
    </Avatar>
  );
}
