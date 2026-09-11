import { createTheme, type PaletteOptions } from "@mui/material/styles";

import { getColours, type ThemeMode } from "./colours";
import { components } from "./components";
import { radius, space } from "./spacing";
import { typography } from "./typography";
import { sizes } from "./sizes";

export function createAppTheme(mode: ThemeMode) {
  const colours = getColours(mode);

  const palette: PaletteOptions = {
    mode,
    primary: {
      main: colours.accent.primary,
      light: colours.accent.secondary,
      dark: colours.accent.hover,
      contrastText: colours.text.onAccent,
    },
    secondary: {
      main: colours.accent.secondary,
      contrastText: colours.text.primary,
    },
    success: {
      main: colours.status.available.text,
      light: colours.status.available.main,
    },
    error: {
      main: colours.status.unavailable.text,
      light: colours.status.unavailable.main,
    },
    warning: {
      main: colours.status.soon.main,
      light: colours.status.soon.main,
    },
    background: {
      default: colours.background.primary,
      paper: colours.surface.paper,
    },
    text: {
      primary: colours.text.primary,
      secondary: colours.text.secondary,
      disabled: colours.text.disabled,
    },
    divider: colours.border.default,
    action: {
      disabled: colours.disabled.text,
      disabledBackground: colours.disabled.background,
      hover: colours.accent.quaternary,
      selected: colours.accent.tertiary,
    },
  };

  return createTheme({
    palette,
    colours,
    space,
    radius,
    sizes,
    shape: { borderRadius: radius.md },
    typography,
    components,
  });
}
