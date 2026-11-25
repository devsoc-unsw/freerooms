"use client";

import darkPreview from "@frontend/public/assets/landing_page/browse-preview-dark.png";
import lightPreview from "@frontend/public/assets/landing_page/browse-preview-light.png";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

export default function BuildingPreview() {
  const theme = useTheme();

  const preview = theme.palette.mode === "dark" ? darkPreview : lightPreview;

  return (
    <Image
      src={preview}
      alt=""
      sizes="(max-width: 900px) 100vw, 50vw"
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        objectFit: "contain",
      }}
    />
  );
}
