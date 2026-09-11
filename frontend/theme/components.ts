import type { Components, Theme } from "@mui/material/styles";

import { getColourVariables } from "./colours";
import { getLayoutVariables } from "./variables";

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      ":root": {
        ...getColourVariables(theme.colours),
        ...getLayoutVariables(),
      },
      "html, body": { fontFamily: theme.typography.fontFamily },
      body: {
        backgroundColor: theme.colours.background.primary,
        color: theme.colours.text.primary,
      },
    }),
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        h1: "h1",
        h2: "h2",
        h3: "h3",
        h4: "h4",
        h5: "h5",
        h6: "h6",
        body1: "p",
        body2: "p",
        brand: "span",
        cardTitle: "h3",
        sectionHeading: "h2",
        heroSubtitle: "p",
        heroWordmark: "h1",
        metadata: "span",
      },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.radius.md,
        fontWeight: theme.typography.fontWeightMedium,
        textTransform: "none",
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({ borderRadius: theme.radius.lg }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({ borderRadius: theme.radius.md }),
    },
  },
  MuiRating: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.colours.rating.active,
      }),
      iconEmpty: ({ theme }) => ({
        color: theme.colours.rating.empty,
      }),
    },
  },
};
