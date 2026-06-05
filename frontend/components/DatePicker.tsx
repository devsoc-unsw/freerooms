"use client";

import { useTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enAU } from "date-fns/locale";
import React from "react";

import { selectDatetime, setDatetime } from "../redux/datetimeSlice";
import { useDispatch, useSelector } from "../redux/hooks";
import toSydneyTime from "../utils/toSydneyTime";

const DatePicker = () => {
  const dispatch = useDispatch();
  const datetime = useSelector(selectDatetime);
  const theme = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
      <DesktopDatePicker
        format="dd/MM/yy"
        value={datetime}
        onChange={(value: Date | null) =>
          value && dispatch(setDatetime(toSydneyTime(value)))
        }
        sx={{
          width: 133,
          "& .MuiInputBase-root": {
            height: 56,
            borderRadius: "8px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#CBC4C1",
            borderWidth: 1,
          },
          "& .MuiInputBase-input": {
            fontSize: 16,
            fontWeight: 500,
            color: theme.palette.mode === "light" ? "#6C6562" : "#FFFFFF",
          },
          "& .MuiInputAdornment-root svg": {
            color: theme.palette.mode === "light" ? "#6C6562" : "#FFFFFF",
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#CBC4C1",
            },
          },
        }}
        aria-label="date-picker"
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
