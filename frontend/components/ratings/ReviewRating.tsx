import { Rating, Stack, Typography } from "@mui/material";
import React from "react";

interface ReviewRatingProps {
  category: string;
  ratingCallback: (reviewType: string, rating: number | null) => void;
}

const ReviewRating: React.FC<ReviewRatingProps> = ({
  category,
  ratingCallback,
}) => {
  return (
    <Stack>
      <Typography id="modal-modal-title" variant="body1">
        {category}
      </Typography>
      <Rating
        name={category.toLowerCase()}
        defaultValue={0}
        onChange={(event, value) => ratingCallback(category, value)}
        size="large"
      />
    </Stack>
  );
};

export default ReviewRating;
