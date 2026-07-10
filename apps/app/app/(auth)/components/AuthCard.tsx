import type { HTMLAttributes } from "react";
import { cn } from "@netlium/ui";

export interface AuthCardProps extends HTMLAttributes<HTMLDivElement> {}

export function AuthCard({ className, ...props }: AuthCardProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-sm rounded-[12px] border p-8",
        "border-[color:var(--color-border-whisper)] bg-surface-2",
        "shadow-[var(--shadow-card-floating)]",
        className
      )}
      {...props}
    />
  );
}
