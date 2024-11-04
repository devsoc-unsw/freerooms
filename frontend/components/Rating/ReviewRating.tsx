import { Rating, Stack, Typography } from "@mui/material";
import React from "react";

interface ReviewRatingProps {
  category: string;
}

const ReviewRating: React.FC<ReviewRatingProps> = ({ category }) => {
  return (
    <Stack>
      <Typography id="modal-modal-title" variant="body1">
        {category}
      </Typography>
      <Rating defaultValue={0} name={category.toLowerCase()} size="large" />
    </Stack>
  );
};

export default ReviewRating;
