"use client";

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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        format="DD/MM/YY"
        value={dayjs(datetime)}
        onChange={(value) =>
          value && dispatch(setDatetime(toSydneyTime(value.toDate())))
        }
        sx={{
          width: 140,
          // No easier way to change the height
          "& .MuiInputBase-root": {
            height: 45,
          },
        }}
        aria-label="date-picker"
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
