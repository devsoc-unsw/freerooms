import type { CSSObject, Theme } from "@mui/material/styles";

type ControlStyle = "base" | "primary" | "outlined" | "selected" | "text";

export function getControlStyles(theme: Theme): Record<ControlStyle, CSSObject> {
  const colours = theme.colours;

  return {
    base: {
      ...theme.typography.button,
      borderRadius: theme.radius.lg,
      transition: theme.transitions.create(["background-color", "border-color", "color"], {
        duration: theme.transitions.duration.shorter,
      }),
      "&.Mui-focusVisible": {
        outline: `2px solid ${colours.accent.primary}`,
        outlineOffset: 2,
      },
      "&.Mui-disabled": {
        backgroundColor: colours.disabled.background,
        color: colours.disabled.text,
        borderColor: colours.border.disabled,
      },
      "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
      },
    },
    primary: {
      backgroundColor: colours.accent.primary,
      color: colours.text.onAccent,
      "&:not(.Mui-disabled):hover": {
        backgroundColor: colours.accent.hover,
      },
    },
    outlined: {
      backgroundColor: "transparent",
      color: colours.text.primary,
      border: `1px solid ${colours.border.default}`,
      "&:not(.Mui-disabled):hover": {
        backgroundColor: colours.accent.quaternary,
        borderColor: colours.accent.primary,
      },
    },
    selected: {
      backgroundColor: colours.accent.tertiary,
      color: colours.text.primary,
      border: `1px solid ${colours.accent.primary}`,
      "&:not(.Mui-disabled):hover": {
        backgroundColor: colours.accent.secondary,
      },
    },
    text: {
      color: colours.accent.primary,
      "&:not(.Mui-disabled):hover": {
        backgroundColor: colours.accent.quaternary,
      },
    },
  };
}