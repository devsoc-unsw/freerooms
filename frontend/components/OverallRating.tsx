import { Button } from "@mui/material";
import Stack from "@mui/system/Stack";
import React, { useState } from "react";

import DecimalStarRating from "./DecimalStarRating";
import LinearRatings from "./LinearRatings";
import ReviewModal from "./ReviewModal";

const OverallRating = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Stack
      direction="row"
      spacing={2}
      width="100%"
      alignItems="flex-start"
      marginTop={3}
      sx={{ flexGrow: 1 }}
    >
      <LinearRatings />
      <Stack
        spacing={2}
        alignItems={{ xs: "center", sm: "flex-start" }}
        width="40%"
        height="40%"
      >
        <Stack
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
          width="40%"
          height="150%"
          aria-label="Number Star Rating"
        >
          <DecimalStarRating />
          <Button
            onClick={handleOpen}
            sx={{
              textAlign: "center",
              fontSize: "12px",
              color: "#1E90FF",
              "&:hover": {
                backgroundColor: "inherit",
                boxShadow: "none",
              },
            }}
            aria-label="Leave A Review"
          >
            Leave a Review
          </Button>
          <ReviewModal open={open} handleClose={handleClose} />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OverallRating;
