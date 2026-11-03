"use client";

import { MotionConfig } from "motion/react";
import { useEffect } from "react";
import { useTensionStore } from "@/store/useTensionStore";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useTensionStore.persist.rehydrate();
  }, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
