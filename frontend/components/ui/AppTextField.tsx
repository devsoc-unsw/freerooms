"use client";

import { styled } from "@mui/material/styles";
import MuiTextField from "@mui/material/TextField";

import { getOutlinedFieldStyles } from "@frontend/theme/fieldStyles";

export const AppTextField = styled(MuiTextField)(({ theme }) =>
  getOutlinedFieldStyles(theme)
);
