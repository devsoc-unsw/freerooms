"use client";

import { useTheme } from "@mui/material/styles";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React from "react";

import { selectDatetime, setDatetime } from "../redux/datetimeSlice";
import { useDispatch, useSelector } from "../redux/hooks";
import toSydneyTime from "../utils/toSydneyTime";

const TimePicker = () => {
  const dispatch = useDispatch();
  const datetime = useSelector(selectDatetime);
  const theme = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopTimePicker
        value={dayjs(datetime)}
        onChange={(value) =>
          value && dispatch(setDatetime(toSydneyTime(value.toDate())))
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
                borderWidth: 2,
              },
              "& .MuiInputBase-input": {
                fontFamily: "TT Commons Pro Trial Variable",
                fontSize: 16,
                fontWeight: 500,
                color:
                  theme.palette.mode === "light"
                    ? theme.palette.text.secondary
                    : "#FFFFFF",
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
