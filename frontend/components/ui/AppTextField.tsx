"use client";

import { getOutlinedFieldStyles } from "@frontend/theme/fieldStyles";
import { styled } from "@mui/material/styles";
import MuiTextField from "@mui/material/TextField";

export const AppTextField = styled(MuiTextField)(({ theme }) =>
  getOutlinedFieldStyles(theme)
);
