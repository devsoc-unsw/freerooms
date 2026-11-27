import getBookingHref from "@frontend/utils/getBookingHref";
import { SYDNEY_TIMEZONE } from "@frontend/utils/toSydneyTime";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import {
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { PaginatedBooking } from "common/types";
import { enAU } from "date-fns/locale/en-AU";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";

type BookingsCardProps = {
  booking: PaginatedBooking;
  now: number | null;
};

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  minHeight: "11rem",
  flexDirection: "column",
  borderRadius: theme.radius.card,
  borderColor: theme.colours.accent.secondary,
  backgroundColor: theme.colours.surface.paper,
  transition: theme.transitions.create(["border-color", "box-shadow"]),

  "&:hover, &:focus-within": {
    borderColor: theme.colours.accent.primary,
    boxShadow: theme.shadows[1],
  },
}));

const LabelRow = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.space.md,
  marginBottom: theme.space.sm,
}));

const Label = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.space.xs,
  minWidth: 0,
  color: theme.colours.text.secondary,
  "& svg": { fontSize: theme.sizes.icon.sm, flexShrink: 0 },
}));

const TagsRow = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.space.xs,
}));

const TimeTag = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.space.xs,
  padding: `${theme.space.xs}px ${theme.space.sm}px`,
  border: `1px solid ${theme.colours.accent.tertiary}`,
  borderRadius: theme.radius.pill,
  backgroundColor: theme.colours.accent.quaternary,
  color: theme.colours.text.secondary,
  "& svg": { fontSize: theme.sizes.icon.sm },
}));

const UnavailableRemainingTimeTag = styled(TimeTag)(({ theme }) => ({
  borderColor: theme.colours.status.unavailable.main,
  backgroundColor: theme.colours.status.unavailable.background,
  color: theme.colours.status.unavailable.text,
}));

const SoonRemainingTimeTag = styled(TimeTag)(({ theme }) => ({
  borderColor: theme.colours.status.soon.main,
  backgroundColor: theme.colours.status.soon.background,
  color: theme.colours.text.primary,
}));

const BookingLink = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.space.xs,
  marginLeft: "auto",
  color: theme.colours.text.secondary,
  "& svg": {
    fontSize: theme.sizes.icon.sm,
  },
}));

// Capitalise booking type from enum value
const formatBookingType = (bookingType: string): string =>
  bookingType
    .toLowerCase()
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatBookingDateTime = (
  start: Date,
  end: Date,
  now: number | null,
): string => {
  const startDay = formatInTimeZone(start, SYDNEY_TIMEZONE, "yyyy-MM-dd");

  const today = now
    ? formatInTimeZone(new Date(now), SYDNEY_TIMEZONE, "yyyy-MM-dd")
    : null;

  const dateLabel =
    startDay === today
      ? "Today"
      : formatInTimeZone(start, SYDNEY_TIMEZONE, "do MMMM", { locale: enAU });

  const startTime = formatInTimeZone(
    start,
    SYDNEY_TIMEZONE,
    "h:mma",
  ).toLowerCase();

  const endTime = formatInTimeZone(end, SYDNEY_TIMEZONE, "h:mma").toLowerCase();

  return `${dateLabel}, ${startTime} – ${endTime}`;
};

const BookingsCard = ({ booking, now }: BookingsCardProps) => {
  const timeLeft = now === null ? null : booking.end.getTime() - now;
  const isUnder30Minutes =
    timeLeft !== null && timeLeft > 0 && timeLeft < 30 * 60_000;
  const isUnder10Minutes =
    timeLeft !== null && timeLeft > 0 && timeLeft < 10 * 60_000;
  const bookingHref = getBookingHref(booking.roomId, booking.occurrenceId);

  return (
    <StyledCard variant="outlined">
      <CardActionArea
        component={Link}
        href={bookingHref}
        disableRipple
        sx={(theme) => ({
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          minWidth: 0,
          color: "inherit",
          textDecoration: "none",

          "&:hover .booking-link": {
            color: theme.colours.accent.primary,
          },

          "&.Mui-focusVisible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: -2,
          },
        })}
      >
        <CardContent
          sx={(theme) => ({
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: `${theme.space.lg}px`,
            "&:last-child": { paddingBottom: `${theme.space.md}px` },
          })}
        >
          <Typography
            variant="cardTitle"
            component="h2"
            noWrap
            sx={(theme) => ({
              color: theme.colours.text.primary,
              marginBottom: theme.space.xs,
            })}
          >
            {booking.name}
          </Typography>

          <LabelRow>
            <Label>
              <PlaceOutlinedIcon aria-hidden="true" />
              <Typography variant="body2" noWrap>
                {booking.roomId}
              </Typography>
            </Label>
            <Label>
              <LocalOfferOutlinedIcon aria-hidden="true" />
              <Typography variant="body2">
                {formatBookingType(booking.bookingType)}
              </Typography>
            </Label>
          </LabelRow>

          <TagsRow>
            <TimeTag>
              <AccessTimeOutlinedIcon aria-hidden="true" />
              <Typography variant="body2">
                {formatBookingDateTime(booking.start, booking.end, now)}
              </Typography>
            </TimeTag>

            {isUnder30Minutes ? (
              <SoonRemainingTimeTag>
                <HourglassEmptyOutlinedIcon aria-hidden="true" />
                <Typography variant="body2">{"<"}30 mins left</Typography>
              </SoonRemainingTimeTag>
            ) : isUnder10Minutes ? (
              <UnavailableRemainingTimeTag>
                <HourglassEmptyOutlinedIcon aria-hidden="true" />
                <Typography variant="body2">{"<"}10 mins left</Typography>
              </UnavailableRemainingTimeTag>
            ) : null}
          </TagsRow>

          <Divider
            sx={(theme) => ({
              marginTop: "auto",
              marginBottom: theme.space.sm,
            })}
          />
          <BookingLink className="booking-link">
            Booking page
            <ArrowForwardOutlinedIcon aria-hidden="true" />
          </BookingLink>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default BookingsCard;
