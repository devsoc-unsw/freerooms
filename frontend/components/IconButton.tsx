"use client";

import { type ButtonProps } from "@mui/material/Button";
import Link from "next/link";
import React from "react";

import { AppButton } from "./ui";

interface StyledIconButtonProps extends ButtonProps {
  active?: boolean;
  href?: string;
}

const StyledIconButton: React.FC<StyledIconButtonProps> = ({
  children,
  active,
  sx,
  ...otherProps
}) => (
  <AppButton
    {...otherProps}
    sx={[
      { padding: (theme) => theme.spacing(1), minWidth: 0 },
      ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
    ]}
    LinkComponent={Link}
    variant={active ? "contained" : "outlined"}
  >
    {children}
  </AppButton>
);

export default StyledIconButton;