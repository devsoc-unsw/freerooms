import type {
  ThemeOptions,
  TypographyVariant,
  TypographyVariantsOptions,
} from "@mui/material/styles";
import type { CSSProperties } from "react";

type CustomTypographyVariant =
  | "brand"
  | "cardTitle"
  | "sectionHeading"
  | "heroSubtitle"
  | "heroWordmark"
  | "metadata"
  | "filterTitle"
  | "filterOption";

type AppTypographyOptions = TypographyVariantsOptions &
  Partial<Record<CustomTypographyVariant, CSSProperties>>;

export const fontFamily = 'var(--font-dm-sans), "DM Sans", sans-serif';

export const typography = {
  fontFamily,
  htmlFontSize: 16,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  body1: { fontSize: 16, lineHeight: 1.5, fontWeight: 400 },
  body2: { fontSize: 12, lineHeight: 1.5, fontWeight: 400 },
  button: {
    fontSize: 16,
    lineHeight: "normal",
    fontWeight: 500,
    letterSpacing: 0,
    textTransform: "none",
  },
  h1: { fontSize: 64, lineHeight: "normal", fontWeight: 700 },
  h2: {
    fontSize: 48,
    lineHeight: "normal",
    fontWeight: 700,
    letterSpacing: "0.005em",
  },
  h3: { fontSize: 24, lineHeight: "normal", fontWeight: 700 },
  h4: { fontSize: 20, lineHeight: "normal", fontWeight: 700 },
  h5: { fontSize: 16, lineHeight: "normal", fontWeight: 500 },
  h6: { fontSize: 16, lineHeight: "normal", fontWeight: 500 },
  subtitle1: { fontSize: 16, lineHeight: "normal", fontWeight: 500 },
  subtitle2: { fontSize: 12, lineHeight: "normal", fontWeight: 400 },
  caption: { fontSize: 12, lineHeight: 1, fontWeight: 400 },
  overline: {
    fontSize: 12,
    lineHeight: "normal",
    fontWeight: 500,
    textTransform: "none",
  },
  brand: { fontSize: 24, lineHeight: "normal", fontWeight: 700 },
  cardTitle: { fontSize: 20, lineHeight: "normal", fontWeight: 700 },
  sectionHeading: { fontSize: 64, lineHeight: "normal", fontWeight: 700 },
  heroSubtitle: {
    fontSize: 48,
    lineHeight: "normal",
    fontWeight: 700,
    letterSpacing: "0.005em",
  },
  heroWordmark: {
    fontSize: 200,
    lineHeight: "normal",
    fontWeight: 900,
    letterSpacing: "-0.05em",
  },
  metadata: { fontSize: 12, lineHeight: 1, fontWeight: 400 },
  filterTitle: {
    fontFamily,
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 500,
  },
  filterOption: {
    fontFamily,
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 400,
  },
} satisfies AppTypographyOptions;
