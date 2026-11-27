import { space } from "@frontend/theme";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Stack, Typography } from "@mui/material";
import { BookingSummary } from "common/types";

import BookingTypeBadge from "./BookingTypeBadge";

type BookingHeaderProps = {
  booking: Pick<BookingSummary, "name" | "bookingType">;
  roomName?: string;
  buildingName?: string;
};

const BookingHeader = ({
  booking,
  roomName,
  buildingName,
}: BookingHeaderProps) => {
  // If same name only show one
  const location = [...new Set([buildingName, roomName])]
    .filter(Boolean)
    .join(" / ");

  return (
    <Stack spacing={space.md}>
      <BookingTypeBadge bookingType={booking.bookingType} />

      <Typography variant="h3" component="h1" sx={{ overflowWrap: "anywhere" }}>
        {booking.name}
      </Typography>

      {location && (
        <Stack direction="row" spacing={space.xs} sx={{ alignItems: "center" }}>
          <LocationOnOutlinedIcon
            sx={(theme) => ({
              fontSize: theme.sizes.icon.sm,
              color: theme.colours.text.secondary,
              flexShrink: 0,
            })}
          />

          <Typography variant="body1" color="text.secondary">
            {location}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default BookingHeader;
