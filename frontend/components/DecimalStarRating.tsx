import { Rating, Stack, Typography } from "@mui/material";
import useRoomRatings from "hooks/useRoomRatings";
import React from "react";

const DecimalStarRating: React.FC<{
  roomID: string;
}> = ({ roomID }) => {
  const { ratings } = useRoomRatings(roomID);
  let overallRating = 0;

  if (ratings && ratings.length > 0) {
    ratings.forEach((rating) => {
      overallRating += rating.overall;
    });
    overallRating = Math.round((overallRating / ratings.length) * 10) / 10;
  }

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
        {overallRating == 0 ? 0 : overallRating.toFixed(1)}
      </Typography>
      <Rating
        name="decimal-rating"
        defaultValue={0}
        value={Number(overallRating.toFixed(1))}
        precision={0.1}
        readOnly
        size="medium"
        aria-label="decimal-rating"
      />
    </Stack>
  );
};

export default DecimalStarRating;
