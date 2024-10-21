import { Rating, Typography } from "@mui/material";
import React from "react";

interface ReviewRatingProps {
  text: string;
  ratingCallback: (reviewType: string, rating: number | null) => void;
}

const ReviewRating: React.FC<ReviewRatingProps> = ({
  text,
  ratingCallback,
}) => {
  return (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {text}
      </Typography>
      <Rating
        name={text.toLowerCase()}
        defaultValue={0}
        onChange={(event, value) => ratingCallback(text, value)}
        precision={0.5}
        size="large"
      />
    </>
  );
};

export default ReviewRating;
