"use client";

import { useTheme } from "@mui/material/styles";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enAU } from "date-fns/locale";
import React from "react";

import { selectDatetime, setDatetime } from "../redux/datetimeSlice";
import { useDispatch, useSelector } from "../redux/hooks";
import toSydneyTime from "../utils/toSydneyTime";

const TimePicker = () => {
  const dispatch = useDispatch();
  const datetime = useSelector(selectDatetime);
  const theme = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
      <DesktopTimePicker
        value={datetime}
        onChange={(value: Date | null) =>
          value && dispatch(setDatetime(toSydneyTime(value)))
        }
        format="hh:mm a"
        slotProps={{
          textField: {
            sx: {
              svg: {
                color: theme.palette.mode === "light" ? "#6C6562" : "#FFFFFF",
              },
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
                color:
                  theme.palette.mode === "light"
                    ? theme.palette.text.secondary
                    : "#FFFFFF",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#CBC4C1",
                },
              },
            },
          },
        }}
        aria-label="time-picker"
      />
    </LocalizationProvider>
  );
};

export default TimePicker;
