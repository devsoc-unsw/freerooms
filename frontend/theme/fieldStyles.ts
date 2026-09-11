import type { CSSObject, Theme } from "@mui/material/styles";

export function getOutlinedFieldStyles(theme: Theme): CSSObject {
  const colours = theme.colours;

  return {
    "& .MuiOutlinedInput-root": {
      backgroundColor: colours.surface.paper,
      color: colours.text.primary,
      borderRadius: theme.radius.lg,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: colours.border.default,
      },
      "&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline":
        {
          borderColor: colours.accent.primary,
        },
      "&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline": {
        borderColor: colours.accent.primary,
      },
      "&.Mui-disabled": {
        backgroundColor: colours.disabled.background,
      },
    },
    "& .MuiInputLabel-root:not(.Mui-error):not(.Mui-focused):not(.Mui-disabled)":
      {
        color: colours.text.secondary,
      },
    "& .MuiInputBase-input::placeholder": {
      color: colours.text.secondary,
      opacity: 1,
    },
    "& .MuiFormHelperText-root:not(.Mui-error)": {
      color: colours.text.secondary,
    },
  };
}

export function getPickerFieldStyles(theme: Theme): CSSObject {
  return {
    ...getOutlinedFieldStyles(theme),
    width: 133,
    "& .MuiInputBase-root": {
      height: 56,
    },
    "& .MuiInputBase-input": {
      fontSize: theme.typography.button.fontSize,
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.colours.text.secondary,
    },
    "& .MuiInputAdornment-root svg": {
      color: theme.colours.text.secondary,
    },
  };
}
