import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface MotionRevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
  once?: boolean;
}

const getOffset = (direction: RevealDirection, distance: number) => {
  switch (direction) {
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    case "none":
      return { x: 0, y: 0 };
    case "up":
    default:
      return { x: 0, y: distance };
  }
};

export default function MotionReveal({
  children,
  delay = 0,
  direction = "up",
  distance = 28,
  duration = 0.7,
  once = true,
  ...props
}: MotionRevealProps) {
  const offset = getOffset(direction, distance);

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
