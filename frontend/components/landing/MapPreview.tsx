"use client";

import darkPreview from "@frontend/public/assets/landing_page/map-preview-dark.png";
import lightPreview from "@frontend/public/assets/landing_page/map-preview-light.png";
import { styled, useTheme } from "@mui/material/styles";
import Image from "next/image";

export default function MapPreview() {
  const theme = useTheme();

  const preview = theme.palette.mode === "dark" ? darkPreview : lightPreview;

  return (
    <PreviewContainer>
      <Image
        src={preview}
        alt=""
        fill
        sizes="(max-width: 900px) 100vw, 50vw"
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </PreviewContainer>
  );
}

const PreviewContainer = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  flex: 1,
  minHeight: 0,
  aspectRatio: "4 / 5",
  overflow: "hidden",
  borderRadius: theme.radius.md,

  [theme.breakpoints.down("md")]: {
    flex: "none",
    aspectRatio: "16 / 9",
  },
}));
