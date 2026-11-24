import { motion } from "motion/react";
import React, { ReactNode } from "react";

const AnimatedListItem = React.forwardRef<
  HTMLDivElement,
  { children: ReactNode }
>(({ children }, ref) => (
  <motion.div
    ref={ref}
    layout="position"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{
      layout: {
        type: "tween",
        duration: 0.75,
        ease: "easeInOut",
      },
      opacity: {
        duration: 0.2,
        ease: "easeInOut",
      },
    }}
  >
    {children}
  </motion.div>
));
AnimatedListItem.displayName = "AnimatedListItem";

export default AnimatedListItem;