import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import Button from "./Button";

const BookingButton: React.FC<{
  school: string;
  usage: string;
  onClick: () => void;
  label: string;
  role: string;
}> = ({ school, usage, onClick }) => {
  let link = "";
  if (school === " " && usage === "LIB")
    link = "https://unswlibrary-bookings.libcal.com";
  else if (school === " ")
    link =
      "https://www.learningenvironments.unsw.edu.au/make-booking/book-room";

  if (link)
    return (
      <Link target="_blank" href={link}>
        <Button
          sx={{
            px: 2,
            py: 1,
            height: 45,
            marginTop: 2,
            marginBottom: 2,
            width: "100px",
          }}
          aria-label="Make a Booking"
          role="button"
          name="Make a Booking"
          data-testid="booking-button"
        >
          <Typography variant="body2" fontWeight="bold">
            Make a Booking
          </Typography>
        </Button>
      </Link>
    );

  return (
    <Button
      onClick={onClick}
      sx={{
        px: 2,
        py: 1,
        height: 45,
        marginTop: 2,
        marginBottom: 2,
        width: "100px",
      }}
      aria-label="Make a Booking"
      role="button"
      name="Make a Booking"
      data-testid="booking-button"
    >
      <Typography variant="body2" fontWeight="bold">
        Make a Booking
      </Typography>
    </Button>
  );
};

export default BookingButton;
