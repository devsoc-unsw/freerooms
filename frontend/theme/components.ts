import { getColourVariables } from "@frontend/theme/colours";
import { getLayoutVariables } from "@frontend/theme/variables";
import type { Components, Theme } from "@mui/material/styles";

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
    defaultProps: { disableElevation: true, disableRipple: true },
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
  MuiPopover: {
    defaultProps: {
      disableScrollLock: true,
    },
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.colours.surface.paper,
        borderWidth: theme.sizes.border.weight,
        borderStyle: "solid",
        borderColor: theme.colours.accent.secondary,
        borderRadius: theme.radius.lg,
        boxShadow: `4px 4px 8px 0px ${theme.colours.shadow.default}`,
        padding: theme.space.sm,
        marginTop: theme.space.md,
        gap: theme.space.lg,
      }),
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: "inherit",
      }),
    },
  },
  MuiIconButton: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.colours.text.primary,
      }),
    },
  },
};
