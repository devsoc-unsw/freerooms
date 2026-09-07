import MuiButton, { type ButtonProps } from "@mui/material/Button";
import MuiIconButton, { type IconButtonProps } from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import React from "react";

import { getControlStyles } from "../../theme/controlStyles";

export type AppButtonProps = Omit<ButtonProps, "color"> & {
  selected?: boolean;
};

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "selected",
})<AppButtonProps>(({ theme, selected, variant }) => {
  const styles = getControlStyles(theme);

  return {
    ...styles.base,
    ...(selected
      ? styles.selected
      : variant === "contained"
        ? styles.primary
        : variant === "text"
          ? styles.text
          : styles.outlined),
  };
});

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    { selected = false, variant = "outlined", type = "button", ...props },
    ref
  ) => (
    <StyledButton
      {...props}
      ref={ref}
      type={type}
      color="primary"
      variant={variant}
      selected={selected}
      disableElevation
    />
  )
);
AppButton.displayName = "AppButton";

export type AppIconButtonProps = Omit<IconButtonProps, "color"> & {
  selected?: boolean;
  "aria-label": string;
};

const StyledIconButton = styled(MuiIconButton, {
  shouldForwardProp: (prop) => prop !== "selected",
})<AppIconButtonProps>(({ theme, selected }) => {
  const styles = getControlStyles(theme);

  return {
    ...styles.base,
    ...(selected ? styles.selected : styles.outlined),
    padding: theme.space.sm,
  };
});

export const AppIconButton = React.forwardRef<
  HTMLButtonElement,
  AppIconButtonProps
>(({ selected = false, type = "button", ...props }, ref) => (
  <StyledIconButton
    {...props}
    ref={ref}
    type={type}
    color="primary"
    selected={selected}
  />
));
AppIconButton.displayName = "AppIconButton";
