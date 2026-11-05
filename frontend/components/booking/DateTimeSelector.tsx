import DropdownField from "@frontend/components/booking/DropdownField";
import { SYDNEY_TIMEZONE } from "@frontend/utils/toSydneyTime";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Box from "@mui/material/Box";
import { type Theme, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { MultiSectionDigitalClock } from "@mui/x-date-pickers/MultiSectionDigitalClock";
import { differenceInMinutes, format, isSameDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import React, { useState } from "react";

const getSelectedStyles = (theme: Theme) => ({
  backgroundColor: theme.colours.accent.secondary,
  color: theme.colours.text.primary,
});

const DateTimeSelector = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date;
  onChange: (value: Date) => void;
}) => {
  const theme = useTheme();
  // MUI's DateCalendar has a fixed size. It is scaled down to fit under its field.
  const { calendarWidth, calendarHeight } = theme.sizes.picker;
  const [now] = useState(() => toZonedTime(new Date(), SYDNEY_TIMEZONE));

  const isToday = isSameDay(value, now);
  const isNow = Math.abs(differenceInMinutes(value, now)) < 1;
  const dateLabel = `${format(value, "do MMMM")}${isToday ? " (today)" : ""}`;
  const timeLabel = `${format(value, "h:mm aaa")}${isNow ? " (now)" : ""}`;

  return (
    <Box>
      <Typography
        variant="filterOption"
        sx={{ marginBottom: (theme) => `${theme.space.xs}px` }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", gap: (theme) => `${theme.space.md}px` }}>
        <DropdownField
          icon={<CalendarMonthOutlinedIcon fontSize="small" />}
          label={dateLabel}
        >
          {(close, anchorWidth) => {
            const scale = Math.min(1, anchorWidth / calendarWidth);
            return (
              <Box
                sx={{
                  width: calendarWidth * scale,
                  height: calendarHeight * scale,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: calendarWidth,
                    height: calendarHeight,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <DateCalendar
                    value={value}
                    onChange={(next) => {
                      if (next) {
                        onChange(next);
                        close();
                      }
                    }}
                    sx={(theme) => ({
                      "& .MuiPickersCalendarHeader-root": {
                        margin: 0,
                        padding: `${theme.space.sm}px ${theme.space.md}px`,
                        backgroundColor: theme.colours.accent.secondary,
                        justifyContent: "space-between",
                      },
                      // Re-order MUIPickersCalendar so label sits in the middle of the two arrows
                      "& .MuiPickersCalendarHeader-labelContainer": {
                        order: 2,
                        flexGrow: 1,
                        justifyContent: "center",
                        margin: 0,
                      },
                      "& .MuiPickersCalendarHeader-switchViewButton": {
                        marginRight: 0,
                      },
                      "& .MuiPickersArrowSwitcher-root": {
                        display: "contents",
                      },
                      "& .MuiPickersArrowSwitcher-spacer": { display: "none" },
                      "& .MuiPickersArrowSwitcher-button:first-of-type": {
                        order: 1,
                      },
                      "& .MuiPickersArrowSwitcher-button:last-of-type": {
                        order: 3,
                      },
                      "& .MuiPickersDay-root": {
                        borderRadius: `${theme.radius.md}px`,
                        "&.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus":
                          getSelectedStyles(theme),
                      },
                    })}
                  />
                </Box>
              </Box>
            );
          }}
        </DropdownField>

        <DropdownField
          icon={<AccessTimeOutlinedIcon fontSize="small" />}
          label={timeLabel}
        >
          {() => (
            <MultiSectionDigitalClock
              value={value}
              onChange={(next) => next && onChange(next)}
              ampm
              timeSteps={{ hours: 1, minutes: 5 }}
              sx={(theme) => ({
                // no divider lines between the H/M/AM:PM columns
                "& .MuiMultiSectionDigitalClockSection-root": {
                  borderLeft: "none",
                },
                "& .MuiMultiSectionDigitalClockSection-root:not(:first-of-type)":
                  {
                    borderLeft: "none",
                  },
                "& .MuiMultiSectionDigitalClockSection-item": {
                  "&.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus":
                    getSelectedStyles(theme),
                },
              })}
            />
          )}
        </DropdownField>
      </Box>
    </Box>
  );
};

export default DateTimeSelector;
