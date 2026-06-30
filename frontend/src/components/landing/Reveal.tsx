"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 24 },
  left: { x: -32 },
  right: { x: 32 },
  none: {},
};

/**
 * Scroll-reveal wrapper built on Framer Motion. Fades + slides its children
 * into view once, the first time they enter the viewport.
 */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...OFFSET[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
