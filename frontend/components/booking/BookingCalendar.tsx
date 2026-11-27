"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";

import useBookingCalendarQuery from "@frontend/hooks/bookings/useBookingCalendarQuery";
import { useSelector } from "@frontend/redux/hooks";
import { selectDatetime } from "@frontend/redux/slices/datetimeSlice";
import { space } from "@frontend/theme";
import { getBookingTypeAppearance } from "@frontend/utils/bookingAppearance";
import { getBookingTypeLabel } from "@frontend/utils/bookingFormatting";
import getBookingHref from "@frontend/utils/getBookingHref";
import toSydneyTime from "@frontend/utils/toSydneyTime";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box, { BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { alpha, styled, useTheme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Booking } from "common/types";
import { format, getDay, isSameDay, parse, startOfWeek } from "date-fns";
import { enAU } from "date-fns/locale";
import { useRouter } from "next/navigation";
import React from "react";
import type { DateRange, View } from "react-big-calendar";
import type {
  EventProps,
  NavigateAction,
  ToolbarProps,
} from "react-big-calendar";
import {
  Calendar,
  dateFnsLocalizer,
  DateLocalizer,
  Views,
} from "react-big-calendar";

const ToolBarButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.divider,
  color: theme.palette.text.primary,
  fontSize: theme.typography.pxToRem(12),
  textTransform: "none",

  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
}));

const ViewToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderColor: theme.palette.divider,
  color: theme.palette.text.primary,
  fontSize: theme.typography.pxToRem(12),
  textTransform: "none",
  transition: "all 120ms ease",

  "&.Mui-selected, &.Mui-selected:hover": {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    color: theme.colours.text.onAccent,
  },

  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
}));

const CustomToolBar: React.FC<ToolbarProps<Booking>> = ({
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
      sx={(theme) => ({
        justifyContent: "space-between",
        marginBottom: theme.space.sm,
        [theme.breakpoints.down("md")]: {
          display: "none",
        },
      })}
    >
      <ButtonGroup sx={(theme) => ({ height: theme.sizes.control.sm })}>
        {Object.entries(navigationControls).map(
          ([displayText, navKey], index) => (
            <ToolBarButton key={index} onClick={() => onNavigate(navKey)}>
              {displayText}
            </ToolBarButton>
          )
        )}
      </ButtonGroup>
      <ToggleButtonGroup
        value={view}
        exclusive
        sx={(theme) => ({ height: theme.sizes.control.sm })}
      >
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

const CalendarBookingEvent = ({ event, title }: EventProps<Booking>) => {
  const { icon: Icon } = getBookingTypeAppearance(event.bookingType);
  const typeLabel = getBookingTypeLabel(event.bookingType);

  return (
    <span>
      <Icon titleAccess={typeLabel} />
      {title}
    </span>
  );
};

const StyledCalendarContainer = styled(Box)<BoxProps & { view: View }>(
  ({ view, theme }) => ({
    "& .rbc-calendar": {
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.primary,
      fontSize: theme.typography.pxToRem(14),
    },

    "& .rbc-time-slot, & .rbc-day-slot, & .rbc-timeslot-group": {
      borderColor: `${theme.colours.calendar.grid} !important`,
    },

    "& .rbc-time-content > * + * > *, & .rbc-header + .rbc-header": {
      borderColor: theme.colours.calendar.grid,
    },

    "& .rbc-time-header-content, & .rbc-time-content": {
      borderColor: theme.colours.calendar.grid,
    },

    "& .rbc-allday-cell": {
      display: "none",
    },

    "& .rbc-time-view .rbc-header": {
      borderColor: theme.colours.calendar.grid,
      borderBottom: "none",
    },

    "& .rbc-header": {
      paddingBlock: theme.space.sm,
      paddingInline: theme.space.xs,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(14),
      fontWeight: theme.typography.fontWeightMedium,
    },

    "& .rbc-events-container": {
      margin: theme.sizes.border.weight,
    },

    "& .rbc-time-view": {
      border: "none",
      borderRadius: theme.radius.card,
      boxShadow: theme.shadows[1],
    },

    "& .rbc-header:last-child, & .rbc-time-header": {
      borderTopRightRadius: theme.radius.card,
      borderRight: "none !important",
    },

    "& .rbc-time-content": {
      borderBottomLeftRadius: theme.radius.card,
      borderBottomRightRadius: theme.radius.card,
      ...(view === "day" && {
        borderTop: "none",
        borderTopRightRadius: theme.radius.card,
      }),
    },

    "& .rbc-time-gutter": {
      fontSize: theme.typography.pxToRem(14),
      color: theme.palette.text.primary,
    },

    "& .rbc-event": {
      border: `${theme.sizes.border.weight}px solid transparent`,
      borderRadius: theme.radius.md,
      padding: theme.space.xs,
      transition: "filter 120ms ease, box-shadow 120ms ease",
    },

    "& .rbc-event-content": {
      fontWeight: theme.typography.fontWeightMedium,
      fontSize: theme.typography.pxToRem(14),
      lineHeight: 1.2,
    },

    "& .rbc-event-label": {
      fontSize: theme.typography.pxToRem(12),
      fontWeight: theme.typography.fontWeightRegular,
      lineHeight: 1.2,
    },

    "& .rbc-event-content .MuiSvgIcon-root": {
      fontSize: theme.sizes.icon.sm,
      marginRight: theme.space.xs,
      verticalAlign: "text-bottom",
    },

    "& .rbc-event.booking-clickable:hover": {
      filter:
        theme.palette.mode === "dark" ? "brightness(1.15)" : "brightness(0.95)",
    },

    "& .rbc-event.booking-clickable:focus-visible": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: -2,
    },

    "& .rbc-current-time-indicator": {
      backgroundColor: theme.palette.primary.main,
    },
  })
);

const BookingCalendarSkeleton = () => (
  <Stack spacing={space.md} sx={{ width: "100%", minWidth: 0 }}>
    {/* "Room Bookings" heading + date picker row */}
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={space.sm}
      sx={{
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "center" },
        width: "100%",
      }}
    >
      <Skeleton
        animation="wave"
        variant="text"
        width={160}
        sx={{ fontSize: 24 }}
      />

      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        {/* previous day (mobile only) */}
        <Skeleton
          animation="wave"
          variant="rounded"
          width={50}
          height={40}
          sx={{ display: { xs: "block", md: "none" } }}
        />
        {/* date picker */}
        <Skeleton
          animation="wave"
          variant="rounded"
          height={40}
          sx={{ width: { xs: "100%", md: 200 } }}
        />
        {/* next day (mobile only) */}
        <Skeleton
          animation="wave"
          variant="rounded"
          width={50}
          height={40}
          sx={{ display: { xs: "block", md: "none" } }}
        />
      </Stack>
    </Stack>

    {/* Previous / Today / Next + Week / Day toolbar (desktop only) */}
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        marginBottom: 2,
        display: { xs: "none", md: "flex" },
      }}
    >
      <Skeleton animation="wave" variant="rounded" width={200} height={30} />
      <Skeleton animation="wave" variant="rounded" width={110} height={30} />
    </Stack>

    {/* calendar grid */}
    <Skeleton
      animation="wave"
      variant="rounded"
      width="100%"
      height={500}
      sx={(theme) => ({
        borderRadius: `${theme.radius.card}px`,
      })}
    />
  </Stack>
);

const BookingCalendar: React.FC<{
  events: Array<Booking>;
  loading?: boolean;
}> = ({ events, loading }) => {
  const theme = useTheme();
  const router = useRouter();

  // Enforce day view on mobile
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dateTime = useSelector(selectDatetime);
  const defaultDate = React.useMemo(() => toSydneyTime(dateTime), [dateTime]);

  const [desktopView, date, setDesktopView, setDate] =
    useBookingCalendarQuery(defaultDate);

  const currView = isMobile ? Views.DAY : desktopView;

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate ?? defaultDate);
  };

  const calendarMin = React.useMemo(() => {
    const DEFAULT_START_HOUR = 9;
    const EARLIEST_ALLOWED_HOUR = 5;

    const sydneyEvents = events.map((event) => ({
      ...event,
      start: toSydneyTime(event.start),
      end: toSydneyTime(event.end),
    }));

    const visibleEvents = sydneyEvents.filter((event) => {
      if (currView === Views.DAY) {
        return (
          event.start.getFullYear() === date.getFullYear() &&
          event.start.getMonth() === date.getMonth() &&
          event.start.getDate() === date.getDate()
        );
      }

      const weekStart = startOfWeek(date, { weekStartsOn: 0 });
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      return event.start >= weekStart && event.start < weekEnd;
    });

    if (visibleEvents.length === 0) {
      return new Date(0, 0, 0, DEFAULT_START_HOUR, 0, 0);
    }

    const earliestHour = Math.min(
      ...visibleEvents.map((e) => e.start.getHours())
    );

    const startHour =
      earliestHour < DEFAULT_START_HOUR
        ? Math.max(EARLIEST_ALLOWED_HOUR, earliestHour)
        : DEFAULT_START_HOUR;

    return new Date(0, 0, 0, startHour, 0, 0);
  }, [events, currView, date]);

  const { components, getNow, localizer, myEvents, scrollToTime } =
    React.useMemo(() => {
      return {
        components: {
          toolbar: CustomToolBar,
          event: CalendarBookingEvent,
        },
        getNow: () => toSydneyTime(new Date()),
        localizer: dateFnsLocalizer({
          format,
          parse,
          startOfWeek,
          getDay,
          locales: enAU,
        }),
        myEvents: events.map((event) => ({
          ...event,
          start: toSydneyTime(event.start),
          end: toSydneyTime(event.end),
        })),
        scrollToTime: calendarMin,
      };
    }, [events, calendarMin]);

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
      if (currView === Views.DAY) {
        return `${booking.name} (${booking.bookingType})`;
      }
      return booking.name;
    },
    [currView]
  );

  const timeInDay = 24 * 60 * 60 * 1000;

  // Render light / dark background based on whether today is in Sydney time.
  const isTodaySydney = (date: Date) =>
    isSameDay(date, toSydneyTime(new Date()));

  const handleBookingSelect = (booking: Booking) => {
    if (!booking.roomId || !booking.occurrenceId) {
      return;
    }

    router.push(getBookingHref(booking.roomId, booking.occurrenceId));
  };

  if (loading) {
    return <BookingCalendarSkeleton />;
  }

  return (
    <Stack
      spacing={space.md}
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={space.sm}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          width: "100%",
        }}
      >
        <Typography variant="h4" component="h2" sx={{ flexShrink: 0 }}>
          Room Bookings
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              width: { xs: "100%", md: "auto" },
            }}
          >
            {isMobile && (
              <IconButton
                aria-label="Previous day"
                sx={{
                  borderRadius: 3,
                  marginRight: 1,
                }}
                onClick={() =>
                  handleDateChange(new Date(date.getTime() - timeInDay))
                }
              >
                <NavigateBeforeIcon
                  style={{ color: theme.colours.accent.primary, fontSize: 40 }}
                />
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
                  marginLeft: 1,
                }}
                onClick={() =>
                  handleDateChange(new Date(date.getTime() + timeInDay))
                }
              >
                <NavigateNextIcon
                  style={{ color: theme.colours.accent.primary, fontSize: 40 }}
                />
              </IconButton>
            )}
          </Stack>
        </LocalizationProvider>
      </Stack>

      <StyledCalendarContainer
        aria-label="Room Booking Calendar"
        role="table"
        view={currView}
        sx={{
          overflow: "auto",
          minWidth: 0,
        }}
      >
        <Calendar
          components={components}
          dayLayoutAlgorithm="no-overlap"
          date={date}
          onNavigate={handleDateChange}
          defaultView={Views.WEEK}
          events={myEvents}
          titleAccessor={titleAccessor}
          tooltipAccessor={({ name, bookingType }) =>
            `${name} (${getBookingTypeLabel(bookingType)})`
          }
          getNow={getNow}
          localizer={localizer}
          scrollToTime={scrollToTime}
          view={currView}
          onView={(nextView) => {
            if (!isMobile) {
              setDesktopView(nextView);
            }
          }}
          eventPropGetter={(booking) => {
            const { colour } = getBookingTypeAppearance(booking.bookingType);
            const appearance = theme.colours.bookingType[colour];
            const clickable = Boolean(booking.roomId && booking.occurrenceId);

            return {
              className: clickable ? "booking-clickable" : undefined,
              style: {
                backgroundColor: appearance.background,
                color: appearance.text,
                borderColor: alpha(appearance.text, 0.24),
                boxShadow: `0 1px 3px ${alpha(appearance.text, 0.1)}`,
                cursor: clickable ? "pointer" : "default",
              },
            };
          }}
          slotGroupPropGetter={() => ({ style: { minHeight: "50px" } })}
          dayPropGetter={(date) => ({
            style: {
              backgroundColor: isTodaySydney(date)
                ? theme.colours.calendar.today
                : theme.palette.background.default,
            },
          })}
          min={calendarMin}
          showMultiDayTimes={true}
          formats={{
            timeGutterFormat: formatTime,
            eventTimeRangeFormat: formatTimeRange,
          }}
          onSelectEvent={handleBookingSelect}
          onKeyPressEvent={(booking, event) => {
            if (
              "key" in event &&
              (event.key === "Enter" || event.key === " ")
            ) {
              event.preventDefault();
              handleBookingSelect(booking);
            }
          }}
        />
      </StyledCalendarContainer>
    </Stack>
  );
};

export default BookingCalendar;
