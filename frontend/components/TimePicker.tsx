"use client";

import { styled, useTheme } from "@mui/material/styles";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React from "react";

import { selectDatetime, setDatetime } from "../redux/datetimeSlice";
import { useDispatch, useSelector } from "../redux/hooks";
import toSydneyTime from "../utils/toSydneyTime";

const StyledTimePicker = styled(DesktopTimePicker)({
  height: 45,
  width: 140,
  padding: 20,
  display: "flex",
  flexDirection: "row",
  alignSelf: "center",
  justifyItems: "center",
  position: "relative",
});

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
        slotProps={{
          textField: {
            sx: {
              svg: { color: theme.palette.text.primary },
              input: { color: theme.palette.text.primary },
              width: 140,
              // No easier way to change the height
              "& .MuiInputBase-root": {
                height: 45,
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default TimePicker;
