import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const cursorVariants = {
  blinking: {
    opacity: [0, 0, 1, 1],
    transition: {
      duration: 1,
      repeat: 3,
      repeatDelay: 0,
      ease: "linear",
      times: [0, 0.5, 0.5, 1],
    },
  },
};

export default function CursorBlinker() {
  return <CursorStyle variants={cursorVariants} animate="blinking" />;
}

const CursorStyle = styled(motion.div)(({ theme }) => ({
  display: "inline-block",
  height: "4rem",
  width: "4px",
  transform: "translateY(0.25rem)",
  backgroundColor: "#FF9361",
  [theme.breakpoints.down("md")]: {
    height: "2rem",
    width: "2px",
  },
}));
