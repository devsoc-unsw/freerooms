"use client";

import MuiChip, { type ChipProps } from "@mui/material/Chip";
import { alpha, styled } from "@mui/material/styles";
import React from "react";

export type AppStatus = "available" | "soon" | "unavailable" | "neutral";

export type AppStatusBadgeProps = Omit<
  ChipProps,
  | "color"
  | "variant"
  | "onClick"
  | "onDelete"
  | "clickable"
  | "deleteIcon"
  | "component"
> & {
  status: AppStatus;
};

const StyledStatusBadge = styled(MuiChip, {
  shouldForwardProp: (prop) => prop !== "status",
})<AppStatusBadgeProps>(({ theme, status }) => {
  const colours = theme.colours;
  const styles = {
    available: colours.status.available,
    soon: {
      main: colours.status.soon.main,
      background: alpha(colours.status.soon.main, 0.12),
      text: colours.text.primary,
    },
    unavailable: colours.status.unavailable,
    neutral: {
      main: colours.text.secondary,
      background: colours.surface.muted,
      text: colours.text.secondary,
    },
  }[status];

  return {
    backgroundColor: styles.background,
    color: styles.text,
    borderRadius: theme.radius.lg,
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightMedium,
    maxWidth: "100%",
    height: "auto",
    minHeight: theme.space.lg,
    "& .MuiChip-label": {
      whiteSpace: "normal",
      paddingBlock: theme.space.xs,
      paddingInline: theme.space.sm,
    },
  };
});

export const AppStatusBadge = React.forwardRef<
  HTMLDivElement,
  AppStatusBadgeProps
>(({ status, ...props }, ref) => (
  <StyledStatusBadge {...props} ref={ref} status={status} variant="filled" />
));
AppStatusBadge.displayName = "AppStatusBadge";
