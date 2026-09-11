import { styled } from "@mui/material/styles";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

import CursorBlinker from "./CursorBlinker";

export default function TextAnimation() {
  const baseText = "Unlock spaces, own your time, with Freerooms" as string;
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    baseText.slice(0, latest)
  );

  useEffect(() => {
    const controls = animate(count, baseText.length, {
      type: "tween",
      duration: 4,
      ease: "easeInOut",
    });
    return controls.stop;
  });

  return (
    <span style={{ textAlign: "center" }}>
      <AnimationContainerStyle>{displayText}</AnimationContainerStyle>
      <CursorBlinker />
    </span>
  );
}
//TODO: Fix text on mobile
const AnimationContainerStyle = styled(motion.span)(({ theme }) => ({
  fontSize: "55px",
  fontWeight: "700",
  fontStyle: "extrabold",
  padding: "0.2rem",
  textAlign: "center",
  lineHeight: "0.5",
  [theme.breakpoints.down("md")]: {
    fontSize: "30px",
    padding: "0rem",
    letterSpacing: "-2",
  },
}));
