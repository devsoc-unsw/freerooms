"use client";

import { getBookingTypeAppearance } from "@frontend/utils/bookingAppearance";
import { getBookingTypeLabel } from "@frontend/utils/bookingFormatting";
import Chip from "@mui/material/Chip";

type BookingTypeBadgeProps = {
  bookingType: string;
};

const BookingTypeBadge = ({ bookingType }: BookingTypeBadgeProps) => {
  const { colour, icon: Icon } = getBookingTypeAppearance(bookingType);

  return (
    <Chip
      icon={<Icon />}
      label={getBookingTypeLabel(bookingType)}
      sx={(theme) => ({
        width: "fit-content",
        maxWidth: "100%",
        height: "auto",
        minHeight: theme.space.lg,
        backgroundColor: theme.colours.bookingType[colour].background,
        color: theme.colours.bookingType[colour].text,
        borderRadius: `${theme.radius.lg}px`,
        fontSize: theme.typography.pxToRem(12),
        fontWeight: theme.typography.fontWeightMedium,

        "& .MuiChip-label": {
          whiteSpace: "normal",
          paddingBlock: theme.space.xs,
          paddingInline: theme.space.sm,
        },
        "& .MuiChip-icon": {
          color: "inherit",
          fontSize: theme.sizes.icon.sm,
          marginLeft: theme.space.sm,
          marginRight: 0,
        },
      })}
    />
  );
};

export default BookingTypeBadge;
