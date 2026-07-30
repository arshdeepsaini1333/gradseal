"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { formatStatValue } from "@/lib/format";
import type { AdminStat } from "@/types/admin";

interface AnimatedNumberProps {
  value: number;
  format: AdminStat["format"];
}

export default function AnimatedNumber({ value, format }: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 90, damping: 20 });
  const [display, setDisplay] = useState(() => formatStatValue(0, format));

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => setDisplay(formatStatValue(v, format)));
    return unsubscribe;
  }, [spring, format]);

  return <span>{display}</span>;
}
