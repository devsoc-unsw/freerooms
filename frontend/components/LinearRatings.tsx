import { Stack, Typography } from "@mui/material";
import React from "react";
import LinearRating from "./LinearRating";

const LinearRatings = () => {
  return (
    <Stack width="300px" height="50%">
      <Typography
        variant="h2"
        sx={{ fontSize: "20px", fontWeight: "bold" }}
        marginBottom={2}
      >
        Overall Rating
      </Typography>
      <Stack spacing={2} aria-label="Linear Ratings" width="100%">
        <LinearRating value={5} />
        <LinearRating value={4} />
        <LinearRating value={3} />
        <LinearRating value={2} />
        <LinearRating value={1} />
      </Stack>
    </Stack>
  );
};

export default LinearRatings;
