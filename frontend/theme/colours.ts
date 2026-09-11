export type ThemeMode = "light" | "dark";

const values = {
  light: {
    accentPrimary: "#D4613C",
    accentSecondary: "#FEB99C",
    accentTertiary: "#FDD7C7",
    accentQuaternary: "#FDE7E1",
    labelPrimary: "#632410",
    labelDeemphasized: "#926658",
    disabledText: "#848484",
    backgroundPrimary: "#FFFBF9",
    paper: "#FFFFFF",
    tableZebra: "#FEF5F3",
    disabledOutline: "#AFAFAF",
    disabledBackground: "#D3D3D3",
    available: "#2FB702",
    availableBackground: "rgba(47, 183, 2, 0.4)",
    availableText: "#00600E",
    unavailable: "#FF6060",
    unavailableBackground: "rgba(255, 96, 96, 0.4)",
    unavailableText: "#AD0000",
    accentHover: "#9C4326",
    backgroundMuted: "#F0F0F0",
    toolbar: "#F8F8F9",
    yellow: "#FFA600",
  },
  dark: {
    accentPrimary: "#D4613C",
    accentSecondary: "#6E3A24",
    accentTertiary: "#52372C",
    accentQuaternary: "#241C19",
    labelPrimary: "#FDF4F2",
    labelDeemphasized: "#B6B0AF",
    disabledText: "#787878",
    backgroundPrimary: "#101214",
    paper: "#101214",
    tableZebra: "#161313",
    disabledOutline: "#5B5B5B",
    disabledBackground: "#454545",
    available: "#008300",
    availableBackground: "rgba(0, 131, 0, 0.4)",
    availableText: "#6DB36C",
    unavailable: "#B62B32",
    unavailableBackground: "rgba(182, 43, 50, 0.4)",
    unavailableText: "#ED6353",
    accentHover: "#B75232",
    backgroundMuted: "#363636",
    toolbar: "#313132",
    yellow: "#863D00",
  },
} as const;

const neutral = {
  black: "#000000",
  white: "#FFFFFF",
} as const;

// Legacy until replaced
const controlNeutral = {
  light: "rgba(0, 0, 0, 0.12)",
  dark: "#424242",
} as const;

const mapLocation = {
  main: "#4ABDFA",
  border: "#BEDCF9",
} as const;

const mapColours = {
  availability: {
    available: "#66BB6A",
    soon: "#FFA726",
    unavailable: "#F44336",
  },
  route: "#EF6C02",
  popup: {
    light: "#EF6C02",
    dark: "#D4613C",
  },
} as const;

const calendarColours = {
  light: {
    grid: "#E0E0E0",
    today: "#FFF3E0",
  },
  dark: {
    grid: "#424242",
    today: "#212121",
  },
} as const;

const statusSoon = "#FFA600";
const ratingDisplay = "#D4613C";

export function getColours(mode: ThemeMode) {
  const c = values[mode];

  return {
    accent: {
      primary: c.accentPrimary,
      secondary: c.accentSecondary,
      tertiary: c.accentTertiary,
      quaternary: c.accentQuaternary,
      hover: c.accentHover,
    },
    text: {
      primary: c.labelPrimary,
      secondary: c.labelDeemphasized,
      disabled: c.disabledText,
      onAccent: neutral.white,
      onImage: neutral.white,
    },
    background: {
      primary: c.backgroundPrimary,
      muted: c.backgroundMuted,
    },
    surface: {
      paper: c.paper,
      appBar: c.backgroundPrimary,
      toolbar: c.toolbar,
      zebra: c.tableZebra,
      muted: c.backgroundMuted,
      control: controlNeutral[mode],
    },
    border: {
      default: c.accentTertiary,
      subtle: controlNeutral[mode],
      disabled: c.disabledOutline,
    },
    status: {
      available: {
        main: c.available,
        background: c.availableBackground,
        text: c.availableText,
      },
      soon: {
        main: statusSoon,
        text: statusSoon,
      },
      unavailable: {
        main: c.unavailable,
        background: c.unavailableBackground,
        text: c.unavailableText,
      },
    },
    rating: {
      active: c.yellow,
      empty: c.disabledOutline,
      display: ratingDisplay,
    },
    map: {
      location: mapLocation,
      availability: mapColours.availability,
      route: mapColours.route,
      popup: mapColours.popup[mode],
    },
    calendar: calendarColours[mode],
    neutral,
    disabled: {
      background: c.disabledBackground,
      text: c.disabledText,
    },
  };
}

export type AppColours = ReturnType<typeof getColours>;

export function getColourVariables(
  colours: AppColours
): Record<string, string> {
  const variables: Record<string, string> = {};

  const add = (value: unknown, path: string) => {
    if (typeof value === "string") {
      variables[`--colour-${path}`] = value;
    } else if (value && typeof value === "object") {
      Object.entries(value).forEach(([key, child]) => {
        add(child, path ? `${path}-${key}` : key);
      });
    }
  };

  add(colours, "");
  return variables;
}
