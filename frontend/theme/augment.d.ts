import type { CSSProperties } from "react";

import type { AppColours } from "./colours";
import type { sizes } from "./sizes";
import type { radius, space } from "./spacing";

declare module "@mui/material/styles" {
  interface Theme {
    colours: AppColours;
    space: typeof space;
    radius: typeof radius;
    sizes: typeof sizes;
  }

  interface ThemeOptions {
    colours?: AppColours;
    space?: typeof space;
    radius?: typeof radius;
    sizes?: typeof sizes;
  }
}

declare module "@mui/material/styles/createTypography" {
  interface TypographyVariants {
    brand: CSSProperties;
    cardTitle: CSSProperties;
    sectionHeading: CSSProperties;
    heroSubtitle: CSSProperties;
    heroWordmark: CSSProperties;
    metadata: CSSProperties;
  }

  interface TypographyVariantsOptions {
    brand?: CSSProperties;
    cardTitle?: CSSProperties;
    sectionHeading?: CSSProperties;
    heroSubtitle?: CSSProperties;
    heroWordmark?: CSSProperties;
    metadata?: CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    brand: true;
    cardTitle: true;
    sectionHeading: true;
    heroSubtitle: true;
    heroWordmark: true;
    metadata: true;
  }
}
