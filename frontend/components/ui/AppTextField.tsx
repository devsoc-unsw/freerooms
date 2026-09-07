"use client";

import { styled } from "@mui/material/styles";
import MuiTextField from "@mui/material/TextField";

export const AppTextField = styled(MuiTextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.colours.surface.paper,
    color: theme.colours.text.primary,
    borderRadius: theme.radius.lg,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.colours.border.default,
    },
    "&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline":
      {
        borderColor: theme.colours.accent.primary,
      },
    "&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.colours.accent.primary,
    },
    "&.Mui-disabled": {
      backgroundColor: theme.colours.disabled.background,
    },
  },
  "& .MuiInputLabel-root:not(.Mui-error):not(.Mui-focused):not(.Mui-disabled)":
    {
      color: theme.colours.text.secondary,
    },
  "& .MuiInputBase-input::placeholder": {
    color: theme.colours.text.secondary,
    opacity: 1,
  },
  "& .MuiFormHelperText-root:not(.Mui-error)": {
    color: theme.colours.text.secondary,
  },
}));
