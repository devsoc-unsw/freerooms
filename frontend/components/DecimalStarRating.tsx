import { Rating, Typography } from "@mui/material";
import React from "react";

const DecimalStarRating = () => {
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
        {4.5}
      </Typography>
      <Rating
        name="decimal-rating"
        defaultValue={4.5}
        precision={0.1}
        readOnly
        size="large"
      />
    </>
  );
};

export default DecimalStarRating;
