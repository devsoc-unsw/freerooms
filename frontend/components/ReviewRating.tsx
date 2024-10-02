import { Rating, Typography } from "@mui/material";
import React from "react";

interface ReviewRatingProps {
  text: string;
}

const ReviewRating: React.FC<ReviewRatingProps> = ({ text }) => {
  return (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {text}
      </Typography>
      <Rating
        name={text.toLowerCase()}
        defaultValue={0}
        precision={0.5}
        size="large"
      />
    </>
  );
};

export default ReviewRating;
