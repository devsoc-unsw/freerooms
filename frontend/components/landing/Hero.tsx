import { alpha, styled } from "@mui/material/styles";
import Image from "next/image";
import { ReactNode } from "react";

interface HeroProps {
  imageSrc: string;
  children: ReactNode;
}

export default function Hero({ imageSrc, children }: HeroProps) {
  return (
    <HeroRoot>
      <HeroImage
        src={imageSrc}
        alt=""
        fill
        preload
        sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 1440px) calc(100vw - 96px), 1344px"
      />

      <HeroOverlay aria-hidden="true" />

      <HeroContent>{children}</HeroContent>
    </HeroRoot>
  );
}

const HeroRoot = styled("div")(({ theme }) => ({
  position: "relative",
  isolation: "isolate",
  width: "100%",
  height: "clamp(500px, 59vw, 850px)",
  overflow: "hidden",
  borderRadius: theme.radius.landing,
  backgroundColor: theme.colours.neutral.black,

  [theme.breakpoints.down("sm")]: {
    borderRadius: theme.radius.lg,
  },
}));

const HeroImage = styled(Image)(({ theme }) => ({
  zIndex: 0,
  objectFit: "cover",
  objectPosition: "center",
  opacity: 0.8,
  filter: "brightness(1.4) sepia(0.18) saturate(1.15)",

  [theme.breakpoints.down("sm")]: {
    objectPosition: "25% center",
  },
}));

const HeroOverlay = styled("div")(({ theme }) => ({
  position: "absolute",
  inset: 0,
  zIndex: 1,
  pointerEvents: "none",
  backgroundColor: alpha(
    theme.colours.neutral.black,
    theme.palette.mode === "dark" ? 0.62 : 0.46
  ),
}));

const HeroContent = styled("div")(() => ({
  position: "relative",
  zIndex: 2,
  width: "100%",
  height: "100%",
}));
