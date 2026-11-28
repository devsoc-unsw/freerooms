import Button from "@frontend/components/ui/Button";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useTheme } from "@mui/material";
import Link from "@mui/material/Link";
import React from "react";

const BookingButton: React.FC<{
  school: string;
  usage: string;
  onClick: () => void;
}> = ({ school, usage }) => {
  const theme = useTheme();

  let link = "";

  if (school === " " && usage === "LIB") {
    link = "https://unswlibrary-bookings.libcal.com";
  } else if (school === " ") {
    link =
      "https://www.learningenvironments.unsw.edu.au/make-booking/book-room";
  }

  const buttonSx = {
    height: theme.sizes.roomNavigation.buttonHeight,
    "&.Mui-disabled": {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
    },
  };

  if (link) {
    return (
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={link}
        sx={{ display: "block", width: "100%" }}
      >
        <Button
          aria-label="Make a Booking"
          name="Make a Booking"
          variant="outlined"
          startIcon={<OpenInNewIcon />}
          fullWidth
          sx={buttonSx}
        >
          Make a Booking
        </Button>
      </Link>
    );
  }

  return (
    <Button
      aria-label="Make a Booking"
      name="Make a Booking"
      variant="outlined"
      startIcon={<OpenInNewIcon />}
      fullWidth
      sx={buttonSx}
      disabled
    >
      Booking Unavailable
    </Button>
  );
};

export default BookingButton;
