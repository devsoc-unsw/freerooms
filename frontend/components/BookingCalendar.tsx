"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { Booking } from "@common/types";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box, { BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import { grey } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, getDay, isToday, parse, startOfWeek } from "date-fns";
import { enAU } from "date-fns/locale";
import React from "react";
import type { DateRange, View } from "react-big-calendar";
import type { NavigateAction, ToolbarProps } from "react-big-calendar";
import {
  Calendar,
  dateFnsLocalizer,
  DateLocalizer,
  Views,
} from "react-big-calendar";

import { selectDatetime } from "../redux/datetimeSlice";
import { useSelector } from "../redux/hooks";
import CircularRating from "./CircularRating";

const ToolBarButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.secondary.main,
  color: theme.palette.text.primary,
  fontSize: "12px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    color: "#fff",
  },
}));

const ViewToggleButton = styled(ToggleButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "12px",
  textTransform: "none",
  transition: "all 0.1s ease-in-out",
  "&.Mui-selected, &.Mui-selected:hover": {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    color: "#fff",
  },
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
}));

const CustomToolBar: React.FC<ToolbarProps> = ({
  view,
  onNavigate,
  onView,
}) => {
  const navigationControls: { [index: string]: NavigateAction } = {
    Previous: "PREV",
    Today: "TODAY",
    Next: "NEXT",
  };

  const viewControls: { [index: string]: View } = {
    Week: "week",
    Day: "day",
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      mb={2}
      sx={(theme) => ({
        [theme.breakpoints.down("md")]: {
          display: "none",
        },
      })}
    >
      <ButtonGroup sx={{ height: 30 }}>
        {Object.entries(navigationControls).map(
          ([displayText, navKey], index) => (
            <ToolBarButton key={index} onClick={() => onNavigate(navKey)}>
              {displayText}
            </ToolBarButton>
          )
        )}
      </ButtonGroup>
      <ToggleButtonGroup value={view} exclusive sx={{ height: 30 }}>
        {Object.entries(viewControls).map(([displayText, viewKey], index) => (
          <ViewToggleButton
            value={viewKey}
            key={index}
            onClick={() => onView(viewKey)}
          >
            {displayText}
          </ViewToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
};

const StyledCalendarContainer = styled(Box)<BoxProps & { view: View }>(
  ({ view, theme }) => ({
    "& .rbc-time-slot, & .rbc-day-slot, & .rbc-timeslot-group": {
      borderColor: `${theme.palette.background.paper} !important`,
    },
    "& .rbc-allday-cell": {
      display: "none",
    },
    "& .rbc-time-view .rbc-header": {
      borderColor: theme.palette.background.paper,
      borderBottom: "none",
    },
    "& .rbc-events-container": {
      borderColor: theme.palette.background.paper,
      margin: "1px !important",
    },
    "& .rbc-header": {
      padding: "5px 0",
      fontSize: 16,
    },
    "& .rbc-event-content": {
      fontWeight: 500,
    },
    "& .rbc-time-view": {
      borderColor: theme.palette.background.paper,
      boxShadow:
        "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
      border: "none",
      borderRadius: "12px",
    },
    "& .rbc-header:last-child, & .rbc-time-header": {
      borderTopRightRadius: "12px",
      borderRight: "none !important",
    },
    "& .rbc-time-content": {
      borderColor: theme.palette.background.paper,
      borderBottomLeftRadius: "12px",
      borderBottomRightRadius: "12px",
      ...(view === "day" && {
        borderTop: "none",
        borderTopRightRadius: "12px",
      }),
    },
  })
);

const BookingCalendar: React.FC<{ events: Array<Booking> }> = ({ events }) => {
  // Enforce day view on mobile
  const [currView, setCurrView] = React.useState<View>(Views.WEEK);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  React.useEffect(() => {
    setCurrView(isMobile ? Views.DAY : Views.WEEK);
  }, [isMobile]);
  const datetime = useSelector(selectDatetime);
  const [date, setDate] = React.useState<Date>(datetime);
  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate ?? datetime);
  };

  const { components, getNow, localizer, myEvents, scrollToTime } =
    React.useMemo(() => {
      return {
        components: {
          toolbar: CustomToolBar,
        },
        getNow: () => new Date(),
        localizer: dateFnsLocalizer({
          format,
          parse,
          startOfWeek,
          getDay,
          locales: enAU,
        }),
        myEvents: events,
        scrollToTime: datetime,
      };
    }, [datetime, events]);

  const formatTime = (
    date: Date,
    culture: string | undefined,
    localizer?: DateLocalizer
  ) => {
    if (!localizer) {
      throw new Error("No date localizer");
    }
    let res = localizer.format(date, "h", culture);
    if (date.getMinutes() !== 0) {
      res += localizer.format(date, ":mm", culture);
    }
    res += localizer.format(date, " a", culture);
    return res;
  };

  const formatTimeRange = (
    { start, end }: DateRange,
    culture: string | undefined,
    localizer?: DateLocalizer
  ) => {
    return (
      formatTime(start, culture, localizer) +
      " - " +
      formatTime(end, culture, localizer)
    );
  };

  // Only render booking type on day view (wide)
  const titleAccessor = React.useCallback(
    (booking: Booking): string => {
      if (currView == Views.DAY) {
        return `${booking.name} (${booking.bookingType})`;
      } else {
        return booking.name;
      }
    },
    [currView]
  );

  const timeInDay = 24 * 60 * 60 * 1000;

  return (
    <>
      <Stack justifyContent="flex-start" height="100%" width="100%" pt={3}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={1}
          width="100%"
          pb={2}
        >
          <Typography variant="h5" fontWeight="bold">
            Room Bookings
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction="row" alignItems="center">
              {isMobile && (
                <IconButton
                  aria-label="Previous day"
                  sx={{
                    borderRadius: 3,
                    mr: 1,
                  }}
                  onClick={() =>
                    handleDateChange(new Date(date.getTime() - timeInDay))
                  }
                >
                  <NavigateBeforeIcon
                    style={{ color: "#f57c00", fontSize: 40 }}
                  ></NavigateBeforeIcon>
                </IconButton>
              )}
              <DatePicker
                aria-label="Date picker"
                format="iii, d MMM yyyy"
                value={date}
                onChange={(newDate) => {
                  handleDateChange(newDate);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      svg: { color: theme.palette.text.primary },
                      input: { color: theme.palette.text.primary },
                      width: { xs: "100%", md: 200 },
                      borderColor: theme.palette.secondary.main,
                    },
                  },
                }}
              />
              {isMobile && (
                <IconButton
                  aria-label="Next day"
                  sx={{
                    borderRadius: 3,
                    ml: 1,
                  }}
                  onClick={() =>
                    handleDateChange(new Date(date.getTime() + timeInDay))
                  }
                >
                  <NavigateNextIcon
                    style={{ color: "#f57c00", fontSize: 40 }}
                  ></NavigateNextIcon>
                </IconButton>
              )}
            </Stack>
          </LocalizationProvider>
        </Stack>
        <StyledCalendarContainer
          aria-label="Room Booking Calendar"
          overflow="auto"
          p={0.5}
          role="table"
          view={currView}
        >
          <Calendar
            components={components}
            dayLayoutAlgorithm={"no-overlap"}
            date={date}
            onNavigate={handleDateChange}
            defaultView={Views.WEEK}
            events={myEvents}
            titleAccessor={titleAccessor}
            tooltipAccessor={({ name, bookingType }) =>
              `${name} (${bookingType})`
            }
            getNow={getNow}
            localizer={localizer}
            scrollToTime={scrollToTime}
            view={currView}
            onView={setCurrView}
            eventPropGetter={() => ({
              style: {
                backgroundColor: "#f57c00",
                borderColor: "#f57c00",
                opacity: theme.palette.mode === "light" ? 1 : 0.8,
              },
            })}
            slotGroupPropGetter={() => ({ style: { minHeight: "50px" } })}
            dayPropGetter={(date) => ({
              style: {
                backgroundColor: isToday(date)
                  ? theme.palette.mode === "light"
                    ? "#fff3e0"
                    : grey[900]
                  : theme.palette.background.default,
              },
            })}
            min={new Date(0, 0, 0, 9)}
            showMultiDayTimes={true}
            formats={{
              timeGutterFormat: formatTime,
              eventTimeRangeFormat: formatTimeRange,
            }}
          />
        </StyledCalendarContainer>
        <Box display="flex" flexDirection="row-reverse" mt={2} gap={9} pr={14}>
          <CircularRating category="ACK" rating={5} />
          <CircularRating category="Quietness" rating={3.5} />
          <CircularRating category="Cleanliness" rating={4} />
        </Box>
      </Stack>
    </>
  );
};

export default BookingCalendar;
