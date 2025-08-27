import { useTheme } from "@mui/material";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import React from "react";

import Button from "./Button";

const BookingButton: React.FC<{
  school: string;
  usage: string;
  onClick: () => void;
}> = ({ school, usage }) => {
  const theme = useTheme();
  let link = "";
  if (school === " " && usage === "LIB")
    link = "https://unswlibrary-bookings.libcal.com";
  else if (school === " ")
    link =
      "https://www.learningenvironments.unsw.edu.au/make-booking/book-room";

  if (link) {
    return (
      <Link target="_blank" href={link}>
        <Button
          aria-label="Make a Booking"
          name="Make a Booking"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.text.primary,
            height: 45,
            ml: { xs: 0, sm: 1 },
            my: { xs: 1, sm: 0 },
            width: { xs: "100%", sm: "160px" },
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            Make a Booking
          </Typography>
        </Button>
      </Link>
    );
  }

  return (
    <Button
      aria-label="Make a Booking"
      name="Make a Booking"
      sx={{
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.text.primary,
        height: 45,
        ml: { xs: 0, sm: 1 },
        my: { xs: 1, sm: 0 },
        width: { xs: "100%", sm: "160px" },
      }}
      disabled
    >
      <Typography variant="body2" fontWeight="bold">
        Booking Unavailable
      </Typography>
    </Button>
  );
};

export default BookingButton;
