"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface StepTransitionProps {
  readonly stepKey: string;
  readonly children: ReactNode;
}

const variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 }
};

export function StepTransition({ stepKey, children }: StepTransitionProps) {
  return (
    <motion.div
      key={stepKey}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
