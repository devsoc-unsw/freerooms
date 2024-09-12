import { Box, Button, Modal } from "@mui/material";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Stack from "@mui/system/Stack";
import React, { useState } from "react";

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
          <Typography
            component="legend"
            variant="h3"
            sx={{
              marginBottom: "16px",
              fontSize: {
                xs: "2.5rem",
                md: "5rem",
              },
              width: "100%",
              textAlign: "center",
            }}
          >
            {4.5}
          </Typography>
          <Rating
            name="decimal-rating"
            defaultValue={4.5}
            precision={0.1}
            readOnly
            size="large"
          />
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
