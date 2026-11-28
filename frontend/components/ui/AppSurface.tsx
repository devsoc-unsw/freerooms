"use client";

import MuiPaper, { type PaperProps } from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledSurface = styled(MuiPaper)(({ theme }) => ({
  backgroundColor: theme.colours.surface.paper,
  color: theme.colours.text.primary,
  borderColor: theme.colours.border.default,
  borderRadius: theme.radius.lg,
  backgroundImage: "none",
}));

export const AppSurface = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ variant = "outlined", elevation = 0, ...props }, ref) => (
    <StyledSurface
      {...props}
      ref={ref}
      variant={variant}
      elevation={elevation}
    />
  )
);
AppSurface.displayName = "AppSurface";
