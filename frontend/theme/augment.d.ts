import type { CSSProperties } from "react";

import type { AppColours } from "./colours"
import type { radius, space} from "./space";

declare module "@mui/material/styles" {
    interface Theme {
        colours: AppColours;
        space: typeof space;
        radius: typeof radius;
    }

    interface ThemeOptions {
        colours?: AppColours;
        space?: typeof space;
        radius?: typeof radius;
    }

    interface TypographyVariants {
        brand: CSSProperties;
        cardTitle: CSSProperties;
        sectionHeading: CSSProperties;
        heroSubtitle: CSSProperties;
        heroWordmark: CSSProperties;
        metadata: CSSProperties;
    }

    interface TypographyVariantOptions {
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