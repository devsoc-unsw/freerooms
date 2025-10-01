"use client";

import { useTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React from "react";

import { selectDatetime, setDatetime } from "../redux/datetimeSlice";
import { useDispatch, useSelector } from "../redux/hooks";
import toSydneyTime from "../utils/toSydneyTime";

const DatePicker = () => {
  const dispatch = useDispatch();
  const datetime = useSelector(selectDatetime);
  const theme = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        format="DD/MM/YY"
        value={dayjs(datetime)}
        onChange={(value) =>
          value && dispatch(setDatetime(toSydneyTime(value.toDate())))
        }
        sx={{
          width: 133,
          "& .MuiInputBase-root": {
            height: 56,
            borderRadius: "8px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#CBC4C1",
            borderWidth: 2,
          },
          "& .MuiInputBase-input": {
            fontFamily: "TT Commons Pro Trial Variable",
            fontSize: 16,
            fontWeight: 500,
            color: theme.palette.mode === "light" ? "#6C6562" : "#FFFFFF",
          },
          "& .MuiInputAdornment-root svg": {
            color: theme.palette.mode === "light" ? "#6C6562" : "#FFFFFF",
          },
        }}
        aria-label="date-picker"
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
