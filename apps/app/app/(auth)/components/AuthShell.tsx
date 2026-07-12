"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { AuthBackground } from "./AuthBackground";
import { TrustFooter } from "./TrustFooter";
import { NetliumMark } from "./NetliumMark";

export interface AuthShellProps {
  readonly children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate flex min-h-screen flex-col items-center justify-start overflow-hidden px-6 py-20">
        <AuthBackground />
        <div className="flex w-full flex-col items-center gap-14">
          <div className="flex items-center gap-2">
            <NetliumMark size={22} />
            <span className="text-body-sm font-semibold tracking-tight text-text-secondary">Netlium</span>
          </div>
          <div className="w-full">{children}</div>
          <TrustFooter />
        </div>
      </div>
    </MotionConfig>
  );
}
