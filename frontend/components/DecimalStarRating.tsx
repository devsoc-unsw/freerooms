import { Rating, Typography } from "@mui/material";
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
    <>
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
        {overallRating}
      </Typography>
      <Rating
        name="decimal-rating"
        defaultValue={0}
        value={overallRating}
        precision={0.1}
        readOnly
        size="large"
      />
    </>
  );
};

export default DecimalStarRating;
