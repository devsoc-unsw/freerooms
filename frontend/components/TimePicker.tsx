"use client";

import { useTheme } from "@mui/material/styles";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enAU } from "date-fns/locale";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import React from "react";

import { selectDatetime, setDatetime } from "../redux/datetimeSlice";
import { useDispatch, useSelector } from "../redux/hooks";
import { SYDNEY_TIMEZONE } from "../utils/toSydneyTime";
import { getPickerFieldStyles } from "../theme/fieldStyles";

const TimePicker = () => {
  const dispatch = useDispatch();
  const datetime = useSelector(selectDatetime);
  const theme = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
      <DesktopTimePicker
        value={toZonedTime(datetime, SYDNEY_TIMEZONE)}
        onChange={(value: Date | null) =>
          value && dispatch(setDatetime(fromZonedTime(value, SYDNEY_TIMEZONE)))
        }
        format="hh:mm a"
        slotProps={{
          textField: {
            variant: "outlined",
            sx: getPickerFieldStyles(theme),
          },
        }}
        aria-label="time-picker"
      />
    </LocalizationProvider>
  );
};

export default TimePicker;
