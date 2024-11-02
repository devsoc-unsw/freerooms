import { Button } from "@mui/material";
import Stack from "@mui/system/Stack";
import React, { useState } from "react";

import DecimalStarRating from "./DecimalStarRating";
import ReviewModal from "./ReviewModal";

const OverallRating = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Stack direction="column" alignItems="center" justifyContent="center">
      <DecimalStarRating />
      <Button
        onClick={handleOpen}
        sx={{
          textAlign: "center",
          fontSize: "14px",
          color: "#1E90FF",
        }}
        aria-label="Leave A Review"
      >
        Leave a Review
      </Button>
      <ReviewModal open={open} handleClose={handleClose} />
    </Stack>
  );
};

export default OverallRating;
