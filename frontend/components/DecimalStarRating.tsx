import { Rating, Stack, Typography } from "@mui/material";
import React from "react";

const DecimalStarRating = () => {
  return (
    <Stack alignItems="center">
      <Typography
        component="legend"
        variant="h3"
        sx={{
          fontSize: "75px",
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
        size="medium"
        aria-label="decimal-rating"
      />
    </Stack>
  );
};

export default DecimalStarRating;
