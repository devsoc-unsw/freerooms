export type ThemeMode = "light" | "dark";

const values = {
    light: {
        accentPrimary: "#D4613C",
        accentSecondary: "#FEB99C",
        accentTertiary: "#FDD7c7",
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
        availableText: "#00500E",
        unavailable: "#FF6060",
        unavailableBackground: "rgba(255, 96, 96, 0.4)",
        unavailableText: "#AD0000",
    },
    dark: {
        accentPrimary: "rgba(212, 97, 60, 0.8)",
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
    },
} as const;


export function getColours(mode: ThemeMode) {
    const c = values[mode];

    return {
        accent: {
            primary: c.accentPrimary,
            secondary: c.accentSecondary,
            tertiary: c.accentTertiary,
            quaternary: c.accentQuaternary,
        },
        text: {
            primary: c.labelPrimary,
            secondary: c.labelDeemphasized,
            disabled: c.disabledText,
            onAccent: "#FFFFFF",
        },
        background: {
            primary: c.backgroundPrimary,
        },
        surface: {
            paper: c.paper,
            zebra: c.tableZebra,
        },
        border: {
            default: c.accentTertiary,
            disabled: c.disabledOutline,
        },
        status: {
            available: {
                main: c.available,
                background: c.availableBackground,
                text: c.availableText,
            },
            unavailable: {
                main: c.unavailable,
                background: c.unavailableBackground,
                text: c.unavailableText,
            },
        },
        disabled: {
            background: c.disabledBackground,
            text: c.disabledText,
        },
    };
}

export type AppColours = ReturnType<typeof getColours>;

export function getColourVariables(colours: AppColours): Record<string, string> {
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